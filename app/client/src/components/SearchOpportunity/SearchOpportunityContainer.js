import React, { Component, PropTypes } from 'react';

import SearchOpportunityResults from 'components/SearchOpportunity/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunity/SearchOpportunityInputs';
import SearchOpportunitySelections from 'components/SearchOpportunity/SearchOpportunitySelections';

import s from './SearchOpportunity.scss';


class SearchOpportunityContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  render() {
    return (
      <div className={s.container}>
        <div
          className={s.leftContainer}
        >
          <SearchOpportunityInputs 
          />
        </div>

        <div
          className={s.rightContainer}
        >
          <SearchOpportunitySelections 
          />
          <SearchOpportunityResults
          />
        </div>

      </div>
    );
  }
}

export default SearchOpportunityContainer;
