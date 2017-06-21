import React, { PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

import TogglesList from 'components/TogglesList';

import s from 'styles/Search.scss';


class DateTimeSearch extends React.Component {

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

  static propTypes = {
    setDates: PropTypes.func.isRequired,
    selectedTimes: PropTypes.array.isRequired,
    handleToggle: PropTypes.func.isRequired,
  };

  handleInputChange = (prop, value) => {

    this.setState(Object.assign({}, this.state, {
      startDateError: '',
      endDateError: ''
    }));

    if (prop === 'ongoing') {
      this.setState(Object.assign({},
        this.state,
        {
          ongoing: value,
          onDate: null,
          startDate: null,
          endDate: null
        }
      ))
    } else if (prop === 'onDate') {
      this.setState(Object.assign({},
        this.state,
        {
          onDate: value,
          startDate: null,
          endDate: null
        }
      ));
    } else {
      this.setState(Object.assign({},
        this.state,
        {
          [prop]: value,
          onDate: null
        }
      ));
    }
  }

  formSubmit = () => {

    const { ongoing, onDate, startDate, endDate, ...state } = this.state;
    const { setDates } = this.props;

    if (ongoing) {
      setDates({ ongoing });
    } else if (onDate) {
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

    this.setState((prevState) => (Object.assign({},
      prevState,
      {
        ongoing: false,
        onDate: null,
        startDate: null,
        endDate: null,
      }
    )));
  }

  formatDate = (date) => {
    return moment(date).format('M/D/YYYY');
  }

  render() {
    const { ongoing, onDate, startDate, endDate } = this.state;
    const { formSubmit, handleInputChange, formatDate } = this;
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

        <Checkbox
          label="Ongoing"
          checked={ongoing}
          onCheck={ (event, isChecked) => { handleInputChange('ongoing', isChecked) } }
          className={s.checkboxContainer}
        />

        {ongoing || (
          <div>
            <div>
              On date:
              <DatePicker
                value={onDate}
                onChange={ (event, date) => { handleInputChange('onDate', date) }}
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
                onChange={ (event, date) => { handleInputChange('startDate', date) }}
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
                onChange={ (event, date) => { handleInputChange('endDate', date) }}
                errorText={this.state.endDateError}
                container="dialog"
                dialogContainerStyle={dialogStyle}
                hintText="End Date"
                formatDate={formatDate}
                autoOk={true}
              />
            </div>
          </div>
        )}
        <RaisedButton
          className={s.primaryButton}
          onTouchTap={formSubmit}
          primary={true}
          label="Add to Search"
        />
      </div>
    );
  }
}

export default DateTimeSearch;
