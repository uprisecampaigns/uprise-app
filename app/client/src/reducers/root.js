import { combineReducers } from 'redux';
import apolloClient from 'store/apolloClient';
import { updateUserInfo } from './AuthReducer';

const RootReducer = combineReducers({
  userAuthSession: updateUserInfo,
  apollo: apolloClient.reducer(),
});

export default RootReducer;

