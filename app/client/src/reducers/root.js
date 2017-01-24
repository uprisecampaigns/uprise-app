import { combineReducers } from 'redux';
import { updateUserInfo } from './AuthReducer';

const RootReducer = combineReducers({
  userAuthSession: updateUserInfo,
});

export default RootReducer;

