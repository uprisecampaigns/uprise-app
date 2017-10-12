import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';

import history from 'lib/history';

import {
  addSearchItem, clearSearch,
} from 'actions/SearchActions';

import { setPage } from 'actions/PageNavActions';


function KeywordTag(props) {
  const {
    dispatch, label, type, ...other
  } = props;

  const handleClicked = (event) => {
    event.stopPropagation();
    event.preventDefault();

    dispatch(clearSearch(type));
    dispatch(addSearchItem(type, 'tags', label));
    dispatch(setPage('home', type));
    history.push('/search');
  };

  return (
    <Chip
      {...other}
      onTouchTap={handleClicked}
    >
      {label}
    </Chip>
  );
}

KeywordTag.propTypes = {
  dispatch: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default connect()(KeywordTag);
