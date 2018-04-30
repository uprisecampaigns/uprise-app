/* eslint-disable import/prefer-default-export */

import isEqual from 'lodash.isequal';

import {
  CLEAR_SEARCH,
  ADD_SEARCH_ITEM,
  REMOVE_SEARCH_ITEM,
  ADD_DEFAULT_SEARCH_ITEM,
  SET_DATES,
  UNSET_DATES,
  SORT_BY,
} from 'actions/SearchActions';

export const defaultStartState = {
  defaultSet: false,
  keywords: [],
  tags: [],
  activities: [],
  campaignNames: [],
  dates: {},
  times: [],
  geographies: [],
  sortBy: {
    name: 'date',
    descending: false,
  },
};

export const defaultCampaignStartState = {
  ...defaultStartState,
  sortBy: {
    name: 'title',
    descending: false,
  },
};

export const defaultActionStartState = { ...defaultStartState };

export function updateSearch(searchState = defaultStartState, action) {
  switch (action.type) {
    case ADD_SEARCH_ITEM: {
      let collection = Array.from(searchState[action.collection]);

      if ((typeof action.value === 'string' &&
            action.value.trim() !== '' &&
            !collection.find(item => item.trim().toLowerCase() === action.value.trim().toLowerCase())) ||
          (typeof action.value === 'object' &&
            !collection.find(item => isEqual(item, action.value)))) {
        // If doing geography search, replace item if the zipcode is already in the collection
        if (action.collection === 'geographies' && typeof action.value.zipcode !== 'undefined') {
          const existing = collection.find(item => item.zipcode === action.value.zipcode);
          if (existing) {
            collection = collection.filter(item => item.zipcode !== action.value.zipcode);
          }
        }

        collection.push(typeof action.value === 'string' ? action.value.trim() : action.value);
      }

      return Object.assign({}, searchState, {
        [action.collection]: collection,
      });
    }

    case ADD_DEFAULT_SEARCH_ITEM: {
      const collection = Array.from(searchState[action.collection]);

      // Only add this search type if none exists already
      if (!searchState.defaultSet) {
        if ((typeof action.value === 'string' && action.value.trim() !== '') ||
            (typeof action.value === 'object')) {
          collection.push(typeof action.value === 'string' ? action.value.trim() : action.value);
        }
      }

      return Object.assign({}, searchState, {
        defaultSet: true,
        [action.collection]: collection,
      });
    }

    case REMOVE_SEARCH_ITEM: {
      return Object.assign({}, searchState, {
        [action.collection]: searchState[action.collection].filter(item => item !== action.value && !isEqual(item, action.value)),
      });
    }

    case SET_DATES: {
      return Object.assign({}, searchState, {
        dates: action.dates,
      });
    }

    case UNSET_DATES: {
      return Object.assign({}, searchState, {
        dates: {},
      });
    }

    case SORT_BY: {
      const state = searchState;
      const sortBy = {
        name: action.selection,
      };

      if (typeof action.descending === 'boolean') {
        sortBy.descending = action.descending;
      } else {
        sortBy.descending = (state.sortBy.name === action.selection) ? !state.sortBy.descending : false;
      }

      return Object.assign({}, searchState, { sortBy });
    }

    case CLEAR_SEARCH: {
      return defaultStartState;
    }

    default: {
      return searchState;
    }
  }
}
