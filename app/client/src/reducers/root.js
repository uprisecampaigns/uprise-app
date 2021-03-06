import { combineReducers } from 'redux';
import apolloClient from 'store/apolloClient';
import { updateUserInfo } from './AuthReducer';
import { updateActionSignup } from './ActionSignupReducer';
import { updateNotifications } from './NotificationsReducer';
import { updateSearch } from './SearchReducer';
import { updateUploads } from './UploadReducer';
import { updateMessages } from './MessageReducer';
import { updatePageNav } from './PageNavReducer';

function createFilteredReducer(reducerFunction, reducerPredicate) {
  return (state, action) => {
    const isInitializationCall = (state === undefined) || (action.type === '@@redux/INIT');
    const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
  };
}

const appReducer = combineReducers({
  userAuthSession: updateUserInfo,
  uploads: updateUploads,
  messages: updateMessages,
  notifications: updateNotifications,
  actionSignup: updateActionSignup,
  actionsSearch: createFilteredReducer(updateSearch, action => action.searchType === 'action'),
  eventSearch: createFilteredReducer(updateSearch, action => action.searchType === 'event'),
  roleSearch: createFilteredReducer(updateSearch, action => action.searchType === 'role'),
  campaignsSearch: createFilteredReducer(updateSearch, action => action.searchType === 'campaign'),
  usersSearch: createFilteredReducer(updateSearch, action => action.searchType === 'user'),
  pageNav: updatePageNav,
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

