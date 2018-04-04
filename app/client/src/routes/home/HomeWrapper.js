import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoggedOutHome from 'scenes/LoggedOutHome';
import BrowseHome from 'scenes/BrowseHome';

import { setRole } from 'actions/PageNavActions';

class HomeWrapper extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    fetchingUpdate: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.setContent();
  }

  componentDidUpdate() {
    this.setContent();
  }

  setContent() {
    const {
      fetchingUpdate, loggedIn,
      dispatch,
    } = this.props;

    if (fetchingUpdate || loggedIn) {
      dispatch(setRole('volunteer'));
    }
  }

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
