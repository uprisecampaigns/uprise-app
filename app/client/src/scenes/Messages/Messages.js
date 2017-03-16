
import React, { PropTypes } from 'react';
import CommunicationsNav from 'components/CommunicationsNav';


class Messages extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <CommunicationsNav selected="messages">
          <div>Actual Messages Container/Component here!</div>
        </CommunicationsNav>
      </div>
    );
  }
}

export default Messages;
