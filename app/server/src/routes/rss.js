const moment = require('moment-timezone');
const zipcodeToTimezone = require('zipcode-to-timezone');
const RSS = require('rss');
const ejs = require('ejs');

const config = require('config/config.js');

const Campaign = require('models/Campaign.js');
const Action = require('models/Action.js');

const getContext = (action) => {
  const timezone = (action.zipcode && zipcodeToTimezone.lookup(action.zipcode)) ? zipcodeToTimezone.lookup(action.zipcode) : 'America/New_York';

  const hasDate = !action.ongoing || moment(action.start_time).isValid();
  const date = moment(action.start_time).tz(timezone);
  const prettyDate = hasDate ? date.format('dddd, MMMM Do YYYY, h:mma z') : undefined;

  const hasLocation = action.city || action.state;

  return {
    action,
    date,
    prettyDate,
    hasLocation,
    hasDate,
  };
};

module.exports = async (app) => {
  app.get('/api/rss/campaign/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const campaign = await Campaign.findOne({ slug });

      const feed = new RSS({
        title: `${campaign.title} upcoming volunteer opportunities`,
        description: campaign.description,
        feed_url: `${config.urls.api}/api/rss/campaign/${slug}`,
        site_url: campaign.public_url,
        image_url: campaign.profile_image_url,
        pubDate: moment().toDate(),
      });

      const actions = campaign.actions.filter(action => moment(action.end_time).isAfter(moment()) || action.ongoing);

      await Promise.all(actions.map(async (a) => {
        const details = await Action.details(a, true);
        const action = { ...a, ...details };
        action.campaign_title = campaign.title;

        const context = getContext(action);

        ejs.renderFile(`${config.paths.base}/views/action-description-rss.ejs`, context, (err, textBody) => {
          if (err) {
            throw new Error(err);
          } else {
            feed.item({
              title: action.title,
              author: campaign.title,
              guid: action.id,
              description: textBody,
              url: action.public_url,
              date: context.hasDate && context.date.toDate(),
            });
          }
        });
      }));

      return res.send(feed.xml());
    } catch (e) {
      return next(e);
    }
  });

  app.get('/api/rss/:search', async (req, res, next) => {
    try {
      const { search } = req.params;
      const actionSearch = await Action.search({
        keywords: [search],
        dates: {
          startDate: moment().format(),
          ongoing: true,
        },
      });

      const { actions } = actionSearch;

      const feed = new RSS({
        title: 'UpRise Volunteer Opportunities',
        description: `Opportunities matching keyword: ${search}`,
        feed_url: `${config.urls.api}/api/rss/${search}`,
        site_url: `${config.urls.client}/${search}`,
        // TODO: Replace this with a relative link to an image we are hosting!
        image_url: 'https://upriseweb.files.wordpress.com/2017/06/cropped-headerlogowspace.png',
        pubDate: moment().toDate(),
      });

      await Promise.all(actions.map(async (action) => {
        Object.assign(action, await Action.details(action, false));

        const context = getContext(action);

        ejs.renderFile(`${config.paths.base}/views/action-description-rss.ejs`, context, (err, textBody) => {
          if (err) {
            throw new Error(err);
          } else {
            feed.item({
              title: `${action.campaign_title} - ${action.title}`,
              author: action.campaign_title,
              guid: action.id,
              description: textBody,
              url: action.public_url,
              date: context.hasDate && context.date.toDate(),
            });
          }
        });
      }));

      return res.send(feed.xml());
    } catch (e) {
      return next(e);
    }
  });
};

