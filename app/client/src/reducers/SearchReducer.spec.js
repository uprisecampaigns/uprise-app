import { assert, expect } from 'chai';
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

  it('should return the initial state', () => {
    expect(isEqual(updateSearch(undefined, {}), {
      keywords: [], 
      activities: [], 
      types: [], 
      levels: [], 
      issueAreas: [], 
      campaignNames: [], 
      dates: {}, 
      times: [], 
      geographies: [], 
      sortBy: {
        name: 'date',
        descending: false
      }
    })).to.be.true;
  });

  it('should handle adding a search term', () => {

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
          types: [], 
          levels: [], 
          issueAreas: [], 
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
    ).to.be.true;
  });

  it('should handle removing a search term', () => {
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
    ).to.be.true;
  });

  it('shouldn\'t add the same item twice', () => {
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
    ).to.have.lengthOf(1);

    expect(
      updateSearch(state, {
        type: ADD_SEARCH_ITEM,
        collection: 'keywords',
        value: 'a new KEYWORD'
      }).keywords
    ).to.have.lengthOf(1);

    expect(
      updateSearch(state, {
        type: ADD_SEARCH_ITEM,
        collection: 'keywords',
        value: '  a new keyword   '
      }).keywords
    ).to.have.lengthOf(1);


  });

});
