
import React, { PropTypes } from 'react';
import Organize from 'components/Organize';


class ViewAllOrganize extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Organize selected="view-all">
          <div>Actual ViewAllOrganize Container/Component here!</div>
        </Organize>
      </div>
    );
  }
}

export default ViewAllOrganize;
