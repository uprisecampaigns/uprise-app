import React from 'react';
import { render, shallow, mount } from 'enzyme';
import moment from 'moment';

import DatePicker from 'material-ui/DatePicker';

import ShiftScheduler from './ShiftScheduler';

const today = moment().startOf('day');
const shifts = [
  {
    id: 1,
    start: moment(today).add(12, 'hour').toDate(),
    end: moment(today).add(16, 'hour').toDate(),
  },
  {
    id: 2,
    start: moment(today).add(2, 'day').toDate(),
    end: moment(today).add(2, 'day').add(2, 'hour').toDate(),
  },
];

describe('(Component) ShiftScheduler', () => {
  test('renders without exploding', () => {
    const action = {
      title: 'An Event',
      description: 'A test event',
      shifts,
    };

    const submit = () => {};

    const wrapper = shallow(<ShiftScheduler data={action} submit={submit}/>);
    expect(wrapper).toHaveLength(1);
  });

  test('correctly displays shifts', () => {

    const action = {
      title: 'An Event',
      description: 'A test event',
      shifts,
    };

    const submit = () => {};

    const wrapper = shallow(<ShiftScheduler data={action} submit={submit}/>);

    const shiftLabels = wrapper.find({ className: 'shiftLabel' });

    expect(shiftLabels).toHaveLength(2);

    const shiftDatesState = [
      {
        date: moment(today).toDate(),
        dateError: null,
        shifts: [
          {
            id: 1,
            start: moment(today).add(12, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      },
      {
        date: moment(today).add(2, 'day').toDate(),
        dateError: null,
        shifts: [
          {
            id: 2,
            start: moment(today).add(2, 'day').toDate(),
            end: moment(today).add(2, 'day').add(2, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      }
    ];

    expect(wrapper.state('shiftDates')).toEqual(shiftDatesState);
  });

  test('correctly adds a date', () => {
    const action = {
      title: 'An Event',
      description: 'A test event',
      shifts,
    };

    const submit = () => {};

    const wrapper = shallow(<ShiftScheduler data={action} submit={submit}/>);

    wrapper.instance().addDate();
    wrapper.update();

    const dates = wrapper.find('.dateShiftContainer');

    expect(dates).toHaveLength(3);

    const shiftDatesState = [
      {
        date: moment(today).toDate(),
        dateError: null,
        shifts: [
          {
            id: 1,
            start: moment(today).add(12, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      },
      {
        date: moment(today).add(2, 'day').toDate(),
        dateError: null,
        shifts: [
          {
            id: 2,
            start: moment(today).add(2, 'day').toDate(),
            end: moment(today).add(2, 'day').add(2, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      },
      {
        date: moment(today).toDate(),
        dateError: null,
        shifts: [
          {
            start: moment(today).add(12, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      }
    ];

    expect(wrapper.state('shiftDates')).toEqual(shiftDatesState);
  });

  test('correctly adds a shift', () => {
    const action = {
      title: 'An Event',
      description: 'A test event',
      shifts,
    };

    const submit = () => {};

    const wrapper = shallow(<ShiftScheduler data={action} submit={submit}/>);

    wrapper.instance().addShift(0);
    wrapper.update();

    const shiftLabels = wrapper.find('[className="shiftLabel"]');

    expect(shiftLabels).toHaveLength(3);

    const dates = wrapper.find('.dateShiftContainer');
    expect(dates).toHaveLength(2);

    const shiftDatesState = [
      {
        date: moment(today).toDate(),
        dateError: null,
        shifts: [
          {
            id: 1,
            start: moment(today).add(12, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          },
          {
            start: moment(today).add(12, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          }
        ]
      },
      {
        date: moment(today).add(2, 'day').toDate(),
        dateError: null,
        shifts: [
          {
            id: 2,
            start: moment(today).add(2, 'day').toDate(),
            end: moment(today).add(2, 'day').add(2, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      },
    ];

    expect(wrapper.state('shiftDates')).toEqual(shiftDatesState);
  });

  test('correctly changes a shift', () => {
    const action = {
      title: 'An Event',
      description: 'A test event',
      shifts,
    };

    const submit = () => {};

    const wrapper = shallow(<ShiftScheduler data={action} submit={submit}/>);

    wrapper.instance().changeShift('start', moment(today).add('20', 'hour'), 0, 0);
    wrapper.update();

    const shiftLabels = wrapper.find('[className="shiftLabel"]');

    expect(shiftLabels).toHaveLength(2);

    const dates = wrapper.find('.dateShiftContainer');
    expect(dates).toHaveLength(2);

    const shiftDatesState = [
      {
        date: moment(today).toDate(),
        dateError: null,
        shifts: [
          {
            id: 1,
            start: moment(today).add(20, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      },
      {
        date: moment(today).add(2, 'day').toDate(),
        dateError: null,
        shifts: [
          {
            id: 2,
            start: moment(today).add(2, 'day').toDate(),
            end: moment(today).add(2, 'day').add(2, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      }
    ];

    expect(wrapper.state('shiftDates')).toEqual(shiftDatesState);
  });

  test('correctly removes a shift', () => {
    const action = {
      title: 'An Event',
      description: 'A test event',
      shifts,
    };

    const submit = () => {};

    const wrapper = shallow(<ShiftScheduler data={action} submit={submit}/>);

    wrapper.instance().addShift(0);
    wrapper.instance().removeShift(0, 1);
    wrapper.update();

    const shiftLabels = wrapper.find('[className="shiftLabel"]');

    expect(shiftLabels).toHaveLength(2);

    const dates = wrapper.find('.dateShiftContainer');
    expect(dates).toHaveLength(2);

    const shiftDatesState = [
      {
        date: moment(today).toDate(),
        dateError: null,
        shifts: [
          {
            id: 1,
            start: moment(today).add(12, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      },
      {
        date: moment(today).add(2, 'day').toDate(),
        dateError: null,
        shifts: [
          {
            id: 2,
            start: moment(today).add(2, 'day').toDate(),
            end: moment(today).add(2, 'day').add(2, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      }
    ];

    expect(wrapper.state('shiftDates')).toEqual(shiftDatesState);
  });

  test('correctly removes a date', () => {
    const action = {
      title: 'An Event',
      description: 'A test event',
      shifts,
    };

    const submit = () => {};

    const wrapper = shallow(<ShiftScheduler data={action} submit={submit}/>);

    wrapper.instance().removeDate(1);
    wrapper.update();

    const shiftLabels = wrapper.find('[className="shiftLabel"]');

    expect(shiftLabels).toHaveLength(1);

    const dates = wrapper.find('.dateShiftContainer');
    expect(dates).toHaveLength(1);

    const shiftDatesState = [
      {
        date: moment(today).toDate(),
        dateError: null,
        shifts: [
          {
            id: 1,
            start: moment(today).add(12, 'hour').toDate(),
            end: moment(today).add(16, 'hour').toDate(),
            startError: null,
            endError: null,
          },
        ]
      },
    ];

    expect(wrapper.state('shiftDates')).toEqual(shiftDatesState);
  });
});

