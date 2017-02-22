import React, { PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import TogglesList from 'components/TogglesList';

import s from './DateTimeSearch.scss';


class DateTimeSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      onDate: new Date(),
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

    if (this.state.onDate) {
      this.props.setDates({
        onDate: this.state.onDate
      });
    } else {

      if (!this.state.startDate) {
        this.setState(Object.assign({}, this.state, {
          startDateError: 'Specify start date'
        }));
        return;
      }

      if (!this.state.endDate) {
        this.setState(Object.assign({}, this.state, {
          endDateError: 'Specify end date'
        }));
        return;
      }

      this.props.setDates({
        startDate: this.state.startDate,
        endDate: this.state.endDate,
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

    return (
      <div>
        <div>
          On date:
          <DatePicker 
            value={onDate} 
            onChange={ (event, date) => { changeDate('onDate', date) }}
            container="inline" 
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
            container="inline" 
            hintText="Start Date" 
            formatDate={formatDate}
            autoOk={true}
          />
          and 
          <DatePicker 
            value={endDate} 
            onChange={ (event, date) => { changeDate('endDate', date) }}
            errorText={this.state.endDateError}
            container="inline" 
            hintText="Start Date" 
            formatDate={formatDate}
            autoOk={true}
          />
        </div>
        <RaisedButton 
          onTouchTap={setDates} 
          primary={false} 
          label="Add to Search >>" 
        />
        <Divider />
        <div>
          <TogglesList
            selectedCollection={selectedTimes}
            collectionName="times"
            keyPropName="title"
            displayPropName="title"
            collection={times}
            handleToggle={handleToggle}
          />
        </div>
      </div>
    );
  }
}

export default DateTimeSearch;
