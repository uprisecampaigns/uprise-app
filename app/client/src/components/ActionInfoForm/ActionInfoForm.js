import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';

import s from 'styles/Form.scss';


class ActionInfoForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired,
    saving: PropTypes.bool,
  }

  render() {
    const { 
      data, refs, formSubmit, errors, saving, 
      handleInputChange, cancel, campaignTitle, submitText
    } = this.props;

    const statesList = Object.keys(states);

    const formatDate = (date) => {
      return moment(date).format('M/D/YYYY');
    }

    const dialogStyle = {
      zIndex: '3200'
    }

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              <form 
                className={s.form}
                onSubmit={formSubmit}
              >
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Campaign"
                    fullWidth={true}
                    value={campaignTitle}
                    disabled={true}
                  />
                </div>
 
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Action Internal Name"
                    fullWidth={true}
                    value={data.internalTitle}
                    onChange={ (event) => { handleInputChange(event, 'internalTitle', event.target.value) } }
                    errorText={errors.internalTitleErrorText}
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Action Public Name"
                    fullWidth={true}
                    value={data.title}
                    onChange={ (event) => { handleInputChange(event, 'title', event.target.value) } }
                    errorText={errors.titleErrorText}
                  />
                </div>

                <p className={s.helpText}>
                  Please create separate listings for virtual and in-person actions.
                </p>

                <div className={s.toggleContainer}>
                  <Toggle
                    label="Virtual Action"
                    toggled={data.virtual}
                    labelPosition="right"
                    onToggle={ (event, checked) => { handleInputChange(event, 'virtual', checked) } }
                  />
                </div>

                { data.virtual || (

                  <div>

                    <div className={s.sectionLabel}>Where:</div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Place Name"
                        value={data.locationName}
                        onChange={ (event) => { handleInputChange(event, 'locationName', event.target.value) } }
                        errorText={errors.locationNameErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Street Address"
                        value={data.streetAddress}
                        onChange={ (event) => { handleInputChange(event, 'streetAddress', event.target.value) } }
                        errorText={errors.streetAddressErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Street Address 2"
                        value={data.streetAddress2}
                        onChange={ (event) => { handleInputChange(event, 'streetAddress2', event.target.value) } }
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="City"
                        value={data.city}
                        onChange={ (event) => { handleInputChange(event, 'city', event.target.value) } }
                        errorText={errors.cityErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Zipcode"
                        type="number"
                        value={data.zipcode}
                        onChange={ (event) => { handleInputChange(event, 'zipcode', event.target.value) } }
                        errorText={errors.zipcodeErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <AutoComplete
                        floatingLabelText="State"
                        searchText={data.state}
                        dataSource={statesList}
                        onUpdateInput={ (text) => { handleInputChange(undefined, 'state', text) } }
                        ref={ (input) => { refs.stateInput = input } }
                        errorText={errors.stateErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Location Notes"
                        fullWidth={true}
                        value={data.locationNotes}
                        onChange={ (event) => { handleInputChange(event, 'locationNotes', event.target.value) } }
                        errorText={errors.locationNotesErrorText}
                      />
                    </div>
                  </div>
                )}

                <div>

                  <div className={s.sectionLabel}>When:</div>

                  <div className={s.textFieldContainer}>
                    <DatePicker 
                      value={data.date} 
                      onChange={ (event, date) => { handleInputChange(event, 'date', date) } }
                      container="dialog" 
                      dialogContainerStyle={dialogStyle}
                      floatingLabelText="Date"
                      errorText={errors.dateErrorText}
                      formatDate={formatDate}
                      
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <TimePicker
                      floatingLabelText="Start Time"
                      value={data.startTime} 
                      errorText={errors.startTimeErrorText}
                      onChange={ (event, date) => { handleInputChange(event, 'startTime', date) } }
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <TimePicker
                      floatingLabelText="End Time"
                      value={data.endTime} 
                      errorText={errors.endTimeErrorText}
                      onChange={ (event, date) => { handleInputChange(event, 'endTime', date) } }
                    />
                  </div>
                </div>

                <div className={s.button}>
                  <RaisedButton 
                    onTouchTap={cancel} 
                    primary={false} 
                    label="Cancel" 
                  />
                </div>

                { saving ? (

                  <div className={s.savingThrobberContainer}>
                    <CircularProgress
                      size={100}
                      thickness={5}
                    />
                  </div>
                ) : (

                  <div className={[s.organizeButton, s.button].join(' ')}>
                    <RaisedButton 
                      onTouchTap={formSubmit} 
                      primary={true} 
                      type="submit"
                      label={submitText} 
                    />
                  </div>
                )}

              </form>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default ActionInfoForm;
