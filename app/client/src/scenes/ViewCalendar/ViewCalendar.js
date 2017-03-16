
import React, { PropTypes } from 'react';
import CalendarNav from 'components/CalendarNav';


class ViewCalendar extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <CalendarNav selected="view-calendar">
          <div>Actual ViewCalendar Container/Component here!</div>
        </CalendarNav>
      </div>
    );
  }
}

export default ViewCalendar;
