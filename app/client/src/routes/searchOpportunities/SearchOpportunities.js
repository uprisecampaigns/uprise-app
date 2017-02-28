
import React, { PropTypes } from 'react';
import Search from 'components/Search';
import SearchOpportunityContainer from 'components/SearchOpportunityContainer';


class SearchOpportunities extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Search selected="search-opportunities">
          <SearchOpportunityContainer />
        </Search>
      </div>
    );
  }
}

export default SearchOpportunities;
