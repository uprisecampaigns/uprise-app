
import React, { PropTypes } from 'react';
import CalendarNav from 'components/CalendarNav';


class ViewList extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <CalendarNav selected="view-list">
          <div>Actual ViewList Container/Component here!</div>
        </CalendarNav>
      </div>
    );
  }
}

export default ViewList;
