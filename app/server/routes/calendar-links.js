const os = require('os');
const moment = require('moment');
const ical = require('ical-generator');

const Action = require('models/Action.js');

const getAction = async (id) => {
  const action = await Action.findOne('id', id);

  const startTime = moment(action.start_time);
  const endTime = moment(action.end_time);

  const dates = { startTime, endTime };

  const location = `${action.location_name || ''} 
    ${action.street_address1 || ''} 
    ${action.street_address2 || ''} 
    ${action.city || ''}, ${action.state || ''} ${action.zipcode || ''} 
     
    ${action.location_notes || ''} 
  `;

  return { action, dates, location };
};


module.exports = async (app) => {
  app.get('/api/calendar-links/google/:id', async (req, res, next) => {
    try {
      const id = req.params.id;

      const { action, dates, location } = await getAction(id);

      // FROM: http://stackoverflow.com/a/21653600/1787596
      // TODO: to send directly to mobile site, use this base url
      // https://calendar.google.com/calendar/gp#~calendar:view=e&bm=1
      const googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE' +
        `&text=${encodeURIComponent(action.title)}` +
        `&dates=${encodeURIComponent(dates.startTime.toISOString().replace(/-|:|\.\d\d\d/g, ''))}/${encodeURIComponent(dates.endTime.toISOString().replace(/-|:|\.\d\d\d/g, ''))}` +
        `&details=${encodeURIComponent(action.description)}` +
        `&location=${encodeURIComponent(location)}`;

      res.redirect(googleCalendarUrl);
    } catch (e) {
      next(e);
    }
  });

  app.get('/api/calendar-links/ics/:id', async (req, res, next) => {
    try {
      const id = req.params.id;

      const { action, dates, location } = await getAction(id);

      const cal = ical({
        name: 'UpRise Campaigns Calendar',
        domain: os.hostname(),
      });

      const icalEvent = cal.createEvent({
        start: dates.startTime.toDate(),
        end: dates.endTime.toDate(),
        summary: action.title,
        description: action.description,
        location,
        status: 'confirmed',
        url: action.public_url,
      });

      const icalFilename = `${action.title}.ics`;

      res.setHeader('Content-disposition', `attachment;filename=${icalFilename}`);
      res.setHeader('Content-type', 'data:text/Calendar');

      res.end(cal.toString());
    } catch (e) {
      next(e);
    }
  });
};

