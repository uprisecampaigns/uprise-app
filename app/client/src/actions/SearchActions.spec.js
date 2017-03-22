import { assert, expect } from 'chai';
const isEqual = require('lodash.isequal');

import { 
  ADD_SEARCH_ITEM, 
  REMOVE_SEARCH_ITEM,
  SET_DATES,
  UNSET_DATES,
  SORT_BY,
  addSearchItem,
  removeSearchItem,
  setSearchDates,
  unsetSearchDates,
  sortBy,
} from 'actions/SearchActions.js';


describe('(Actions) SearchActions', () => {

  it('should create an action to add a new search item', () => {

    const newKeyword = 'a new keyword';

    const expectedAction = {
      type: ADD_SEARCH_ITEM,
      searchType: 'actions',
      collection: 'keywords',
      value: newKeyword
    };

    expect(
      isEqual(
        addSearchItem('actions', 'keywords', newKeyword), 
        expectedAction
      )
    ).to.be.true;

  });

  it('should create an action to remove a new search item', () => {

    const newKeyword = 'a new keyword';

    const expectedAction = {
      type: REMOVE_SEARCH_ITEM,
      searchType: 'actions',
      collection: 'keywords',
      value: newKeyword
    };

    expect(
      isEqual(
        removeSearchItem('actions', 'keywords', newKeyword), 
        expectedAction
      )
    ).to.be.true;

  });

});
 
