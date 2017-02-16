import { ADD_KEYWORD, REMOVE_KEYWORD,
         ADD_ACTIVITY, REMOVE_ACTIVITY } from 'actions/SearchOpportunitiesActions.js';

const defaultStartState = { keywords: [], 
                            activities: [], 
                          }

export function updateOpportunitiesSearch(searchOpportunitiesState = defaultStartState, action) {
  switch (action.type){
   
    case ADD_KEYWORD:
    case ADD_ACTIVITY:
      const collection = Array.from(searchOpportunitiesState[action.collection]);

      if (action.value.trim() !== '' &&
          !collection.find(item => item.toLowerCase() === action.value.toLowerCase())) {
        collection.push(action.value);
      
        return Object.assign({}, searchOpportunitiesState, { 
          [action.collection]: collection
        });
      }

    case REMOVE_KEYWORD:
    case REMOVE_ACTIVITY:
      return Object.assign({}, searchOpportunitiesState, { 
        [action.collection]: searchOpportunitiesState[action.collection].filter( (item) => {
          return item !== action.value;
        })
      });

    default: 
      return searchOpportunitiesState;
  }
}
