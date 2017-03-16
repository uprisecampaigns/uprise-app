
import React, { PropTypes } from 'react';
import SearchNav from 'components/SearchNav';
import SearchCampaignContainer from 'components/SearchCampaign/SearchCampaignContainer';


class SearchCampaigns extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <SearchNav selected="search-campaigns">
          <SearchCampaignContainer />
        </SearchNav>
      </div>
    );
  }
}

export default SearchCampaigns;
