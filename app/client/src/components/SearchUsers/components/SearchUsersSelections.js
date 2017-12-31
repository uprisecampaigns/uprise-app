
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
      </div>
    );
  }
}

export default connect()(SearchUsersSelections);
