import React, { Component, PropTypes } from 'react';

import SearchOpportunityResults from 'components/SearchOpportunity/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunity/SearchOpportunityInputs';
import SearchOpportunitySelections from 'components/SearchOpportunity/SearchOpportunitySelections';

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
