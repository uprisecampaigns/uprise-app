import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';

import states from 'lib/states-list';

import s from 'styles/Form.scss';


class CampaignSettingsForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
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
      orgWebsiteErrorText: PropTypes.string.isRequired,
      orgNameErrorText: PropTypes.string.isRequired,
      orgContactNameErrorText: PropTypes.string.isRequired,
      orgContactPhoneErrorText: PropTypes.string.isRequired,
      orgContactPositionErrorText: PropTypes.string.isRequired,
      orgContactEmailErrorText: PropTypes.string.isRequired,
      orgStatusErrorText: PropTypes.string.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    saving: false,
  }

  render() {
    const {
      data, refs, formSubmit, errors, saving,
      handleInputChange, addItem, removeItem,
      cancel, submitText,
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
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Campaign Name"
                    value={data.title}
                    onChange={(event) => { handleInputChange(event, 'title', event.target.value); }}
                    errorText={errors.titleErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Website"
                    value={data.websiteUrl}
                    onChange={(event) => { handleInputChange(event, 'websiteUrl', event.target.value); }}
                    errorText={errors.websiteUrlErrorText}
                    fullWidth
                    type="url"
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone"
                    value={data.phoneNumber}
                    onChange={(event) => { handleInputChange(event, 'phoneNumber', event.target.value); }}
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
                    onChange={(event) => { handleInputChange(event, 'streetAddress', event.target.value); }}
                    errorText={errors.streetAddressErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Street Address 2"
                    value={data.streetAddress2}
                    onChange={(event) => { handleInputChange(event, 'streetAddress2', event.target.value); }}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="City"
                    value={data.city}
                    onChange={(event) => { handleInputChange(event, 'city', event.target.value); }}
                    errorText={errors.cityErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <AutoComplete
                    floatingLabelText="State"
                    searchText={data.state}
                    dataSource={statesList}
                    onUpdateInput={(text) => { handleInputChange(undefined, 'state', text); }}
                    ref={(input) => { refs.stateInput = input; }}
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
                    onChange={(event) => { handleInputChange(event, 'zipcode', event.target.value); }}
                    errorText={errors.zipcodeErrorText}
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    disabled
                    value={data.email}
                    fullWidth
                  />
                </div>

                <div className={s.sectionLabel}>Official Organization</div>

                <div className={s.toggleContainer}>
                  <Toggle
                    label="Are you representing a legally established organization? (Corporation, Non-profit, Committee, Association, etc.)"
                    toggled={data.legalOrg}
                    labelPosition="left"
                    onToggle={(event, checked) => { handleInputChange(event, 'legalOrg', checked); }}
                  />
                </div>

                { data.legalOrg && (

                  <div>

                    <p className={s.helpText}>
                      Please provide a reference who can verify that you are authorized to represent this organization.
                    </p>
                    <p className={s.helpText}>OR</p>
                    <p className={s.helpText}>
                      Provide a link to a webpage showing your official role in the organization.
                    </p>

                    <p className={s.helpText}>
                      This information will remain private and will be used solely for internal verification purposes.
                    </p>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Web page"
                        value={data.orgWebsite}
                        onChange={(event) => { handleInputChange(event, 'orgWebsite', event.target.value); }}
                        errorText={errors.orgWebsiteErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Organization Name"
                        value={data.orgName}
                        onChange={(event) => { handleInputChange(event, 'orgName', event.target.value); }}
                        errorText={errors.orgNameErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Organization Type"
                        value={data.orgStatus}
                        onChange={(event) => { handleInputChange(event, 'orgStatus', event.target.value); }}
                        errorText={errors.orgStatusErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Contact Name"
                        value={data.orgContactName}
                        onChange={(event) => { handleInputChange(event, 'orgContactName', event.target.value); }}
                        errorText={errors.orgContactNameErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Contact Position"
                        value={data.orgContactPosition}
                        onChange={(event) => { handleInputChange(event, 'orgContactPosition', event.target.value); }}
                        errorText={errors.orgContactPositionErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Contact Email"
                        value={data.orgContactEmail}
                        onChange={(event) => { handleInputChange(event, 'orgContactEmail', event.target.value); }}
                        errorText={errors.orgContactEmailErrorText}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Contact Phone"
                        value={data.orgContactPhone}
                        onChange={(event) => { handleInputChange(event, 'orgContactPhone', event.target.value); }}
                        errorText={errors.orgContactPhoneErrorText}
                      />
                    </div>

                  </div>
                )}

                <div className={s.sectionLabel}>Keywords</div>

                <div className={s.keywordsContainer}>
                  <SearchBar
                    collectionName="tags"
                    inputLabel="Keyword"
                    addItem={addItem}
                    iconName="add"
                    className={s.keywordsInputContainer}
                  />

                  <SelectedItemsContainer
                    collectionName="tags"
                    removeItem={removeItem}
                    items={data.tags}
                    className={s.selectedKeywordsContainer}
                  />
                </div>

                <div className={s.button}>
                  <RaisedButton
                    onClick={cancel}
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
                      onClick={formSubmit}
                      primary
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

export default CampaignSettingsForm;
