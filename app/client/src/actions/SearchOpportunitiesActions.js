import history from 'lib/history';

export const ADD_SEARCH_ITEM = 'ADD_SEARCH_ITEM';
export const REMOVE_SEARCH_ITEM = 'REMOVE_SEARCH_ITEM';

export const SET_DATES = 'SET_DATES';
export const UNSET_DATES = 'UNSET_DATES';

export const SORT_BY = 'SORT_BY';

export const addSearchItem = (collectionName, value) => {
  return { type: ADD_SEARCH_ITEM, collection: collectionName, value };
};

export const removeSearchItem = (collectionName, value) => {
  return { type: REMOVE_SEARCH_ITEM, collection: collectionName, value };
};

export const setSearchDates = (dates) => {
  unsetSearchDates();
  return { type: SET_DATES, dates };
};

export const unsetSearchDates = () => {
  return { type: UNSET_DATES };
};

export const sortBy = (selection) => {
  return { type: SORT_BY, selection };
};
