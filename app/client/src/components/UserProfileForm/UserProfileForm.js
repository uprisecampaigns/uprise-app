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
  }

  static defaultProps = {
    saving: false,
  }

  render() {
    const {
      data, formSubmit, errors, saving, userId, activities,
      handleInputChange, cancel, submitText, handleToggle,
      addItem, removeItem,
    } = this.props;

    const activitiesTogglesList = togglesList({
      collection: activities,
      selectedCollection: data.activities.map(a => a.id),
      collectionName: 'activities',
      keyPropName: 'id',
      displayPropName: 'description',
      containerClassName: s.listItem, // TODO: right className?
      handleToggle,
    });

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
                    floatingLabelText="Blurb"
                    value={data.subheader}
                    onChange={(event) => { handleInputChange(event, 'subheader', event.target.value); }}
                    errorText={errors.subheaderErrorText}
                    fullWidth
                  />
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

                <ImageUploader
                  onChange={(imgSrc) => { handleInputChange(undefined, 'profileImageUrl', imgSrc); }}
                  imageSrc={data.profileImageUrl}
                  imageHeight={800}
                  imageWidth={800}
                  imageUploadOptions={{
                    collectionName: 'users',
                    collectionId: userId,
                    filePath: 'profile',
                  }}
                />

                <div className={s.sectionLabel}>Activities</div>
                { activitiesTogglesList }

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

export default UserProfileForm;
