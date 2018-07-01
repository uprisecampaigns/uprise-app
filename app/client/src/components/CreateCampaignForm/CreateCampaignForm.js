import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import states from 'lib/states-list';

import s from 'styles/Form.scss';

class CreateCampaignForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      titleErrorText: PropTypes.string.isRequired,
      websiteUrlErrorText: PropTypes.string.isRequired,
      phoneNumberErrorText: PropTypes.string.isRequired,
      streetAddressErrorText: PropTypes.string.isRequired,
      cityErrorText: PropTypes.string.isRequired,
      stateErrorText: PropTypes.string.isRequired,
      zipcodeErrorText: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    saving: false,
  };

  render() {
    const { data, refs, formSubmit, errors, saving, handleInputChange, cancel, submitText } = this.props;

    const statesList = Object.keys(states);

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              <form className={s.form} onSubmit={formSubmit}>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Campaign Name"
                    value={data.title}
                    onChange={(event) => {
                      handleInputChange(event, 'title', event.target.value);
                    }}
                    errorText={errors.titleErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Website"
                    value={data.websiteUrl}
                    onChange={(event) => {
                      handleInputChange(event, 'websiteUrl', event.target.value);
                    }}
                    errorText={errors.websiteUrlErrorText}
                    fullWidth
                    type="url"
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone"
                    value={data.phoneNumber}
                    onChange={(event) => {
                      handleInputChange(event, 'phoneNumber', event.target.value);
                    }}
                    errorText={errors.phoneNumberErrorText}
                    fullWidth
                    type="tel"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Street Address"
                    value={data.streetAddress}
                    onChange={(event) => {
                      handleInputChange(event, 'streetAddress', event.target.value);
                    }}
                    errorText={errors.streetAddressErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Street Address 2"
                    value={data.streetAddress2}
                    onChange={(event) => {
                      handleInputChange(event, 'streetAddress2', event.target.value);
                    }}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="City"
                    value={data.city}
                    onChange={(event) => {
                      handleInputChange(event, 'city', event.target.value);
                    }}
                    errorText={errors.cityErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <AutoComplete
                    floatingLabelText="State"
                    searchText={data.state}
                    dataSource={statesList}
                    onUpdateInput={(text) => {
                      handleInputChange(undefined, 'state', text);
                    }}
                    ref={(input) => {
                      refs.stateInput = input;
                    }}
                    errorText={errors.stateErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Zipcode"
                    value={data.zipcode}
                    type="text"
                    pattern="[0-9]{5}"
                    onChange={(event) => {
                      handleInputChange(event, 'zipcode', event.target.value);
                    }}
                    errorText={errors.zipcodeErrorText}
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField floatingLabelText="Email" disabled value={data.email} fullWidth />
                </div>

                <div className={s.button} onClick={cancel} onKeyPress={cancel} role="button" tabIndex="0">
                  Cancel
                </div>

                {saving ? (
                  <div className={s.savingThrobberContainer}>
                    <CircularProgress size={100} thickness={5} />
                  </div>
                ) : (
                  <div
                    className={[s.organizeButton, s.button].join(' ')}
                    onClick={formSubmit}
                    onKeyPress={formSubmit}
                    role="button"
                    tabIndex="0"
                  >
                    {submitText}
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

export default CreateCampaignForm;
