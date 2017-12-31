const S3 = require('aws-sdk/clients/s3');

const User = require('models/User');
const Campaign = require('models/Campaign');
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
  Query: {
    fileUploadSignature: async (root, args, context) => {
      const {
        collectionId, collectionName, fileName,
        contentEncoding, contentType,
      } = args.input;

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
      } else if (collectionName === 'users') {
        if (context.user.id !== collectionId) {
          throw new Error('Cannot upload profile picture to a different user\'s profile');
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
  },

  Mutation: {
    sendMessage: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;
      const { data } = args;

      // TODO: more sophisticated notion of 'from' emails
      if (data.replyToEmail !== context.user.email) {
        throw new Error('Message must be sent from user\'s email');
      }

      // TODO: more sophisticated determining who can send to whom
      // for now - we just assert that the user has confirmed their email
      // and that they are the owner of at least one campaign
      const usersCampaigns = Campaign.find({ owner_id: user.id });

      if (!user.email_confirmed || usersCampaigns.length === 0) {
        throw new Error('User must have confirmed email and at least one campaign.');
      }

      const errors = [];

      data.recipientIds.forEach(async (recipientId) => {
        try {
          const recipient = await User.findOne({ selections: ['email'], args: { id: recipientId } });

          await sendEmail({
            to: recipient.email,
            replyTo: data.replyToEmail,
            subject: data.subject,
            templateName: 'compose-message',
            context: { user, body: data.body },
          });
        } catch (e) {
          console.error(e);
          errors.push(e.message);
        }
      });

      if (errors.length) {
        throw new Error(`Errors sending email: ${errors.join(' | ')}`);
      }

      return true;
    },

    contact: async (root, { data }, context) => {
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
  },
};
