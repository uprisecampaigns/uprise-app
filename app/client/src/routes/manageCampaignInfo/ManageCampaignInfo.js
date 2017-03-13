
import React, { PropTypes } from 'react';
import ManageCampaignInfoContainer from 'containers/ManageCampaignInfoContainer';

class ManageCampaignInfo extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ManageCampaignInfoContainer campaign={this.props.campaign}/>
      </div>
    );
  }
}

export default ManageCampaignInfo;
