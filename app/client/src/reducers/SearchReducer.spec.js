import { updateSearch } from './SearchReducer';
const isEqual = require('lodash.isequal');

import { 
  ADD_SEARCH_ITEM, 
  REMOVE_SEARCH_ITEM,
  SET_DATES,
  UNSET_DATES,
  SORT_BY,
} from 'actions/SearchActions.js';

import { defaultStartState } from './SearchReducer';


describe('(Reducer) SearchReducer', () => {

  test('should return the initial state', () => {
    expect(isEqual(updateSearch(undefined, {}), {
      keywords: [], 
      activities: [], 
      campaignNames: [], 
      dates: {}, 
      times: [], 
      geographies: [], 
      sortBy: {
        name: 'date',
        descending: false
      }
    })).toBe.true;
  });

  test('should handle adding a search term string', () => {

    expect(
      isEqual(
        updateSearch(undefined, {
          type: ADD_SEARCH_ITEM,
          collection: 'keywords',
          value: 'a new keyword'
        }),
        {
          keywords: ['a new keyword'], 
          activities: [], 
          campaignNames: [], 
          dates: {}, 
          times: [], 
          geographies: [], 
          sortBy: {
            name: 'date',
            descending: false
          }
        }
      )
    ).toBe.true;
  });

  test('should handle adding a search term object', () => {

    expect(
      isEqual(
        updateSearch(undefined, {
          type: ADD_SEARCH_ITEM,
          collection: 'geographies',
          value: {
            distance: '10000',
            zipcode: '12345'
          }
        }),
        {
          keywords: [], 
          activities: [], 
          campaignNames: [], 
          dates: {}, 
          times: [], 
          geographies: [{
            distance: '10000',
            zipcode: '12345'
          }], 
          sortBy: {
            name: 'date',
            descending: false
          }
        }
      )
    ).toBe.true;
  });

  test('should handle removing a search term string', () => {
    const state = updateSearch(undefined, {
      type: ADD_SEARCH_ITEM,
      collection: 'keywords',
      value: 'a new keyword'
    });

    expect(
      isEqual(
        updateSearch(state, {
          type: REMOVE_SEARCH_ITEM,
          collection: 'keywords',
          value: 'a new keyword'
        }),
        defaultStartState
      )
    ).toBe.true;
  });

  test('should handle removing a search term object', () => {
    const state = updateSearch(undefined, {
      type: ADD_SEARCH_ITEM,
      collection: 'geographies',
      value: {
        distance: '10000',
        zipcode: '12345'
      }
    });

    expect(
      isEqual(
        updateSearch(state, {
          type: REMOVE_SEARCH_ITEM,
          collection: 'geographies',
          value: {
            distance: '10000',
            zipcode: '12345'
          }
        }),
        defaultStartState
      )
    ).toBe.true;
  });

  test('shouldn\'t add the same string item twice', () => {
    const state = updateSearch(undefined, {
      type: ADD_SEARCH_ITEM,
      collection: 'keywords',
      value: {
        distance: '10000',
        zipcode: '12345'
      }
    });

    expect(
      updateSearch(state, {
        type: ADD_SEARCH_ITEM,
        collection: 'keywords',
        value: {
          distance: '10000',
          zipcode: '12345'
        }
      }).keywords
    ).toHaveLength(1);
  });

  test('shouldn\'t add the same string item twice', () => {
    const state = updateSearch(undefined, {
      type: ADD_SEARCH_ITEM,
      collection: 'keywords',
      value: 'a new keyword'
    });

    expect(
      updateSearch(state, {
        type: ADD_SEARCH_ITEM,
        collection: 'keywords',
        value: 'a new keyword'
      }).keywords
    ).toHaveLength(1);

    expect(
      updateSearch(state, {
        type: ADD_SEARCH_ITEM,
        collection: 'keywords',
        value: 'a new KEYWORD'
      }).keywords
    ).toHaveLength(1);

    expect(
      updateSearch(state, {
        type: ADD_SEARCH_ITEM,
        collection: 'keywords',
        value: '  a new keyword   '
      }).keywords
    ).toHaveLength(1);

  });

});
