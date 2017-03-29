import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';

import s from 'styles/Form.scss';


class CampaignLocationForm extends Component {
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
                  <SelectField
                    floatingLabelText="Campaign Location Type"
                    value={data.locationType}
                    onChange={ (event, index, value) => { handleInputChange(event, 'locationType', value) } }
                  >
                    <MenuItem value={null} primaryText="" />
                    <MenuItem value="multi-state" primaryText="Multi-state" />
                    <MenuItem value="statewide" primaryText="Statewide" />
                    <MenuItem value="legislative-district" primaryText="Legislative District" />
                  </SelectField>
                </div>

                { data.locationType === 'multi-state' && (
                  <div>
                    <p> Contact us at help@uprise.org about setting up your area.</p>
                  </div>
                )}

                { data.locationType === 'statewide' && (
                  <div>
                    <div className={s.textFieldContainer}>
                      <AutoComplete
                        floatingLabelText="State"
                        searchText={data.locationState}
                        dataSource={statesList}
                        onUpdateInput={ (text) => { handleInputChange(undefined, 'locationState', text) } }
                        ref={ (input) => { refs.stateInput = input } }
                        errorText={errors.stateErrorText}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                )}

                { data.locationType === 'legislative-district' && (
                  <div>
                    <div className={s.textFieldContainer}>
                      <SelectField
                        floatingLabelText="Legislative District Type"
                        value={data.legislativeDistrictType}
                        onChange={ (event, index, value) => { handleInputChange(event, 'legislativeDistrictType', value) } }
                      >
                        <MenuItem value={null} primaryText="" />
                        <MenuItem value="us-congress" primaryText="US Congress" />
                        <MenuItem value="state-senate" primaryText="State Senate" />
                        <MenuItem value="state-house" primaryText="State House" />
                      </SelectField>
                    </div>

                    <div className={s.textFieldContainer}>
                      <AutoComplete
                        floatingLabelText="State"
                        searchText={data.locationState}
                        dataSource={statesList}
                        onUpdateInput={ (text) => { handleInputChange(undefined, 'locationState', text) } }
                        ref={ (input) => { refs.stateInput = input } }
                        errorText={errors.stateErrorText}
                        fullWidth={true}
                      />
                    </div>
 
                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="District Number"
                        value={data.locationDistrictNumber}
                        type="number"
                        onChange={ (event) => { handleInputChange(event, 'locationDistrictNumber', event.target.value) } }
                        errorText={errors.locationDistrictNumberErrorText}
                        fullWidth={true}
                      />
                    </div>

                  </div>
                )}

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Zipcodes"
                    value={data.zipcodeList}
                    multiLine={true}
                    onChange={ (event) => { handleInputChange(event, 'zipcodeList', event.target.value) } }
                    errorText={errors.zipcodeListErrorText}
                    fullWidth={true}
                  />
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

                  <div className={s.button}>
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

export default CampaignLocationForm;
