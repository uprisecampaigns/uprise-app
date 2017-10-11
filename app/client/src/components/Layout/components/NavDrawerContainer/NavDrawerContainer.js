import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { attemptLogout } from 'actions/AuthActions';
import { graphql, compose } from 'react-apollo';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import NavDrawer from './components/NavDrawer';

class NavDrawerContainer extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleToggle: PropTypes.func.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    userObject: PropTypes.object,
  };

  static defaultProps = {
    userObject: {
      first_name: '',
      last_name: '',
      email: '',
    },
  };

  clickedLogout = (event) => {
    this.props.dispatch(attemptLogout());
  }

  render() {
    return (
      <NavDrawer
        open={this.props.open}
        handleToggle={this.props.handleToggle}
        onRequestChange={this.props.onRequestChange}
        logout={this.clickedLogout}
        loggedIn={this.props.loggedIn}
        userObject={this.props.userObject}
      />
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : undefined,
  }),
  skip: ownProps => !ownProps.loggedIn,
});

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
});

export default compose(
  connect(mapStateToProps),
  withMeQuery,
)(NavDrawerContainer);
