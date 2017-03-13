
import React, { PropTypes } from 'react';
import ManageCampaignProfileContainer from 'containers/ManageCampaignProfileContainer';

class ManageCampaignProfile extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ManageCampaignProfileContainer campaign={this.props.campaign}/>
      </div>
    );
  }
}

export default ManageCampaignProfile;
