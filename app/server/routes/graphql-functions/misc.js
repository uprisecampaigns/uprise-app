const S3 = require('aws-sdk/clients/s3');

const Campaign = require('models/Campaign');
const Action = require('models/Action');
const sendEmail = require('lib/sendEmail.js');

const config = require('config/config.js');

const awsConfig = config.aws;
const contactEmail = config.postmark.contactEmail;

const s3 = new S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.accessKeySecret,
  region: awsConfig.region
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
      contentEncoding, contentType, ...input } = data.input;

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    if (collectionName === 'campaigns') {

      const campaign = await Campaign.findOne('id', collectionId);

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // TODO: Replace this with more sophisticated implementation
      //       inside of Campaign model
      if (campaign.owner_id !== context.user.id) {
        throw new Error('User must be owner of campaign');
      }
    } else {
      throw new Error('collectionName: ' + collectionName + ' not recognized');
    }

    const path = collectionName + '/' + collectionId + '/' + fileName;

    const url = getS3Signature({ path, contentEncoding, contentType });

    return { 
      url: url,
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
    for (let action of userActions) {
      const signedUpVolunteers = await Action.signedUpVolunteers({ actionId: action.id });
      allowedRecipients = allowedRecipients.concat(signedUpVolunteers);
    };

    const userCampaigns = await Campaign.find('owner_id', user.id);

    // TODO: replace this with parallel promises
    for (let campaign of userCampaigns) {
      const subscribedUsers = await Campaign.subscribedUsers({ campaignId: campaign.id });
      allowedRecipients = allowedRecipients.concat(subscribedUsers );
    };

    const allowedEmails = allowedRecipients.map( v => v.email);

    const errors = [];
    data.recipientEmails.forEach( async (recipient) => {

      if (!allowedEmails.includes(recipient)) {
        errors.push('User not allowed to message ' + recipient);
      } else {
        try {
          await sendEmail({
            to: recipient,
            replyTo: data.replyToEmail,
            subject: data.subject,
            templateName: 'compose-message',
            context: { user, body: data.body }
          });
        } catch (e) {
          console.error(e);
          errors.push(e.message);
        }
      }
    });

    if (errors.length) {
      throw new Error('Errors sending email: ' + errors.join(' | '));
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
        subject: '[UpRise Campaigns Contact Form Submission] - ' + data.subject,
        templateName: 'contact-message',
        context: Object.assign({ user }, data)
      });
    } catch (e) {
      console.error(e);
      throw new Error('Errors sending email: ' + e.message);
    }

    return true;
  },

};
