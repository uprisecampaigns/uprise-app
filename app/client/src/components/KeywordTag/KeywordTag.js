import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';

import history from 'lib/history';

import {
  addSearchItem, clearSearch,
} from 'actions/SearchActions';

import s from './KeywordTag.scss';


function KeywordTag(props) {
  const { dispatch, label, type, ...other } = props;

  const handleClicked = (event) => {
    event.stopPropagation();
    event.preventDefault();

    dispatch(clearSearch(type));
    dispatch(addSearchItem(type, 'tags', label));
    history.push('/search');
  };

  return (
    <Chip
      { ...other }
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
