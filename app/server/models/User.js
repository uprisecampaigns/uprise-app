
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

class User {

  static findOne(...args) {
    return db.table('users').where(...args).first('id', 'email');
  }

  static findOneByLogin(provider, key) {
    return db.table('users')
      .leftJoin('user_logins', 'users.id', 'user_logins.user_id')
      .where({ 'user_logins.name': provider, 'user_logins.key': key })
      .first('id', 'email');
  }

  static any(...args) {
    return db.raw('SELECT EXISTS ?', db.table('users').where(...args).select(db.raw('1')))
      .then(x => x.rows[0].exists);
  }

  static create(user) {
    return db.table('users')
      .insert(user, ['id', 'email']).then(x => x[0]);
  }

  static getUserProfile(id) {
    return db.table('user_profiles').select().where('id', id);
  }

// TODO: much confuse....
//   static setClaims(userId, provider, providerKey, claims) {
//     return db.transaction(trx => Promise.all([
//       trx.table('user_logins').insert({
//         user_id: userId,
//         name: provider,
//         key: providerKey,
//       }),
//       ...claims.map(claim => trx.raw('SELECT EXISTS ?', trx.table('user_claims')
//         .where({ user_id: userId, type: claim.type }))
//         .then(x => x.rows[0].exists ? // eslint-disable-line no-confusing-arrow
//           trx.table('user_claims')
//             .where({ user_id: userId, type: claim.type })
//             .update({ value: claim.value }) :
//           trx.table('user_claims')
//             .insert({ user_id: userId, type: claim.type, value: claim.value }))),
//     ]));
//   }


}

module.exports = User;
