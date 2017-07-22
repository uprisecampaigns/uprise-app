import React from 'react';
import { connect } from 'react-redux';
import history from 'lib/history';

export default (WrappedComponent) => {
  class WithAuthentication extends React.Component {
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
          history.push('/');
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

