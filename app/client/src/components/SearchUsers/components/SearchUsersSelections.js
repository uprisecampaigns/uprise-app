
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import SelectedItemsContainer from 'components/SelectedItemsContainer';

import {
  removeSearchItem,
} from 'actions/SearchActions';

import s from 'styles/Search.scss';


const SelectedKeywordsContainer = connect(state => ({ items: state.usersSearch.keywords }))(SelectedItemsContainer);

const SelectedTagsContainer = connect(state => ({ items: state.usersSearch.tags }))(SelectedItemsContainer);

const SelectedGeographiesContainer = connect(state => ({ items: state.usersSearch.geographies }))(SelectedItemsContainer);

const renderSelectedGeographyLabel = geography => `Within ${geography.distance} miles of ${geography.zipcode}`;

class SearchUsersSelections extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  removeSelectedItem = (collectionName, value) => {
    this.props.dispatch(removeSearchItem('user', collectionName, value));
  }

  render() {
    const {
      removeSelectedItem,
    } = this;

    return (
      <div className={s.selectedInputs}>
        <SelectedTagsContainer
          collectionName="tags"
          removeItem={removeSelectedItem}
        />
        <SelectedKeywordsContainer
          collectionName="keywords"
          removeItem={removeSelectedItem}
        />
        <SelectedGeographiesContainer
          collectionName="geographies"
          removeItem={removeSelectedItem}
          renderLabel={renderSelectedGeographyLabel}
        />
      </div>
    );
  }
}

export default connect()(SearchUsersSelections);
