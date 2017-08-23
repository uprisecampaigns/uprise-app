const moment = require('moment');
const RSS = require('rss');

const config = require('config/config.js');

const Campaign = require('models/Campaign.js');
const Action = require('models/Action.js');

const getAction = async (id) => {

  const action = await Action.findOne('id', id);

  const startTime = moment(action.start_time);
  const endTime = moment(action.end_time);

  const dates = { startTime, endTime }

  const location = `${ action.location_name || '' } 
    ${ action.street_address1 || '' } 
    ${ action.street_address2 || '' } 
    ${ action.city || '' }, ${ action.state || '' } ${ action.zipcode || '' } 
     
    ${ action.location_notes || '' } 
  `;

  return { action, dates, location };
}


module.exports = async (app) => {

  app.get('/api/rss/campaign/:slug', async (req, res, next) => {

    try {
      const slug = req.params.slug;
      const campaign = await Campaign.findOne({ slug });

      const feed = new RSS({
        title: `${campaign.title} upcoming volunteer opportunities`,
        description: campaign.description,
        feed_url: `${config.urls.api}/api/rss/campaign/${slug}`,
        site_url: campaign.public_url,
        pubDate: moment().format(),
      });

      await Promise.all(campaign.actions.map( async (action) => {
        Object.assign(action, await Action.details(action, true));

        feed.item({
          title: action.title,
          description: action.description,
          url: action.public_url,
        });
      }));

      return res.send(feed.xml());

    } catch (e) {
      next(e);
    }
  });

  app.get('/api/rss/:search', async (req, res, next) => {

    try {
      const search = req.params.search;
      const actionSearch = await Action.search({ keywords: [search] });
      const actions = actionSearch.actions;

      const feed = new RSS({
        title: `UpRise volunteer opportunities`,
        description: `Opportunities matching keyword: ${search}`,
        feed_url: `${config.urls.api}/api/rss/${search}`,
        site_url: `${config.urls.client}/${search}`,
        pubDate: moment().format(),
      });

      await Promise.all(actions.map( async (action) => {
        Object.assign(action, await Action.details(action, true));

        feed.item({
          title: action.title,
          description: action.description,
          url: action.public_url,
        });
      }));

      return res.send(feed.xml());

    } catch (e) {
      next(e);
    }
  });

}



