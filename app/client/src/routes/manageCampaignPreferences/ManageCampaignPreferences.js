
import React, { PropTypes } from 'react';
import ManageCampaignPreferencesContainer from 'containers/ManageCampaignPreferencesContainer';

class ManageCampaignPreferences extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ManageCampaignPreferencesContainer campaignSlug={this.props.campaign.slug}/>
      </div>
    );
  }
}

export default ManageCampaignPreferences;
