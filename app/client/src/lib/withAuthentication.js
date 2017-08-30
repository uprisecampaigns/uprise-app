import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import history from 'lib/history';

import {
  promptLogin, hideLoginPrompt,
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
        // TODO: Handle confirm email case?
        switch (history.location.pathname.split('/')[1]) { // only consider root path
          case 'login': {
            if (props.loggedIn) {
              history.push('/search');
            } else {
              props.dispatch(hideLoginPrompt());
            }
            break;
          }

          case 'signup': {
            if (props.loggedIn) {
              history.push('/welcome');
            } else {
              props.dispatch(hideLoginPrompt());
            }
            break;
          }

          case 'organize':
          case 'volunteer':
          case 'settings': {
            if (!props.loggedIn) {
              props.dispatch(promptLogin(history.location.pathname));
            }
            break;
          }

          default: {
            props.dispatch(hideLoginPrompt());
            break;
          }
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

