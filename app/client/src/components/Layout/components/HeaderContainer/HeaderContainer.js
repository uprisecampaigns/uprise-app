import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { attemptLogout } from 'actions/AuthActions';
import { graphql, compose } from 'react-apollo';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import Header from './components/Header';

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    handleDrawerToggle: PropTypes.func.isRequired,
  };

  clickedLogout = (event) => {
    this.props.dispatch(attemptLogout());
  }

  render() {
    return (
      <Header
        userObject={this.props.userObject}
        loggedIn={this.props.loggedIn}
        clickedLogout={this.clickedLogout}
        handleDrawerToggle={this.props.handleDrawerToggle}
      />
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : {
      email: '',
    },
  }),
  skip: ownProps => !ownProps.loggedIn,
});

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
});

export default compose(
  connect(mapStateToProps),
  withMeQuery,
)(HeaderContainer);
