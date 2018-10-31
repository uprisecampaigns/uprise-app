import fetch from 'isomorphic-fetch';
import history from 'lib/history';
import apolloClient from 'store/apolloClient';

import { notify } from 'actions/NotificationsActions';

export function NGPVanTest(data) {
  return async (dispatch, getState) => {
    try {
      const response = await fetch('/api/ngpvan/echo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
    } catch (err) {
      console.error(err);
    }
  };
}

export function NGPVanFindOrCreate(data) {
  return async (dispatch, getState) => {
    try {
      const response = await fetch('/api/ngpvan/findOrCreate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();
      if (res && res.errors) {
        if (res.errors[0] && res.errors[0].code && res.errors[0].code === 'FORBIDDEN') {
          dispatch(notify('Invalid API Key'));
        } else {
          dispatch(notify('There was an issue, please try again later.'));
        }
      }
      return await res;
    } catch (err) {
      console.error(err);
    }
  };
}
