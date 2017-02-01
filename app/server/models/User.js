import validator from 'validator';

const assert = require('assert');
const uuid = require('uuid/v4');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

class User {

  static findOne(...args) {
    return db.table('users').where(...args).first('id', 'email', 'zip');
  }

  static async create(user) {
    const userInfo = {};

    if (!validator.isEmail(user.email)) {
      throw new Error('Email is not valid');
    }

    let rows = await db.table('users').insert(user, ['id', 'email']);

    Object.assign(userInfo, rows[0]);

    const verification = {
      token: uuid(),
      user_id: userInfo.id
    };

    rows = await db.table('user_email_verifications').insert(verification, ['id', 'token']);

    userInfo.verificationToken = rows[0].token;

    return userInfo;
  }

  static getUserProfile(id) {
    return db.table('user_profiles').select().where('id', id);
  }

  static verifyEmail({token: token, userId: userId}) {
    return db.table('user_email_verifications').select().where('token', token)
      .then( (rows) => {
        if (rows.length === 0) {
          throw new Error('User email verification does not exist');
        } else if (rows.length > 1) {
          throw new Error('Somehow more than one email verification exists for that token');
        } else if (rows[0].used) {
          throw new Error('Email token already used');
        } else {

          return db.table('users').
            where('id', userId)
            .update({
              email_confirmed: true
            });
        }
      })
      .then( (updated) => {
        assert(updated === 1);

        return db.table('user_email_verifications')
          .where('token', token)
          .update({
            used: true
          });
      })
      .then( (updated) => {
        assert(updated === 1);
        return {
          userId: userId,
          token: token,
        };
      })
  }

  static async resetPassword(email) {

    if (!validator.isEmail(email)) {
      throw new Error('Email is not valid');
    }

    const user = await db.table('users').where({
      email: email
    }).first();

    if (!user) {
      throw new Error('User not found');
    }

    const resetCode = {
      code: uuid(),
      user_id: user.id
    };

    const rows = await db.table('user_password_resets').insert(resetCode, ['id', 'code']);

    return rows[0];
  }

  static async usePasswordResetCode(code) {

    const reset = await db.table('user_password_resets').where({
      code: code
    }).first();
  
    if (reset.used) {
      throw new Error('Password reset already used');
    }

    //TODO: check for expiration time?

    const rows = await db.table('user_password_resets')
      .where({
        code: code
      })
      .update({
        used: true
      });

    const user = await db.table('users').where({
      id: reset.user_id
    }).first();

    return user;
  }
}

module.exports = User;
