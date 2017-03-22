import { combineReducers } from 'redux';
import apolloClient from 'store/apolloClient';
import { updateUserInfo } from './AuthReducer';
import { updateNotifications } from './NotificationsReducer';
import { updateSearch } from './SearchReducer';

function createFilteredReducer(reducerFunction, reducerPredicate) {
  return (state, action) => {
    const isInitializationCall = state === undefined;
    const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
  }
}

const RootReducer = combineReducers({
  userAuthSession: updateUserInfo,
  notifications: updateNotifications,
  actionsSearch: createFilteredReducer(updateSearch, action => action.searchType === 'action'),
  campaignsSearch: createFilteredReducer(updateSearch, action => action.searchType === 'campaign'),
  apollo: apolloClient.reducer(),
});

export default RootReducer;

