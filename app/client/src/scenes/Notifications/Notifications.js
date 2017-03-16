
import React, { PropTypes } from 'react';
import CommunicationsNav from 'components/CommunicationsNav';


class Notifications extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <CommunicationsNav selected="notifications">
          <div>Actual Notifications Container/Component here!</div>
        </CommunicationsNav>
      </div>
    );
  }
}

export default Notifications;
