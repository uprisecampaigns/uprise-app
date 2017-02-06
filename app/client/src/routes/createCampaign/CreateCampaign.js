
import React, { PropTypes } from 'react';
import Organize from 'components/Organize';


class CreateCampaign extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Organize selected="create-campaign">
          <div>Actual CreateCampaign Container/Component here!</div>
        </Organize>
      </div>
    );
  }
}

export default CreateCampaign;
