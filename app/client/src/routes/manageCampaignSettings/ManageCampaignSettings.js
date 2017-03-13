
import React, { PropTypes } from 'react';
import ManageCampaignSettingsContainer from 'containers/ManageCampaignSettingsContainer';

class ManageCampaignSettings extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ManageCampaignSettingsContainer campaign={this.props.campaign}/>
      </div>
    );
  }
}

export default ManageCampaignSettings;
