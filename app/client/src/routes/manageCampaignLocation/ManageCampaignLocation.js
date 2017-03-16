
import React, { PropTypes } from 'react';
import ManageCampaignLocationContainer from 'containers/ManageCampaignLocationContainer';

class ManageCampaignLocation extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ManageCampaignLocationContainer campaignSlug={this.props.campaign.slug}/>
      </div>
    );
  }
}

export default ManageCampaignLocation;
