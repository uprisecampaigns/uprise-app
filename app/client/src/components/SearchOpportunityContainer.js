import React, { Component, PropTypes } from 'react';

import SearchOpportunityResults from 'components/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunityInputs';
import SearchOpportunitySelections from 'components/SearchOpportunitySelections';

class SearchOpportunityContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  render() {
    return (
      <div>
        <SearchOpportunityInputs 
        />

        <SearchOpportunitySelections 
        />

        <SearchOpportunityResults
        />
      </div>
    );
  }
}

export default SearchOpportunityContainer;
