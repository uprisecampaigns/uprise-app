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

import s from 'styles/Form.scss';


class UserProfileForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
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
  }

  static defaultProps = {
    saving: false,
  }

  render() {
    const {
      data, formSubmit, errors, saving, user, activities,
      handleInputChange, cancel, submitText, handleToggle,
      addItem, removeItem,
    } = this.props;

    const activitiesTogglesList = togglesList({
      collection: activities,
      selectedCollection: data.activities.map(a => a.id),
      collectionName: 'activities',
      keyPropName: 'id',
      displayPropName: 'title',
      secondaryDisplayPropName: 'description',
      containerClassName: s.listItem, // TODO: right className?
      handleToggle,
    });

    return (
      <div className={s.outerContainer}>
        <div className={s.editProfileContainer}>
          <div className={s.leftContainer}>
            <div className={[s.namePhotoContainer, s.editProfileBox].join(' ')}>
              <ImageUploader
                onChange={(imgSrc) => { handleInputChange(undefined, 'profileImageUrl', imgSrc); }}
                imageSrc={data.profileImageUrl}
                imageHeight={800}
                imageWidth={800}
                imageUploadOptions={{
                  collectionName: 'users',
                  collectionId: user.id,
                  filePath: 'profile',
                }}
              />

              <div className={s.profileNameHeader}>
                {user.first_name} {user.last_name}
              </div>

              <div className={s.textareaContainer}>
                <TextField
                  name="Your Blurb"
                  hintText='Example - "Mom, Philanthropist, Problem solver, Contact me for..."'
                  value={data.subheader}
                  multiLine
                  rows={4}
                  onChange={(event) => { handleInputChange(event, 'subheader', event.target.value); }}
                  errorText={errors.subheaderErrorText}
                  fullWidth
                  underlineShow={false}
                />
              </div>

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
            </div>
          </div>
          <div className={s.rightContainer}>
            <div className={[s.descriptionContainer, s.editProfileBox].join(' ')}>
              <div className={s.inputHeader}>
                More about me...
              </div>
              <div className={s.profileHelpText}>
                Write a short description of yourself. Tell organizers whatever you like about who you are, why you volunteer, your skills and experience, and what you are looking for in a volunteering opportunity.
              </div>
              <div className={s.textareaContainer}>
                <TextField
                  name="description"
                  hintText="Write a short description of yourself"
                  value={data.description}
                  multiLine
                  rows={4}
                  onChange={(event) => { handleInputChange(event, 'description', event.target.value); }}
                  errorText={errors.descriptionErrorText}
                  fullWidth
                  underlineShow={false}
                />
              </div>
            </div>
            <div className={[s.activitiesContainer, s.editProfileBox].join(' ')}>
              <div className={s.inputHeader}>
                Activities I&apos;m interested in...
              </div>
              <div className={s.profileHelpText}>
                Select the activities you&apos;re interested in volunteering for. Campaigns will use this to find and contact you if their needs fit your choices
              </div>
              <div className={s.sectionLabel}>Activities</div>
              { activitiesTogglesList }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfileForm;
