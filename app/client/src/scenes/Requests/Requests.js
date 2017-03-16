
import React, { PropTypes } from 'react';
import CommunicationsNav from 'components/CommunicationsNav';


class Requests extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <CommunicationsNav selected="requests">
          <div>Actual Requests Container/Component here!</div>
        </CommunicationsNav>
      </div>
    );
  }
}

export default Requests;
