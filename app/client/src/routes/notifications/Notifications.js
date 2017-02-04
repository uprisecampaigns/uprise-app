
import React, { PropTypes } from 'react';
import Communications from 'components/Communications';


class Notifications extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Communications selected="notifications">
          <div>Actual Notifications Container/Component here!</div>
        </Communications>
      </div>
    );
  }
}

export default Notifications;
