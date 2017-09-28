import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import s from 'styles/Form.scss';


const blankShift = () => ({
  id: undefined,
  start: undefined,
  end: undefined,
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
          if (moment(newShift.end).isBefore(moment(newShift.start))) {
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
      console.log(this.state.shiftDates);
      const shifts = this.state.shiftDates.reduce((accumulator, shiftDate) => {
        console.log(shiftDate);

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

    newShifts.push({ date: undefined, dateError: null, shifts: [blankShift()] });

    this.setState({ shiftDates: newShifts });
  }

  addShift = (dateIndex) => {
    const newShifts = [...this.state.shiftDates];

    newShifts[dateIndex].shifts.push(blankShift());

    this.setState({ shiftDates: newShifts });
  }

  removeDate = (dateIndex) => {
    const newShifts = [...this.state.shiftDates].splice(dateIndex, 1);

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
    newShifts[dateIndex].shifts[shiftIndex][type + 'Error'] = null;

    this.setState({ shiftDates: newShifts });
  }

  changeDate = (dateIndex, date) => {
    const newShifts = [...this.state.shiftDates];

    newShifts[dateIndex].date = date;
    newShifts[dateIndex].dateErro = null;

    this.setState({ shiftDates: newShifts });
  }

  render() {
    const { shiftDates } = this.state;
    const { formSubmit, addShift, addDate, changeDate, changeShift, removeShift, removeDate } = this;

    const formatDate = date => moment(date).format('M/D/YYYY');

    const dialogStyle = {
      zIndex: '3200',
    };

    const renderDateForm = (shiftDate, dateIndex) => {
      const renderedShifts = shiftDate.shifts.map((shift, shiftIndex) => (
        <div>
          <div className={s.textFieldContainer}>
            <span>Shift { shiftIndex + 1 }:</span>
            <TimePicker
              floatingLabelText="Start Time"
              value={shift.start}
              errorText={shift.startError}
              minutesStep={5}
              onChange={(event, time) => { changeShift('start', time, dateIndex, shiftIndex); }}
            />

            <TimePicker
              floatingLabelText="End Time"
              value={shift.end}
              errorText={shift.endError}
              minutesStep={5}
              onChange={(event, time) => { changeShift('end', time, dateIndex, shiftIndex); }}
            />
          </div>

          { shiftIndex > 0 && (
            <div
              onTouchTap={(event) => { event.preventDefault(); removeShift(dateIndex, shiftIndex); }}
              className={s.touchIcon}
            >Remove Shift</div>
          )}

        </div>
      ));

      return (
        <div>
          <div className={s.textFieldContainer}>
            <DatePicker
              value={shiftDate.date}
              errorText={shiftDate.dateError}
              onChange={(event, date) => { changeDate(dateIndex, date); }}
              container="dialog"
              dialogContainerStyle={dialogStyle}
              floatingLabelText="Date"
              formatDate={formatDate}
            />
          </div>
          { renderedShifts }
          <div
            onTouchTap={(event) => { event.preventDefault(); addShift(dateIndex); }}
            className={s.touchIcon}
          >Add Shift</div>

          { dateIndex > 0 && (
            <div
              onTouchTap={(event) => { event.preventDefault(); removeDate(dateIndex); }}
              className={s.touchIcon}
            >Remove Date</div>
          )}
        </div>
      );
    };

    const dateForm = shiftDates.map((shiftDate, index) => renderDateForm(shiftDate, index));

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <div className={s.formContainer}>
            <form
              className={s.form}
              onSubmit={formSubmit}
            >
              { dateForm }
              <div
                onTouchTap={(event) => { event.preventDefault(); addDate(); }}
                className={s.touchIcon}
              >Add Date</div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ShiftScheduler;
