const isEqual = require('lodash.isequal');

import { 
  ADD_SEARCH_ITEM, 
  REMOVE_SEARCH_ITEM,
  SET_DATES,
  UNSET_DATES,
  SORT_BY,
} from 'actions/SearchOpportunitiesActions.js';

const defaultStartState = { 
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

export function updateOpportunitiesSearch(searchOpportunitiesState = defaultStartState, action) {
  switch (action.type){
   
    case ADD_SEARCH_ITEM:
      const collection = Array.from(searchOpportunitiesState[action.collection]);

      if (( typeof action.value === 'string' &&
            action.value.trim() !== '' &&
            !collection.find(item => item.toLowerCase() === action.value.toLowerCase())) ||
          ( typeof action.value === 'object' && 
            !collection.find(item => isEqual(item, action.value)))) {

        collection.push(action.value);
      }
      
      return Object.assign({}, searchOpportunitiesState, { 
        [action.collection]: collection
      });

    case REMOVE_SEARCH_ITEM:
      return Object.assign({}, searchOpportunitiesState, { 
        [action.collection]: searchOpportunitiesState[action.collection].filter( (item) => {
          return item !== action.value && !isEqual(item, action.value);
        })
      });

    case SET_DATES:
      return Object.assign({}, searchOpportunitiesState, { 
        dates: action.dates
      });

    case UNSET_DATES:
      return Object.assign({}, searchOpportunitiesState, { 
        dates: {}
      });

    case SORT_BY:

      const state = searchOpportunitiesState;
      const sortBy = {
        name: action.selection,
      };

      sortBy.descending = (state.sortBy.name === action.selection) ? !state.sortBy.descending : false;

      return Object.assign({}, searchOpportunitiesState, { sortBy });

    default: 
      return searchOpportunitiesState;
  }
};
