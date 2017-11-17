const S3 = require('aws-sdk/clients/s3');

const User = require('models/User');
const Campaign = require('models/Campaign');
const Action = require('models/Action');
const sendEmail = require('lib/sendEmail.js');

const config = require('config/config.js');

const awsConfig = config.aws;
const { postmark } = config;
const { contactEmail } = postmark;

const s3 = new S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.accessKeySecret,
  region: awsConfig.region,
});

const getS3Signature = ({ path, contentType }) => {
  const url = s3.getSignedUrl('putObject', {
    Bucket: awsConfig.bucketName,
    Key: path,
    ACL: 'public-read',
    Expires: awsConfig.expirationTime,
    ContentType: contentType,
  });

  return url;
};

module.exports = {

  fileUploadSignature: async (data, context) => {
    const {
      collectionId, collectionName, fileName,
      contentEncoding, contentType,
    } = data.input;

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    if (collectionName === 'campaigns') {
      const campaign = await Campaign.findOne('id', collectionId);

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const ownsObject = await User.ownsObject({ userId: context.user.id, object: campaign });
      if (!ownsObject) {
        throw new Error('User must be owner of campaign');
      }
    } else {
      throw new Error(`collectionName: ${collectionName} not recognized`);
    }

    const path = `${collectionName}/${collectionId}/${fileName}`;

    const url = getS3Signature({ path, contentEncoding, contentType });

    return {
      url,
    };
  },

  sendMessage: async (options, context) => {
    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const { user } = context;
    const { data } = options;

    // TODO: more sophisticated notion of 'from' emails
    if (data.replyToEmail !== context.user.email) {
      throw new Error('Message must be sent from user\'s email');
    }

    // TODO: more sophisticated determining who can send to whom
    let allowedRecipients = [];
    const userActions = await Action.find('owner_id', user.id);

    // TODO: replace this with parallel promises
    const userActionQueries = [];
    userActions.forEach((action) => {
      userActionQueries.push(Action.signedUpVolunteers({ actionId: action.id }));
    });

    const signedUpVolunteers = (await Promise.all(userActionQueries))
      .reduce((accumulator, value) => accumulator.concat(value), []);

    allowedRecipients = allowedRecipients.concat(signedUpVolunteers);

    const userCampaigns = await Campaign.find('owner_id', user.id);

    // TODO: replace this with parallel promises
    const userCampaignQueries = [];
    userCampaigns.forEach((campaign) => {
      userCampaignQueries.push(Campaign.subscribedUsers({ campaignId: campaign.id }));
    });

    const subscribedUsers = (Promise.all(userCampaignQueries))
      .reduce((accumulator, value) => accumulator.concat(value), []);

    allowedRecipients = allowedRecipients.concat(subscribedUsers);

    const allowedEmails = allowedRecipients.map(v => v.email);

    const errors = [];
    data.recipientEmails.forEach(async (recipient) => {
      if (!allowedEmails.includes(recipient)) {
        errors.push(`User not allowed to message ${recipient}`);
      } else {
        try {
          await sendEmail({
            to: recipient,
            replyTo: data.replyToEmail,
            subject: data.subject,
            templateName: 'compose-message',
            context: { user, body: data.body },
          });
        } catch (e) {
          console.error(e);
          errors.push(e.message);
        }
      }
    });

    if (errors.length) {
      throw new Error(`Errors sending email: ${errors.join(' | ')}`);
    }

    return true;
  },

  contact: async ({ data }, context) => {
    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const { user } = context;

    try {
      await sendEmail({
        to: contactEmail,
        replyTo: user.email,
        subject: `[UpRise Campaigns Contact Form Submission] - ${data.subject}`,
        templateName: 'contact-message',
        context: Object.assign({ user }, data),
      });
    } catch (e) {
      console.error(e);
      throw new Error(`Errors sending email: ${e.message}`);
    }

    return true;
  },

};
