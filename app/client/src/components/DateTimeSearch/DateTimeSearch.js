import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import s from 'styles/Search.scss';


class DateTimeSearch extends Component {
  static propTypes = {
    setDates: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      ongoing: false,
      onDate: null,
      startDate: null,
      endDate: null,
      startDateError: '',
      endDateError: '',
    };
  }

  handleInputChange = (prop, value) => {
    this.setState(Object.assign({}, this.state, {
      startDateError: '',
      endDateError: '',
    }));

    if (prop === 'ongoing') {
      this.setState(Object.assign(
        {},
        this.state,
        {
          ongoing: value,
          onDate: null,
          startDate: null,
          endDate: null,
        },
      ));
    } else if (prop === 'onDate') {
      this.setState(Object.assign(
        {},
        this.state,
        {
          onDate: value,
          startDate: null,
          endDate: null,
        },
      ));
    } else {
      this.setState(Object.assign(
        {},
        this.state,
        {
          [prop]: value,
          onDate: null,
        },
      ));
    }
  }

  formSubmit = () => {
    const {
      ongoing, onDate, startDate, endDate,
    } = this.state;
    const { setDates } = this.props;

    if (ongoing) {
      setDates({ ongoing });
    } else if (onDate) {
      setDates({
        onDate: moment(onDate).format(),
      });
    } else {
      if (!startDate) {
        this.setState({ startDateError: 'Specify start date' });
        return;
      }

      if (!endDate) {
        this.setState({ endDateError: 'Specify end date' });
        return;
      }

      setDates({
        startDate: moment(startDate).format(),
        endDate: moment(endDate).format(),
      });
    }

    this.setState(prevState => ({
      ...prevState,
      ongoing: false,
      onDate: null,
      startDate: null,
      endDate: null,
    }));
  }

  formatDate = date => moment(date).format('M/D/YYYY')

  render() {
    const {
      ongoing, onDate, startDate, endDate,
    } = this.state;
    const { formSubmit, handleInputChange, formatDate } = this;

    const dialogStyle = {
      zIndex: '3200',
    };

    return (
      <div>

        <Checkbox
          label="Ongoing"
          checked={ongoing}
          onCheck={(event, isChecked) => { handleInputChange('ongoing', isChecked); }}
          className={s.checkboxContainer}
        />

        {ongoing || (
          <div>
            <div>
              On date:
              <DatePicker
                value={onDate}
                onChange={(event, date) => { handleInputChange('onDate', date); }}
                container="dialog"
                dialogContainerStyle={dialogStyle}
                hintText="On Date"
                formatDate={formatDate}
                autoOk
              />
            </div>
            <div>
              On or between
              <DatePicker
                value={startDate}
                onChange={(event, date) => { handleInputChange('startDate', date); }}
                errorText={this.state.startDateError}
                container="dialog"
                dialogContainerStyle={dialogStyle}
                hintText="Start Date"
                formatDate={formatDate}
                autoOk
              />
              and
              <DatePicker
                value={endDate}
                onChange={(event, date) => { handleInputChange('endDate', date); }}
                errorText={this.state.endDateError}
                container="dialog"
                dialogContainerStyle={dialogStyle}
                hintText="End Date"
                formatDate={formatDate}
                autoOk
              />
            </div>
          </div>
        )}
        <div className={s.addToSearchButton}>
          <RaisedButton
            className={s.primaryButton}
            onClick={formSubmit}
            primary
            label="Add to Search"
          />
        </div>
      </div>
    );
  }
}

export default DateTimeSearch;
