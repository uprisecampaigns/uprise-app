const validator = require('validator');
const assert = require('assert');
const uuid = require('uuid/v4');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const config = require('config/config.js');
const knexConfig = require('config/knexfile.js');

const db = knex(knexConfig[process.env.NODE_ENV]);
const sendEmail = require('lib/sendEmail.js');

class User {
  static findOne(...args) {
    return db.table('users').where(...args).first(
      'id', 'first_name', 'last_name', 'email',
      'phone_number', 'zipcode', 'email_confirmed',
    );
  }

  static async create(user) {
    const userInfo = {};

    if (!validator.isEmail(user.email)) {
      throw new Error('Email is not valid');
    }

    const rows = await db.table('users').insert(user, ['id', 'email']);

    Object.assign(userInfo, rows[0]);
    return userInfo;
  }

  static async edit(options) {
    const userResult = await db('users')
      .where('id', options.id)
      .update(options, [
        'id', 'first_name', 'last_name', 'email', 'phone_number', 'zipcode', 'email_confirmed',
      ]);

    return userResult[0];
  }

  static getUserProfile(id) {
    return db.table('user_profiles').select().where('id', id);
  }

  static async verifyEmail({ token }) {
    const tokenResult = await db.table('user_email_verifications').select().where('token', token).first();

    if (!tokenResult) {
      throw new Error('User email verification does not exist');
    } else if (tokenResult.used) {
      console.error(`Email Verification token already used: ${token}`);
      return { token };
    }

    let updated = await db.table('users')
      .where('id', tokenResult.user_id)
      .update({
        email_confirmed: true,
      });

    assert(updated === 1);

    updated = await db.table('user_email_verifications')
      .where('token', token)
      .update({
        used: true,
      });

    assert(updated === 1);

    return { token };
  }

  static async changePassword(userId, newPassword, oldPassword) {
    const user = await db.table('users').where({
      id: userId,
    }).first();

    if (!user) {
      throw new Error('User not found');
    }

    // if the password is being reset, we don't need an old password
    if (!user.password_being_reset && !bcrypt.compareSync(oldPassword, user.password_hash)) {
      throw new Error('Incorrect password.');
    }

    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    const resultRows = await db.table('users')
      .where({
        id: userId,
      })
      .update({
        password_being_reset: false,
        password_hash: newPasswordHash,
      }, ['id']);

    if (resultRows.length !== 1) {
      throw new Error('Error changing password');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  static async resetPassword(email, req) {
    if (!validator.isEmail(email)) {
      throw new Error('Email is not valid');
    }

    const user = await db.table('users').where({
      email,
    }).first();

    if (!user) {
      throw new Error('User not found');
    }

    const resetCodeData = {
      code: uuid(),
      ip: req.ip,
      user_id: user.id,
    };

    const rows = await db.table('user_password_resets').insert(resetCodeData, ['id', 'code']);

    const resetCode = rows[0];

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      templateName: 'password-reset-email',
      context: {
        resetURL: `${config.urls.api}/use-password-reset/${resetCode.code}`,
      },
    });

    return {
      email: user.email,
    };
  }

  static async usePasswordResetCode(code) {
    const reset = await db.table('user_password_resets').where({
      code,
    }).first();

    if (reset.used) {
      throw new Error('Password reset already used');
    }

    // TODO: check for expiration time?
    await db.table('user_password_resets')
      .where({
        code,
      })
      .update({
        used: true,
      }, ['id']);

    const userResults = await db.table('users')
      .where({
        id: reset.user_id,
      })
      .update({
        password_being_reset: true,
      }, ['id', 'email']);

    if (userResults.length !== 1) {
      throw new Error('Error using password reset code');
    }

    return userResults[0];
  }

  static async ownsObject({ user, object, userId }) {
    const userTest = (!(user && typeof user.superuser === 'boolean')) ?
      await db.table('users').where('id', userId).first() :
      user;

    return (object.owner_id === userTest.id || userTest.superuser);
  }

  static async sendVerificationEmail(u) {
    const user = { ...u };

    const verification = {
      token: uuid(),
      user_id: user.id,
    };

    const rows = await db.table('user_email_verifications').insert(verification, ['id', 'token']);

    user.verificationToken = rows[0].token;

    return sendEmail({
      to: user.email,
      subject: 'Confirm your email address',
      templateName: 'verification-email',
      context: {
        verifyURL: `${config.urls.client}settings/confirm-email/${user.verificationToken}`,
      },
    });
  }
}

module.exports = User;
