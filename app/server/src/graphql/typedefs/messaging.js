/* eslint-disable no-unused-vars, func-names */

const SendMessageInput = `
  input SendMessageInput {
    replyToEmail: String!
    recipientIds: [String]!
    subject: String
    body: String
  }
`;

const ContactInput = `
  input ContactInput {
    subject: String!
    body: String!
  }
`;

const MessageMutations = `
  extend type Mutation {
    sendMessage(data: SendMessageInput!): Boolean
    contact(data: ContactInput!): Boolean
  }
`;

module.exports = function () {
  return [SendMessageInput, ContactInput, MessageMutations];
};
