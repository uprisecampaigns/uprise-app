import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';

import s from 'styles/Form.scss';


class ManageCampaignInfoForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
  }

  render() {
    const { 
      data, user, refs, formSubmit, errors,
      handleInputChange
    } = this.props;

    const statesList = Object.keys(states);

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              <form 
                className={s.form}
                onSubmit={formSubmit}
              >
                <div> {this.props.error} </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Campaign Name"
                    value={data.title}
                    onChange={ (event) => { handleInputChange(event, 'title', event.target.value) } }
                    errorText={errors.titleErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Street Address"
                    value={data.streetAddress}
                    onChange={ (event) => { handleInputChange(event, 'streetAddress', event.target.value) } }
                    errorText={errors.streetAddressErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Street Address 2"
                    value={data.streetAddress2}
                    onChange={ (event) => { handleInputChange(event, 'streetAddress2', event.target.value) } }
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Website"
                    value={data.websiteUrl}
                    onChange={ (event) => { handleInputChange(event, 'websiteUrl', event.target.value) } }
                    errorText={errors.websiteUrlErrorText}
                    fullWidth={true}
                    type="url"
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone"
                    value={data.phoneNumber}
                    onChange={ (event) => { handleInputChange(event, 'phoneNumber', event.target.value) } }
                    errorText={errors.phoneNumberErrorText}
                    fullWidth={true}
                    type="tel"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="City"
                    value={data.city}
                    onChange={ (event) => { handleInputChange(event, 'city', event.target.value) } }
                    errorText={errors.cityErrorText}
                    fullWidth={true}
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
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    disabled={true}
                    value={data.email}
                    fullWidth={true}
                  />
                </div>
                <div className={s.button}>
                  <RaisedButton 
                    onTouchTap={formSubmit} 
                    primary={true} 
                    type="submit"
                    label="Save" 
                  />
                </div>
              </form>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default ManageCampaignInfoForm;
