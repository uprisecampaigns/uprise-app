import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoggedOutHome from 'scenes/LoggedOutHome';
import BrowseHome from 'scenes/BrowseHome';

class HomeWrapper extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    fetchingUpdate: PropTypes.bool.isRequired,
  };

  render() {
    const { fetchingUpdate, loggedIn } = this.props;

    if (fetchingUpdate || loggedIn) {
      return (
        <BrowseHome />
      );
    }

    return (
      <LoggedOutHome {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingUpdate: state.userAuthSession.fetchingAuthUpdate,
});

export default connect(mapStateToProps)(HomeWrapper);
