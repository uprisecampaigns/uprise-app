import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoggedOutHome from 'scenes/LoggedOutHome';
import BrowseHome from 'scenes/BrowseHome';

function HomeWrapper(props) {
  const { fetchingUpdate, loggedIn } = props;

  if (fetchingUpdate || loggedIn) {
    return (
      <BrowseHome />
    );
  }

  return (
    <LoggedOutHome {...props} />
  );
}

HomeWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  fetchingUpdate: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingUpdate: state.userAuthSession.fetchingAuthUpdate,
});

export default connect(mapStateToProps)(HomeWrapper);
