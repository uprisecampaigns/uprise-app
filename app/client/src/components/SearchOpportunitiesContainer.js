import React, { Component, PropTypes } from 'react';

import SearchOpportunityResults from 'components/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunityInputs';

class SearchOpportunitiesContainer extends Component {
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

        <SearchOpportunityResults
        />
      </div>
    );
  }
}

export default SearchOpportunitiesContainer;
