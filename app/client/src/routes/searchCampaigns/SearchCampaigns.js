
import React, { PropTypes } from 'react';
import Search from 'components/Search';
import SearchCampaignContainer from 'components/SearchCampaign/SearchCampaignContainer';


class SearchCampaigns extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Search selected="search-campaigns">
          <SearchCampaignContainer />
        </Search>
      </div>
    );
  }
}

export default SearchCampaigns;
