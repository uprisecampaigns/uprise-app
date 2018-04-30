import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';

import history from 'lib/history';

import {
  addSearchItem, clearSearch,
} from 'actions/SearchActions';


function KeywordTag(props) {
  const {
    dispatch, label, type, ...other
  } = props;

  const handleClicked = (event) => {
    event.stopPropagation();
    event.preventDefault();

    dispatch(clearSearch(type));
    dispatch(addSearchItem(type, 'tags', label));

    // TODO: Currently no good way to lead directly to
    // user search
    const searchMap = {
      action: '/browse',
      campaign: '/follow',
      user: '/browse',
    };

    const newPage = searchMap[type];
    if (typeof newPage === 'string') {
      history.push(newPage);
    }
  };

  return (
    <Chip
      {...other}
      onClick={handleClicked}
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
