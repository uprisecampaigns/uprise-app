import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';

import TogglesList from 'components/TogglesList';
import ImageUploader from 'components/ImageUploader';
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';

import formStyles from 'styles/Form.scss';
import profileStyles from 'styles/Profile.scss';


const s = { ...profileStyles, ...formStyles };

class UserProfileForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    handleToggle: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const {
      data, errors, user, activities,
      handleInputChange, handleToggle,
      addItem, removeItem,
    } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.profileContainer}>
          <div className={s.leftContainer}>
            <div className={[s.namePhotoContainer, s.profileBox].join(' ')}>
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
                {
                // eslint-disable-next-line max-len
                }Write a short description of yourself. Tell organizers whatever you like about who you are, why you volunteer, your skills and experience, and what you are looking for in a volunteering opportunity.
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
                {
                // eslint-disable-next-line max-len
                }Select the activities you&apos;re interested in volunteering for. Campaigns will use this to find and contact you if their needs fit your choices
              </div>
              <div className={s.sectionLabel}>Activities</div>
              <TogglesList
                collection={activities}
                selectedCollection={data.activities.map(a => a.id)}
                collectionName="activities"
                keyPropName="id"
                displayPropName="title"
                secondaryDisplayPropName="description"
                handleToggle={handleToggle}
                containerClassName={s.inlineTogglesContainer}
                itemClassName={s.inlineTogglesItem}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfileForm;
