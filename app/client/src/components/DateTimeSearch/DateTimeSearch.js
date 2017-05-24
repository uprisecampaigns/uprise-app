import React, { PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import TogglesList from 'components/TogglesList';

import s from 'styles/Search.scss';


class DateTimeSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      onDate: null,
      startDate: null,
      endDate: null,
      startDateError: '',
      endDateError: '',
    };
  }

  static propTypes = {
    setDates: PropTypes.func.isRequired,
    selectedTimes: PropTypes.array.isRequired,
    handleToggle: PropTypes.func.isRequired,
  };

  changeDate = (prop, date) => {

    this.setState(Object.assign({}, this.state, {
      startDateError: '',
      endDateError: ''
    }));

    if (prop === 'onDate') {
      this.setState(Object.assign({},
        this.state,
        { 
          onDate: date,
          startDate: null,
          endDate: null
        }
      ));
    } else {
      this.setState(Object.assign({},
        this.state,
        { 
          [prop]: date,
          onDate: null
        }
      ));
    }
  }

  setDates = () => {

    const { onDate, startDate, endDate, ...state } = this.state;
    const { setDates } = this.props;

    if (onDate) {
      setDates({
        onDate: moment(onDate).format()
      });
    } else {

      if (!startDate) {
        this.setState(Object.assign({}, this.state, {
          startDateError: 'Specify start date'
        }));
        return;
      }

      if (!endDate) {
        this.setState(Object.assign({}, this.state, {
          endDateError: 'Specify end date'
        }));
        return;
      }

      setDates({
        startDate: moment(startDate).format(),
        endDate: moment(endDate).format(),
      });
    }
  }

  formatDate = (date) => {
    return moment(date).format('M/D/YYYY');
  }
  
  render() {
    const { onDate, startDate, endDate } = this.state;
    const { setDates, changeDate, formatDate } = this;
    const { selectedTimes, handleToggle } = this.props;

    const times = [
      { title: 'Weekday days' },
      { title: 'Weekday evenings' },
      { title: 'Saturdays' },
      { title: 'Sundays' },
    ];

    const dialogStyle = {
      zIndex: '3200'
    }

    return (
      <div>
        <div>
          On date:
          <DatePicker 
            value={onDate} 
            onChange={ (event, date) => { changeDate('onDate', date) }}
            container="dialog" 
            dialogContainerStyle={dialogStyle}
            hintText="On Date" 
            formatDate={formatDate}
            autoOk={true}
          />
        </div>
        <div>
          On or between 
          <DatePicker 
            value={startDate} 
            onChange={ (event, date) => { changeDate('startDate', date) }}
            errorText={this.state.startDateError}
            container="dialog" 
            dialogContainerStyle={dialogStyle}
            hintText="Start Date" 
            formatDate={formatDate}
            autoOk={true}
          />
          and 
          <DatePicker 
            value={endDate} 
            onChange={ (event, date) => { changeDate('endDate', date) }}
            errorText={this.state.endDateError}
            container="dialog" 
            dialogContainerStyle={dialogStyle}
            hintText="End Date" 
            formatDate={formatDate}
            autoOk={true}
          />
        </div>
        <RaisedButton
          className={s.primaryButton}
          onTouchTap={setDates}
          primary={true}
          label="Add to Search"
        />
      </div>
    );
  }
}

export default DateTimeSearch;
