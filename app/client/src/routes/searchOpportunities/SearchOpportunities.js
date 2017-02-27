
import React, { PropTypes } from 'react';
import Search from 'components/Search';
import SearchOpportunitiesContainer from 'components/SearchOpportunitiesContainer';


class SearchOpportunities extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Search selected="search-opportunities">
          <SearchOpportunitiesContainer />
        </Search>
      </div>
    );
  }
}

export default SearchOpportunities;
