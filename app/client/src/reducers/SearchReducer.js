const isEqual = require('lodash.isequal');

import { 
  ADD_SEARCH_ITEM, 
  REMOVE_SEARCH_ITEM,
  SET_DATES,
  UNSET_DATES,
  SORT_BY,
} from 'actions/SearchActions.js';

export const defaultStartState = { 
  keywords: [], 
  activities: [], 
  types: [], 
  levels: [], 
  issueAreas: [], 
  campaignNames: [], 
  dates: {}, 
  times: [], 
  geographies: [], 
  sortBy: {
    name: 'date',
    descending: false
  }
};

export function updateSearch(searchState = defaultStartState, action) {
  switch (action.type){
   
    case ADD_SEARCH_ITEM:
      let collection = Array.from(searchState[action.collection]);

      if (( typeof action.value === 'string' &&
            action.value.trim() !== '' &&
            !collection.find(item => item.trim().toLowerCase() === action.value.trim().toLowerCase())) ||
          ( typeof action.value === 'object' && 
            !collection.find(item => isEqual(item, action.value)))) {

        // If doing geography search, replace item if the zipcode is already in the collection
        if (action.collection === 'geographies' && typeof action.value.zipcode !== undefined) {
          const existing = collection.find(item => item.zipcode === action.value.zipcode);
          if (existing) {
            collection = collection.filter(item => item.zipcode !== action.value.zipcode)
          }
        }

        collection.push(
          typeof action.value === 'string' ? action.value.trim() : action.value
        );
      }
      
      return Object.assign({}, searchState, { 
        [action.collection]: collection
      });

    case REMOVE_SEARCH_ITEM:
      return Object.assign({}, searchState, { 
        [action.collection]: searchState[action.collection].filter( (item) => {
          return item !== action.value && !isEqual(item, action.value);
        })
      });

    case SET_DATES:
      return Object.assign({}, searchState, { 
        dates: action.dates
      });

    case UNSET_DATES:
      return Object.assign({}, searchState, { 
        dates: {}
      });

    case SORT_BY:

      const state = searchState;
      const sortBy = {
        name: action.selection,
      };

      sortBy.descending = (state.sortBy.name === action.selection) ? !state.sortBy.descending : false;

      return Object.assign({}, searchState, { sortBy });

    default: 
      return searchState;
  }
};
