/* eslint-disable no-unused-vars, func-names */

const FileUploadSignatureResult = `
  type FileUploadSignatureResult {
    url: String!
  }
`;

const FileToUpload = `
  input FileToUpload {
    collectionId: String!
    collectionName: String!
    fileName: String!
    contentType: String!
  }
`;

const FileUploadSignatureQuery = `
  extend type Query {
    fileUploadSignature(input: FileToUpload!): FileUploadSignatureResult
  }
`;

module.exports = function () {
  return [FileUploadSignatureResult, FileToUpload, FileUploadSignatureQuery];
};
