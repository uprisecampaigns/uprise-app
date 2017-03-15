
import React, { PropTypes } from 'react';
import ManageCampaignInfoContainer from 'containers/ManageCampaignInfoContainer';

class ManageCampaignInfo extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ManageCampaignInfoContainer campaignSlug={this.props.campaign.slug}/>
      </div>
    );
  }
}

export default ManageCampaignInfo;
