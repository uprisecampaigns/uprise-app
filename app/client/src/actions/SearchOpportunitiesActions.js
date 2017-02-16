import history from 'lib/history';

export const ADD_KEYWORD = 'ADD_KEYWORD';
export const REMOVE_KEYWORD = 'REMOVE_KEYWORD';

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY';

export function addKeyword(keyword) {
  return { type: ADD_KEYWORD, collection: 'keywords', value: keyword };
}

export function removeKeyword(keyword) {
  return { type: REMOVE_KEYWORD, collection: 'keywords', value: keyword };
}

export function addActivity(activity) {
  return { type: ADD_ACTIVITY, collection: 'activities', value: activity };
}

export function removeActivity(activity) {
  return { type: REMOVE_ACTIVITY, collection: 'activities', value: activity };
}

