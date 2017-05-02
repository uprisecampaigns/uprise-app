import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import history from 'lib/history';

export default (WrappedComponent) => {

  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
    }

    redirect = (props) => {
      if (!props.fetchingUpdate) {
        console.log(history.location);

        if (history.location.pathname === '/login') {
          props.loggedIn && history.push('/search');
        } else {
          if (!props.loggedIn) {
            history.push('/');
          }
        }
      }
    }

    componentWillMount = () => {
      this.redirect(this.props);
    }

    componentWillReceiveProps = (nextProps) => {
      this.redirect(nextProps);
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      loggedIn: state.userAuthSession.isLoggedIn,
      fetchingUpdate: state.userAuthSession.fetchingAuthUpdate
    };
  }

  return connect(mapStateToProps)(WithAuthentication);
}

