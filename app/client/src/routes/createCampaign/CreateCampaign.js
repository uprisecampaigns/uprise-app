
import React, { PropTypes } from 'react';
import Organize from 'components/Organize';
import CreateCampaignContainer from 'containers/CreateCampaignContainer';


class CreateCampaign extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Organize selected="create-campaign">
          <CreateCampaignContainer />
        </Organize>
      </div>
    );
  }
}

export default CreateCampaign;
