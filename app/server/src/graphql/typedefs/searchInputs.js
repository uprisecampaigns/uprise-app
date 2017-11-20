/* eslint-disable no-unused-vars, func-names */

const DateSearchInput = `
  input DateSearchInput {
    ongoing: Boolean
    onDate: String
    startDate: String
    endDate: String
  }
`;

const GeographySearchInput = `
  input GeographySearchInput {
    zipcode: String
    distance: Int
    virtual: Boolean
  }
`;

const SortByInput = `
  input SortByInput {
    name: String
    descending: Boolean
  }
`;

module.exports = function () {
  return [
    DateSearchInput, GeographySearchInput, SortByInput,
  ];
};
