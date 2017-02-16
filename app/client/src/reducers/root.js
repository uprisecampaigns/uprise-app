import { combineReducers } from 'redux';
import apolloClient from 'store/apolloClient';
import { updateUserInfo } from './AuthReducer';
import { updateOpportunitiesSearch } from './SearchOpportunitiesReducer';

const RootReducer = combineReducers({
  userAuthSession: updateUserInfo,
  opportunitiesSearch: updateOpportunitiesSearch,
  apollo: apolloClient.reducer(),
});

export default RootReducer;

