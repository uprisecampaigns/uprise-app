import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import withTimeWithZone from 'lib/withTimeWithZone';
import moment from 'moment';

import itemsSort from 'lib/itemsSort';


class ShiftGroupList extends PureComponent {
  static propTypes = {
    action: PropTypes.object.isRequired,
    s: PropTypes.object.isRequired,
    timeWithZone: PropTypes.func.isRequired,
  }

  render() {
    const { action, timeWithZone, s } = this.props;

    const shiftGroups = (Array.isArray(action.shifts) && action.shifts.length) ?
      [...action.shifts]
        .filter(shift => moment(shift.end).isAfter(moment()))
        .sort(itemsSort({ name: 'shiftDate' }))
        .reduce((result, shift) => ({ // performs "group by date"
          ...result,
          [moment(shift.start).startOf('day').toDate()]: [
            ...(result[moment(shift.start).startOf('day').toDate()] || []),
            shift,
          ],
        }), {}) : [];

    const shiftDisplay = Object.keys(shiftGroups).map((date, index) => {
      const shiftGroup = shiftGroups[date];
      const dateString = timeWithZone(date, action.zipcode, 'ddd MMM Do');

      const shiftLines = shiftGroup.map((shift, shiftIndex) => (
        <div key={shift.id}>
          {timeWithZone(shift.start, action.zipcode, 'h:mm')} - {timeWithZone(shift.end, action.zipcode, 'h:mm a z')}
        </div>
      ));

      return (
        <div key={JSON.stringify(shiftGroup)} className={s.shiftDateGroup}>
          {dateString}:
          <div>
            {shiftLines}
          </div>
        </div>
      );
    });

    return shiftDisplay;
  }
}

export default withTimeWithZone(ShiftGroupList);
