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
        if (props.loggedIn) {
          props.dispatch(hideLoginPrompt());
        }

        // TODO: Handle confirm email case?
        switch (history.location.pathname) {
          case '/login':
            if (props.loggedIn) {
              history.push('/search');
            } else {
              props.dispatch(hideLoginPrompt());
            }
            break;

          case '/signup':
            if (props.loggedIn) {
              history.push('/welcome');
            } else {
              props.dispatch(hideLoginPrompt());
            }
            break;

          case '/':
          case '/forgot-password':
          case '/terms-and-conditions':
            props.dispatch(hideLoginPrompt());
            break;

          default:
            if (!props.loggedIn) {
              props.dispatch(promptLogin(history.location.pathname));
            }
            break;
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

