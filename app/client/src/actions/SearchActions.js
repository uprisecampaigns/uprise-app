export const CLEAR_SEARCH = 'CLEAR_SEARCH';

export const ADD_SEARCH_ITEM = 'ADD_SEARCH_ITEM';
export const REMOVE_SEARCH_ITEM = 'REMOVE_SEARCH_ITEM';

export const SET_DATES = 'SET_DATES';
export const UNSET_DATES = 'UNSET_DATES';

export const SORT_BY = 'SORT_BY';

export const clearSearch = searchType => ({ type: CLEAR_SEARCH, searchType });

export const addSearchItem = (searchType, collectionName, value) => ({ type: ADD_SEARCH_ITEM, searchType, collection: collectionName, value });

export const removeSearchItem = (searchType, collectionName, value) => ({ type: REMOVE_SEARCH_ITEM, searchType, collection: collectionName, value });

export const unsetSearchDates = searchType => ({ type: UNSET_DATES, searchType });

export const setSearchDates = (searchType, dates) => {
  unsetSearchDates(searchType);
  return { type: SET_DATES, searchType, dates };
};

export const sortBy = (searchType, selection, descending = undefined) => ({ type: SORT_BY, searchType, selection, descending });
