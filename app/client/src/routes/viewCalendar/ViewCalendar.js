
import React, { PropTypes } from 'react';
import Calendar from 'components/Calendar';


class ViewCalendar extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <Calendar selected="view-calendar">
          <div>Actual ViewCalendar Container/Component here!</div>
        </Calendar>
      </div>
    );
  }
}

export default ViewCalendar;
