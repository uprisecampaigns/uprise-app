import { combineReducers } from 'redux';
import { updateUserInfo } from './AuthReducer';
import { updateProfileData } from './ProfileReducer';

const RootReducer = combineReducers({
  userAuthSession: updateUserInfo,
  userProfileData: updateProfileData
});

export default RootReducer;

