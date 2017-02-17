import history from 'lib/history';

export const ADD_SEARCH_ITEM = 'ADD_SEARCH_ITEM';
export const REMOVE_SEARCH_ITEM = 'REMOVE_SEARCH_ITEM';

export const addSearchItem = (collectionName, value) => {
  return { type: ADD_SEARCH_ITEM, collection: collectionName, value };
};

export const removeSearchItem = (collectionName, value) => {
  return { type: ADD_SEARCH_ITEM, collection: collectionName, value };
};

