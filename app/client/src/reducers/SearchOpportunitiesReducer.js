import { 
  ADD_SEARCH_ITEM, 
  REMOVE_SEARCH_ITEM,
} from 'actions/SearchOpportunitiesActions.js';

const defaultStartState = { 
  keywords: [], 
  activities: [], 
  types: [], 
  levels: [], 
  issueAreas: [], 
  campaignNames: [], 
};

export function updateOpportunitiesSearch(searchOpportunitiesState = defaultStartState, action) {
  switch (action.type){
   
    case ADD_SEARCH_ITEM:
      const collection = Array.from(searchOpportunitiesState[action.collection]);

      if (action.value.trim() !== '' &&
          !collection.find(item => item.toLowerCase() === action.value.toLowerCase())) {
        collection.push(action.value);
      }
      
      return Object.assign({}, searchOpportunitiesState, { 
        [action.collection]: collection
      });

    case REMOVE_SEARCH_ITEM:
      return Object.assign({}, searchOpportunitiesState, { 
        [action.collection]: searchOpportunitiesState[action.collection].filter( (item) => {
          return item !== action.value;
        })
      });

    default: 
      return searchOpportunitiesState;
  }
};
