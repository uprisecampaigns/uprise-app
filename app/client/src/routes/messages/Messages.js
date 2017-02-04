
import React, { PropTypes } from 'react';
import Communications from 'components/Communications';


class Messages extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Communications selected="messages">
          <div>Actual Messages Container/Component here!</div>
        </Communications>
      </div>
    );
  }
}

export default Messages;
