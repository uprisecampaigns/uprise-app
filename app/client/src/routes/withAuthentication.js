import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import history from 'lib/history';

export default (WrappedComponent) => {

  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
    }

    componentWillMount = () => {
      if (!this.props.fetchingUpdate && !this.props.loggedIn) {
        history.push('/');
      }
    }

    componentWillReceiveProps = (nextProps) => {
      if (!nextProps.fetchingUpdate && !nextProps.loggedIn) {
        history.push('/');
      }
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

