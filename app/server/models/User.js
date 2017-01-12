
const assert = require('assert');
const uuid = require('uuid/v4');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

class User {

  static findOne(...args) {
    return db.table('users').where(...args).first('id', 'email');
  }

  static async create(user) {
    const userInfo = {};
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
}

module.exports = User;
