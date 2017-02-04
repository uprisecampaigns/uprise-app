
import React, { PropTypes } from 'react';
import Communications from 'components/Communications';


class Requests extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Communications selected="requests">
          <div>Actual Requests Container/Component here!</div>
        </Communications>
      </div>
    );
  }
}

export default Requests;
