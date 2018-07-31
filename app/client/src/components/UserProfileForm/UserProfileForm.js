import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import togglesList from 'lib/togglesList';

import ImageUploader from 'components/ImageUploader';
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';

// import s from 'styles/Form.scss';
import s from 'styles/UserProfile.scss';

class UserProfileForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
    handleToggle: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    saving: false,
  };

  render() {
    const {
      data,
      formSubmit,
      errors,
      saving,
      userId,
      activities,
      handleInputChange,
      cancel,
      submitText,
      handleToggle,
      addItem,
      removeItem,
    } = this.props;

    const activitiesTogglesList = togglesList({
      collection: activities,
      selectedCollection: data.activities.map((a) => a.id),
      collectionName: 'activities',
      keyPropName: 'id',
      displayPropName: 'description',
      containerClassName: s.listItem, // TODO: right className?
      handleToggle,
    });

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <form className={s.form} onSubmit={formSubmit}>
            <div className={s.userProfileContainer}>
              <div className={s.leftContent}>
                {saving ? (
                  <div className={s.savingThrobberContainer}>
                    <CircularProgress size={100} thickness={5} />
                  </div>
                ) : (
                  <div className={s.saveButton} onClick={formSubmit} onKeyPress={formSubmit} role="button" tabIndex="0">
                    {submitText}
                  </div>
                )}

                <div className={s.profileImageContainer}>
                  <ImageUploader
                    onChange={(imgSrc) => {
                      handleInputChange(undefined, 'profileImageUrl', imgSrc);
                    }}
                    imageSrc={data.profileImageUrl}
                    imageHeight={800}
                    imageWidth={800}
                    imageUploadOptions={{
                      collectionName: 'users',
                      collectionId: userId,
                      filePath: 'profile',
                    }}
                  />
                </div>

                {data.firstName && (
                  <div className={s.nameHeader}>
                    {data.firstName} {data.lastName}
                  </div>
                )}

                {data.city &&
                  data.state && (
                    <div className={s.userLocation}>
                      {data.city}, {data.state}
                    </div>
                  )}

                <div className={s.smallHeader}>Your Blurb</div>
                <div className={s.formFieldContainer}>
                  <TextField
                    className={s.textareaContainer}
                    hintText="Mom, Philanthropist, Problem solver, Contact me for..."
                    value={data.subheader}
                    multiLine
                    rows={2}
                    fullWidth
                    onChange={(event) => {
                      handleInputChange(event, 'subheader', event.target.value);
                    }}
                    errorText={errors.subheaderErrorText}
                    underlineShow={false}
                  />
                </div>

                <div className={s.smallHeader}>Keywords</div>
                <div className={[s.keywordsContainer, s.formFieldContainer].join(' ')}>
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
              </div>

              <div className={s.centerContent}>
                <div className={s.bodyText}>
                  <p>
                    Describe yourself, choose activities and add keywords so we can match you with the perfect
                    volunteering opportunities!
                  </p>
                  <p>
                    Organizers will NOT have access to your email or phone unless you give your permission. They may
                    email you through UpRise internal messaging so watch for UpRise Alerts in your email inbox.
                  </p>
                </div>

                <div className={s.infoBox}>
                  <div className={s.infoBoxHeader}>More about me...</div>
                  <div className={s.smallText}>
                    Write a short description of yourself. Tell organizers whatever you like about who you are, why you
                    volunteer, your skills and experience, and what you are looking for in a volunteering opportunity.
                  </div>
                  <div className={s.userDescription}>
                    <TextField
                      className={s.textareaContainer}
                      name="description"
                      hintText="Write a short description of yourself"
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
                </div>

                <div className={s.infoBox}>
                  <div className={s.infoBoxHeader}>Activities I'm interested in...</div>

                  <div className={s.infoBoxContainer}>{activitiesTogglesList}</div>

                  {saving ? (
                    <div className={s.savingThrobberContainer}>
                      <CircularProgress size={100} thickness={5} />
                    </div>
                  ) : (
                    <div
                      className={s.saveButton}
                      onClick={formSubmit}
                      onKeyPress={formSubmit}
                      role="button"
                      tabIndex="0"
                    >
                      {submitText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default UserProfileForm;
