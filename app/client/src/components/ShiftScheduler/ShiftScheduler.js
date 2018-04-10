import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import Add from 'material-ui/svg-icons/content/add';
import Close from 'material-ui/svg-icons/navigation/close';

import s from 'styles/Form.scss';


const blankShift = (date = moment().startOf('day').toDate()) => ({
  id: undefined,
  start: moment(date).add(12, 'hour').toDate(),
  end: moment(date).add(16, 'hour').toDate(),
  startError: null,
  endError: null,
});

class ShiftScheduler extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    // TODO change to Date objects?
    const shifts = (props.data.shifts.length === 0) ? [blankShift()] : props.data.shifts;

    const shiftDates = [];

    shifts.forEach((shift) => {
      const placeholderShift = (typeof shift.start === 'undefined');
      const shiftDate = placeholderShift ? undefined : moment(shift.start).startOf('day').toDate();

      const foundIndex = placeholderShift ? -1 : shiftDates.findIndex(d => moment(d.date).isSame(shiftDate, 'day'));

      const newShift = {
        id: shift.id,
        start: moment(shift.start).toDate(),
        end: moment(shift.end).toDate(),
        startError: null,
        endError: null,
      };

      if (foundIndex === -1) {
        shiftDates.push({ date: shiftDate, dateError: null, shifts: [newShift] });
      } else {
        shiftDates[foundIndex].shifts.push(newShift);
      }
    });

    this.state = { shiftDates };
  }

  componentDidUpdate() {
    if (this.errorElem) {
      this.errorElem.scrollIntoView();
    }
  }

  validate = () => {
    let hasErrors = false;

    const newShiftDates = this.state.shiftDates.map((shiftDate) => {
      const newShiftDate = { ...shiftDate };
      newShiftDate.dateError = null;

      if (typeof newShiftDate.date !== 'object') {
        hasErrors = true;
        newShiftDate.dateError = 'Date required';
      }

      const newShifts = newShiftDate.shifts.map((shift) => {
        let shiftError = false;

        const newShift = { ...shift };
        newShift.startError = null;
        newShift.endError = null;

        if (typeof newShift.start !== 'object') {
          shiftError = true;
          newShift.startError = 'Starting time required';
        }

        if (typeof shift.end !== 'object') {
          shiftError = true;
          newShift.endError = 'Starting time required';
        }

        if (!shiftError) {
          if (!moment(newShift.end).isAfter(moment(newShift.start))) {
            shiftError = true;
            newShift.endError = 'End time must be before start';
          }
        }

        hasErrors = hasErrors || shiftError;
        return newShift;
      });

      newShiftDate.shifts = newShifts;

      return newShiftDate;
    });

    this.setState({ shiftDates: newShiftDates });

    return hasErrors;
  }

  formSubmit = () => {
    const hasErrors = this.validate();
    if (!hasErrors) {
      const shifts = this.state.shiftDates.reduce((accumulator, shiftDate) => {
        const newShifts = shiftDate.shifts.map(shift => ({
          start: moment(shift.start).format(),
          end: moment(shift.end).format(),
          id: shift.id,
        }));

        return [...accumulator, ...newShifts];
      }, []);
      this.props.submit({ shifts });
    }
  }

  addDate = () => {
    const newShifts = [...this.state.shiftDates];

    const newDate = moment().startOf('day').toDate();
    newShifts.push({ date: newDate, dateError: null, shifts: [blankShift(newDate)] });

    this.setState({ shiftDates: newShifts });
  }

  addShift = (dateIndex) => {
    const newShifts = [...this.state.shiftDates];

    const { date } = newShifts[dateIndex];

    newShifts[dateIndex].shifts.push(blankShift(date));

    this.setState({ shiftDates: newShifts });
  }

  removeDate = (dateIndex) => {
    const newShifts = [...this.state.shiftDates];
    newShifts.splice(dateIndex, 1);

    this.setState({ shiftDates: newShifts });
  }

  removeShift = (dateIndex, shiftIndex) => {
    const newShifts = [...this.state.shiftDates];

    newShifts[dateIndex].shifts.splice(shiftIndex, 1);

    this.setState({ shiftDates: newShifts });
  }

  changeShift = (type, time, dateIndex, shiftIndex) => {
    const newShifts = [...this.state.shiftDates];

    const date = moment(this.state.shiftDates[dateIndex].date);
    const mTime = moment(time);
    const newTime = date.hour(mTime.hour()).minute(mTime.minute());

    newShifts[dateIndex].shifts[shiftIndex][type] = newTime.toDate();
    newShifts[dateIndex].shifts[shiftIndex][`${type}Error`] = null;

    this.setState({ shiftDates: newShifts });
  }

  changeDate = (dateIndex, date) => {
    const newShifts = [...this.state.shiftDates];

    newShifts[dateIndex].date = date;
    newShifts[dateIndex].dateError = null;

    const mDate = moment(date);
    // eslint-disable-next-line no-restricted-syntax
    for (const shift of newShifts[dateIndex].shifts) {
      shift.start = moment(shift.start)
        .date(mDate.date())
        .month(mDate.month())
        .year(mDate.year())
        .toDate();
      shift.end = moment(shift.end)
        .date(mDate.date())
        .month(mDate.month())
        .year(mDate.year())
        .toDate();
    }

    this.setState({ shiftDates: newShifts });
  }

  render() {
    const { shiftDates } = this.state;
    const {
      formSubmit, addShift, addDate, changeDate, changeShift, removeShift, removeDate,
    } = this;

    const formatDate = date => moment(date).format('M/D/YYYY');

    const dialogStyle = {
      zIndex: '3200',
    };

    const renderDateForm = (shiftDate, dateIndex) => {
      const renderedShifts = shiftDate.shifts.map((shift, shiftIndex) => (
        <div
          key={JSON.stringify(shift)}
          className={s.shiftContainer}
        >
          <div
            className={s.shiftPicker}
            ref={(input) => { if (shift.startError || shift.endError) { this.errorElem = input; } }}
          >
            <TimePicker
              value={shift.start}
              errorText={shift.startError}
              minutesStep={5}
              onChange={(event, time) => { changeShift('start', time, dateIndex, shiftIndex); }}
              className={s.shiftTimePicker}
            />

            <TimePicker
              value={shift.end}
              errorText={shift.endError}
              minutesStep={5}
              onChange={(event, time) => { changeShift('end', time, dateIndex, shiftIndex); }}
              className={s.shiftTimePicker}
            />
          </div>

          { shiftDate.shifts.length > 1 && (
            <div className={s.removeShiftContainer}>
              <div
                onClick={(event) => { event.preventDefault(); removeShift(dateIndex, shiftIndex); }}
                onKeyPress={(event) => { event.preventDefault(); removeShift(dateIndex, shiftIndex); }}
                role="button"
                tabIndex="0"
                className={s.touchIcon}
              >
                <Close />
              </div>
            </div>
          )}

        </div>
      ));

      return (
        <div className={s.dateWithShiftsContainer}>
          <div className={s.dateShiftContainer}>
            <div className={s.shiftLabel}>Date:</div>
            <div
              className={s.textFieldContainer}
              ref={(input) => { if (shiftDate.dateError) { this.errorElem = input; } }}
            >
              <DatePicker
                value={shiftDate.date}
                errorText={shiftDate.dateError}
                onChange={(event, date) => { changeDate(dateIndex, date); }}
                container="dialog"
                dialogContainerStyle={dialogStyle}
                formatDate={formatDate}
                className={s.dateShiftPicker}
              />
            </div>


            { shiftDates.length > 1 && (
              <div className={s.removeDateContainer}>
                <div
                  onClick={(event) => { event.preventDefault(); removeDate(dateIndex); }}
                  onKeyPress={(event) => { event.preventDefault(); removeDate(dateIndex); }}
                  role="button"
                  tabIndex="0"
                  className={s.touchIcon}
                >
                  <Close /> Delete
                </div>
              </div>
            )}
          </div>

          <div className={s.shiftsContainer}>
            <div className={s.shiftLabel}>Shifts:</div>
            <div className={s.shiftInputsContainer}>
              { renderedShifts }
            </div>
          </div>

          <div
            onClick={(event) => { event.preventDefault(); addShift(dateIndex); }}
            onKeyPress={(event) => { event.preventDefault(); addShift(dateIndex); }}
            role="button"
            tabIndex="0"
            className={s.touchIcon}
          >
            <Add />Add Shift
          </div>
        </div>
      );
    };

    const dateForm = shiftDates.map((shiftDate, index) => renderDateForm(shiftDate, index));

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <div className={s.formContainer}>
            <form
              className={s.shiftSchedulerForm}
              onSubmit={formSubmit}
            >

              <div className={s.sectionLabel}>Add Dates and Times:</div>

              { dateForm }
              <div
                onClick={(event) => { event.preventDefault(); addDate(); }}
                onKeyPress={(event) => { event.preventDefault(); addDate(); }}
                role="button"
                tabIndex="0"
                className={s.addDate}
              >
                <Add /> Add a date
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ShiftScheduler;
