
import React, { PropTypes } from 'react';
import Calendar from 'components/Calendar';


class ViewList extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Calendar selected="view-list">
          <div>Actual ViewList Container/Component here!</div>
        </Calendar>
      </div>
    );
  }
}

export default ViewList;
