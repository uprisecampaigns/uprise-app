import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LoggedOutHome from 'scenes/LoggedOutHome';
import Home from 'scenes/Home';


function HomeWrapper(props) {
  const { fetchingUpdate, loggedIn } = props;

  if (!fetchingUpdate && !loggedIn) {
    return (
      <LoggedOutHome {...props} />
    );
  }
  return (
    <Home {...props} />
  );
}

HomeWrapper.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  fetchingUpdate: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingUpdate: state.userAuthSession.fetchingAuthUpdate,
});

export default connect(mapStateToProps)(HomeWrapper);
