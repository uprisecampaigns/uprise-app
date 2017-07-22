import { combineReducers } from 'redux';
import apolloClient from 'store/apolloClient';
import { updateUserInfo } from './AuthReducer';
import { updateNotifications } from './NotificationsReducer';
import { updateSearch } from './SearchReducer';
import { updateUploads } from './UploadReducer';
import { updateMessages } from './MessageReducer';

function createFilteredReducer(reducerFunction, reducerPredicate) {
  return (state, action) => {
    const isInitializationCall = state === undefined;
    const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
  };
}

const appReducer = combineReducers({
  userAuthSession: updateUserInfo,
  uploads: updateUploads,
  messages: updateMessages,
  notifications: updateNotifications,
  actionsSearch: createFilteredReducer(updateSearch, action => action.searchType === 'action'),
  campaignsSearch: createFilteredReducer(updateSearch, action => action.searchType === 'campaign'),
  apollo: apolloClient.reducer(),
});

const rootReducer = (state, action) => {
  let newState = { ...state };
  if (action.type === 'LOGOUT_SUCCESS') {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;

