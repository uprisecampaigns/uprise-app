/* eslint-disable no-unused-vars, func-names */

const UserResult = `
  type UserResult {
    id: String!
    first_name: String
    last_name: String
    phone_number: String
    email: String
    zipcode: String
    email_confirmed: Boolean
  }
`;

const EditAccountInput = `
  input EditAccountInput {
    id: String!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    city: String
    state: String
    zipcode: String
  }
`;

const UserQueries = `
  extend type Query {
    me: UserResult
    emailAvailable(email: String): Boolean
  }
`;

const UserMutations = `
  extend type Mutation {
    editAccount(data: EditAccountInput): UserResult
    resendEmailVerification: Boolean
    confirmEmail(token: String!): Boolean
  }
`;

module.exports = function () {
  return [
    UserResult, EditAccountInput,
    UserMutations, UserQueries,
  ];
};
