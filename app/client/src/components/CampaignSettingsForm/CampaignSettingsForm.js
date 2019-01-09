import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import ImageUploader from 'components/ImageUploader';

import Link from 'components/Link';
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';

import states from 'lib/states-list';

import s from 'styles/Form.scss';

class CampaignSettingsForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired,
    campaign: PropTypes.object.isRequired,
    uploading: PropTypes.bool.isRequired,
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
  };

  static defaultProps = {
    saving: false,
  };

  render() {
    const {
      data,
      refs,
      formSubmit,
      campaignId,
      errors,
      saving,
      uploading,
      handleInputChange,
      addItem,
      removeItem,
      cancel,
      submitText,
      campaign,
    } = this.props;

    const statesList = Object.keys(states);

    return (
      <div>
        <div className={s.section}>
          <div className={s.sectionContent}>
            <div className={s.formContainer}>
              <form onSubmit={formSubmit}>
                <div className={s.uploadProfileImageContainer}>
                  <ImageUploader
                    onChange={(imgSrc) => {
                      handleInputChange(undefined, 'profileImageUrl', imgSrc);
                    }}
                    imageSrc={data.profileImageUrl}
                    imageHeight={800}
                    imageWidth={800}
                    imageUploadOptions={{
                      collectionName: 'campaigns',
                      collectionId: campaignId,
                      filePath: 'profile',
                    }}
                  />
                </div>
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
                    floatingLabelText="Subtitle"
                    hintText="The essential details, in a few words"
                    className={s.textField}
                    value={data.profileSubheader}
                    onChange={(event) => {
                      handleInputChange(event, 'profileSubheader', event.target.value);
                    }}
                    errorText={errors.profileSubheaderErrorText}
                    fullWidth
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={s.sectionsContainer}>
          <div className={s.section}>
            <div className={s.sectionContent}>
              <div className={s.formContainer}>
                <div className={s.formHeader}>Learn More</div>
                <div className={s.formBody}>Give volunteers more information about your campaign</div>
                <form onSubmit={formSubmit}>
                  <div className={s.textareaContainer}>
                    <TextField
                      name="description"
                      hintText="Write a short description here.
                This will show up in the search results.
                You do not need to include the name of the campaign, your website url, or your issues, keywords, etc.
                as they will all appear automatically"
                      value={data.description}
                      multiLine
                      rows={4}
                      onChange={(event) => {
                        handleInputChange(event, 'description', event.target.value);
                      }}
                      errorText={errors.descriptionErrorText}
                      fullWidth
                      underlineShow={false}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className={s.sectionContent}>
              <div className={s.formContainer}>
                <div className={s.formHeader}>Campaign Account</div>
                <div className={s.formBody}>This information is not displayed on the public profile</div>
                <form onSubmit={formSubmit}>
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

                  {/*
                  <h3 className={s.formHeader}>Official Organization</h3>

                  <div className={s.toggleContainer}>
                    <Toggle
                      label="Are you representing a legally established organization? (Corporation, Non-profit, Committee, Association, etc.)"
                      toggled={data.legalOrg}
                      labelPosition="left"
                      onToggle={(event, checked) => {
                        handleInputChange(event, 'legalOrg', checked);
                      }}
                    />
                  </div>

                  {data.legalOrg && (
                    <div className={s.asideContent}>
                      <div className={s.formBody}>
                        Please provide a reference who can verify that you are authorized to represent this
                        organization.
                      </div>
                      <div className={s.formBody}>OR</div>
                      <div className={s.formBody}>
                        Provide a link to a webpage showing your official role in the organization.
                      </div>

                      <div className={s.formBody}>
                        This information will remain private and will be used solely for internal verification purposes.
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="Web page"
                          value={data.orgWebsite}
                          onChange={(event) => {
                            handleInputChange(event, 'orgWebsite', event.target.value);
                          }}
                          errorText={errors.orgWebsiteErrorText}
                        />
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="Organization Name"
                          value={data.orgName}
                          onChange={(event) => {
                            handleInputChange(event, 'orgName', event.target.value);
                          }}
                          errorText={errors.orgNameErrorText}
                        />
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="Organization Type"
                          value={data.orgStatus}
                          onChange={(event) => {
                            handleInputChange(event, 'orgStatus', event.target.value);
                          }}
                          errorText={errors.orgStatusErrorText}
                        />
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="Contact Name"
                          value={data.orgContactName}
                          onChange={(event) => {
                            handleInputChange(event, 'orgContactName', event.target.value);
                          }}
                          errorText={errors.orgContactNameErrorText}
                        />
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="Contact Position"
                          value={data.orgContactPosition}
                          onChange={(event) => {
                            handleInputChange(event, 'orgContactPosition', event.target.value);
                          }}
                          errorText={errors.orgContactPositionErrorText}
                        />
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="Contact Email"
                          value={data.orgContactEmail}
                          onChange={(event) => {
                            handleInputChange(event, 'orgContactEmail', event.target.value);
                          }}
                          errorText={errors.orgContactEmailErrorText}
                        />
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="Contact Phone"
                          value={data.orgContactPhone}
                          onChange={(event) => {
                            handleInputChange(event, 'orgContactPhone', event.target.value);
                          }}
                          errorText={errors.orgContactPhoneErrorText}
                        />
                      </div>
                    </div>
                  )}

                  <h3 className={s.formHeader}>Location</h3>

                  <div className={s.formBody}>
                    Define the geographic area in which you will be operating, so volunteers can find you.
                  </div>

                  <div className={s.textFieldContainer}>
                    <SelectField
                      floatingLabelText="Campaign Location Type"
                      value={data.locationType}
                      onChange={(event, index, value) => {
                        handleInputChange(event, 'locationType', value);
                      }}
                    >
                      <MenuItem value={null} primaryText="" />
                      <MenuItem value="multi-state" primaryText="Multi-state" />
                      <MenuItem value="statewide" primaryText="Statewide" />
                      <MenuItem value="legislative-district" primaryText="Legislative District" />
                    </SelectField>
                  </div>

                  {data.locationType === 'multi-state' && (
                    <div>
                      <h3 className={s.formHeader}>Multi-state</h3>

                      <div className={s.formBody}>
                        Contact us at{' '}
                        <Link to="mailto:help@uprise.org" mailTo useAhref external>
                          help@uprise.org
                        </Link>{' '}
                        about setting up your area.
                      </div>
                    </div>
                  )}

                  {data.locationType === 'statewide' && (
                    <div>
                      <h3 className={s.formHeader}>Statewide</h3>

                      <div className={s.textFieldContainer}>
                        <AutoComplete
                          floatingLabelText="State"
                          searchText={data.locationState}
                          dataSource={statesList}
                          onUpdateInput={(text) => {
                            handleInputChange(undefined, 'locationState', text);
                          }}
                          ref={(input) => {
                            refs.stateInput = input;
                          }}
                          errorText={errors.locationStateErrorText}
                        />
                      </div>
                    </div>
                  )}

                  {data.locationType === 'legislative-district' && (
                    <div>
                      <h3 className={s.formHeader}>Legislative District</h3>

                      <div className={s.textFieldContainer}>
                        <SelectField
                          floatingLabelText="Legislative District Type"
                          value={data.legislativeDistrictType}
                          onChange={(event, index, value) => {
                            handleInputChange(event, 'legislativeDistrictType', value);
                          }}
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
                          onUpdateInput={(text) => {
                            handleInputChange(undefined, 'locationState', text);
                          }}
                          ref={(input) => {
                            refs.stateInput = input;
                          }}
                          errorText={errors.locationStateErrorText}
                        />
                      </div>

                      <div className={s.textFieldContainer}>
                        <TextField
                          floatingLabelText="District Number"
                          value={data.locationDistrictNumber}
                          type="number"
                          onChange={(event) => {
                            handleInputChange(event, 'locationDistrictNumber', event.target.value);
                          }}
                          errorText={errors.locationDistrictNumberErrorText}
                          fullWidth
                        />
                      </div>
                    </div>
                  )}
                  */}

                  {/*
                  <h3 className={s.formHeader}>Zip Code List</h3>

                  <div className={s.formBody}>
                    IMPORTANT: Please insert a list of all of the zip codes in
                    which you will be seeking volunteers for local in-person
                    volunteering activities. Contact us at{' '}
                    <Link to="mailto:help@uprise.org" useAhref mailTo external>
                      help@uprise.org
                    </Link>{' '}
                    if you need assistance
                  </div>

                  <div className={s.textFieldContainer}>
                    <TextField
                      name="zipcodeList"
                      floatingLabelText="List of zipcodes, separated by commas"
                      value={data.zipcodeList}
                      multiLine
                      onChange={(event) => {
                        handleInputChange(
                          event,
                          'zipcodeList',
                          event.target.value,
                        );
                      }}
                      errorText={errors.zipcodeListErrorText}
                      fullWidth
                    />
                  </div>
                    */}
                </form>
              </div>
            </div>
          </div>
          <div className={[s.section, s.sectionSidebar].join(' ')}>
            <div className={s.sectionContent}>
              <form onSubmit={formSubmit}>
                <div className={s.formContainer}>
                  <div className={s.formHeader}>Get in touch</div>
                  <div className={s.formBody}>How volunteers can contact you</div>

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
                  <div className={[s.textFieldContainer, s.noMarginTextField].join(' ')}>
                    <TextField floatingLabelText="Email" disabled value={data.email} fullWidth />
                  </div>
                  <div className={s.textFieldContainer}>
                    <div className={s.formBody}>
                      Visit{' '}
                      <Link to="/settings/account" useAhref>
                        account settings
                      </Link>{' '}
                      to change email.
                    </div>
                  </div>
                </div>
              </form>

              <div className={s.smallHeader}>Keywords</div>
              <div className={s.formInnerContent}>
                <div className={s.keywordsContainer}>
                  <SearchBar
                    collectionName="tags"
                    inputLabel="Keyword"
                    hintText="Enter keyword then press Enter"
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
              </div>
            </div>
          </div>
        </div>
        <div className={s.centerButtons}>
          {/*
          <div className={s.button} onClick={cancel} onKeyPress={cancel} role="button" tabIndex="0">
            Cancel
          </div>
          */}
          <Link to={`/campaign/${campaign.slug}`} className={[s.inlineButton, s.button].join(' ')}>
            Cancel
          </Link>
          {saving || uploading ? (
            <div className={s.savingThrobberContainer}>
              <CircularProgress size={100} thickness={5} />
            </div>
          ) : (
            <div
              className={[s.organizeButton, s.button, s.inlineButton].join(' ')}
              onClick={formSubmit}
              onKeyPress={formSubmit}
              role="button"
              tabIndex="0"
            >
              {submitText}
            </div>
          )}
          <Link to={`/campaign/${campaign.slug}`} className={[s.darkButton, s.button].join(' ')}>
            View Profile
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  uploading: state.uploads.uploading,
});

export default connect(mapStateToProps)(CampaignSettingsForm);
