import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { attemptLogout } from 'actions/AuthActions';

import Header from 'components/Header';

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
  }

  clickedLogout = (event) => {
    this.props.dispatch(attemptLogout());
  }

  render() {
    return (
      <Header
        userObject={this.props.userObject}
        loggedIn={this.props.loggedIn}
        clickedLogout={this.clickedLogout}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
    userObject: state.userAuthSession.userObject
  };
}

export default connect(mapStateToProps)(HeaderContainer);
