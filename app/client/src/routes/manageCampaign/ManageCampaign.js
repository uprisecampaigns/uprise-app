
import React, { PropTypes } from 'react';
import ManageCampaignContainer from 'containers/ManageCampaignContainer';

class ManageCampaign extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ManageCampaignContainer campaign={this.props.campaign}/>
      </div>
    );
  }
}

export default ManageCampaign;
