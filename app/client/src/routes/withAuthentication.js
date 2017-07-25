import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import history from 'lib/history';

import {
  promptLogin,
} from 'actions/NotificationsActions';


export default (WrappedComponent) => {
  class WithAuthentication extends Component {
    static PropTypes = {
      dispatch: PropTypes.func.isRequired,
    }

    componentWillMount = () => {
      this.redirect(this.props);
    }

    componentWillReceiveProps = (nextProps) => {
      this.redirect(nextProps);
    }

    redirect = (props) => {
      if (!props.fetchingUpdate) {
        if (history.location.pathname === '/login') {
          props.loggedIn && history.push('/search');
        } else if (!props.loggedIn) {
          props.dispatch(promptLogin());
          // history.push('/');
        }
      }
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  const mapStateToProps = state => ({
    loggedIn: state.userAuthSession.isLoggedIn,
    fetchingUpdate: state.userAuthSession.fetchingAuthUpdate,
  });

  return connect(mapStateToProps)(WithAuthentication);
};

