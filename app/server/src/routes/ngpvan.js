const request = require('request');

const User = require('models/User.js');
const Campaign = require('models/Campaign.js');

// const NGP_AUTH = `${NGP_APPLICATION_NAME}:${NGP_API_KEY}|${NGP_MODE}`;

module.exports = (app) => {
  app.get('/api/ngpvan/test', async (req, res) => {
    const options = {
      headers: { 'Content-type': 'application/json' },
      auth: {
        user: NGP_APPLICATION_NAME,
        password: NGP_PASSWORD,
      },
      json: {
        message: 'Hello, world',
      },
      uri: 'https://api.securevan.com/v4/echoes',
    };
    request
      .post(options, (err, res, body) => {
        if (err) {
          console.dir(err);
          return err;
        }
      })
      .pipe(res);
  });

  app.post('/api/ngpvan/findOrCreate', async (req, resLocal) => {
    try {
      const campaign = await Campaign.findOne({ id: req.body.campaignId });
      if (!campaign.ngp_name || !campaign.ngp_key) {
        return resLocal.json({
          error: 'No Application name or API Key',
        });
      }

      const NGP_APPLICATION_NAME = campaign.ngp_name;
      const NGP_API_KEY = campaign.ngp_key;
      const NGP_MODE = '1';
      const NGP_PASSWORD = NGP_API_KEY + '|' + NGP_MODE;

      const options = {
        headers: { 'Content-type': 'application/json' },
        auth: {
          user: NGP_APPLICATION_NAME,
          password: NGP_PASSWORD,
        },
        json: req.body.user,
        uri: 'https://api.securevan.com/v4/people/findOrCreate',
      };
      const ngp = request
        .post(options, (err, res, body) => {
          if (res && res.statusCode) {
            console.dir(res.statusCode);
          }
          console.dir(body);
          resLocal.json(body);
        })
        .on('error', (err) => {
          console.dir(err);
        })
        .on('data', (data) => {
          console.log(`NGP: ${data}`);
        });
    } catch (err) {
      console.dir(err);
      return resLocal.json({
        error: err.message,
      });
    }
  });
};
