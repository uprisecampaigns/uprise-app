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
              <div className={s.centerContent}>

                <div className={s.infoBox}>
                  <div className={s.infoBoxHeader}>Let campaigns know what activities you're interested in doing as a volunteer!</div>

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
