import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';

import togglesList from 'lib/togglesList';

import s from 'styles/Organize.scss';
import f from 'styles/Form.scss';


class ActionProfileForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleToggle: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    submitText: PropTypes.string,
    showSaveButton: PropTypes.bool,
  }

  static defaultProps = {
    showSaveButton: false,
    submitText: 'Save Changes',
  }

  render() {
    const {
      data, errors, activities, handleToggle,
      addItem, removeItem, submitText, saving,
      handleInputChange, formSubmit, showSaveButton,
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
        <div className={s.editActionProfileContainer}>

          <div className={s.sectionLabel}>
            1. Description
          </div>

          <div className={f.textareaContainer}>
            <TextField
              name="description"
              hintText="Write a short description here.
                This will show up in the search results.
                You do not need to include the name of the opportunity, or issues, keywords, etc. as they will all appear automatically"
              value={data.description}
              multiLine
              rows={4}
              onChange={(event) => { handleInputChange(event, 'description', event.target.value); }}
              errorText={errors.descriptionErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          <div className={f.sectionLabel}>
            2. Keywords
          </div>

          <div className={f.keywordsContainer}>
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

          { showSaveButton && saving && (
            <div className={s.savingThrobberContainer}>
              <CircularProgress
                size={100}
                thickness={5}
              />
            </div>
          )}

          { showSaveButton && !saving && (
            <div className={[s.organizeButton, s.button].join(' ')}>
              <RaisedButton
                onClick={formSubmit}
                primary
                type="submit"
                label={submitText}
              />
            </div>
          )}

          <div className={f.sectionLabel}>
            2. Activities
          </div>

          <div className={s.togglesListContainer}>
            { activitiesTogglesList }
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  uploading: state.uploads.uploading,
});

export default compose(
  connect(mapStateToProps),
  graphql(ActivitiesQuery, {
    props: ({ data }) => ({
      activities: !data.loading && data.activities ? data.activities : [],
    }),
  }),
)(ActionProfileForm);
