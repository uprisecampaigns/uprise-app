
const getSlug = require('speakingurl');
const assert = require('assert');
const knex = require('knex');

const knexConfig = require('config/knexfile.js');

const db = knex(knexConfig[process.env.NODE_ENV]);

const bannedSlugs = require('config/bannedSlugs.js');

const getValidSlug = async (title) => {
  let found;
  let append = 0;
  let slug;

  do {
    found = false;

    if (append > 0) {
      slug = getSlug(title + append, '');
    } else {
      slug = getSlug(title, '');
    }

    if (bannedSlugs.includes(slug)) {
      found = true;
    } else {
      const [actionSlugs, campaignSlugs] = await Promise.all([
        db('actions').where('slug', slug),
        db('campaigns').where('slug', slug),
      ]);

      if ([...actionSlugs, ...campaignSlugs].length > 0) {
        found = true;
      }
    }

    append++;
  } while (found);

  return slug;
};


module.exports = getValidSlug;
