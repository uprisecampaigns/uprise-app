
import React, { PropTypes } from 'react';
import CampaignContainer from 'components/Campaign/CampaignContainer';


class SearchOpportunities extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <CampaignContainer campaign={this.props.campaign}/>
      </div>
    );
  }
}

export default SearchOpportunities;