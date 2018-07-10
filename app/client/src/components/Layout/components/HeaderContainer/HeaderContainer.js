import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { attemptLogout } from 'actions/AuthActions';
import { graphql, compose } from 'react-apollo';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import Header from './components/Header';
import VolunteerHeader from './components/VolunteerHeader';
import OrganizeHeader from './components/OrganizeHeader';
import UserHeader from './components/UserHeader';

class HeaderContainer extends Component {
  static propTypes = {
    handleDrawerToggle: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    userObject: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    role: PropTypes.string.isRequired,
  };

  clickedLogout = (event) => {
    this.props.dispatch(attemptLogout());
  };

  render() {
    return (
      <div>
        <Header
          userObject={this.props.userObject}
          loggedIn={this.props.loggedIn}
          clickedLogout={this.clickedLogout}
          handleDrawerToggle={this.props.handleDrawerToggle}
          role={this.props.role}
        />
        {this.props.role === 'volunteer' && <VolunteerHeader />}
        {this.props.role === 'organize' && <OrganizeHeader />}
        {this.props.role === 'user' && <UserHeader userObject={this.props.userObject} />}
      </div>
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject:
      !data.loading && data.me
        ? data.me
        : {
            email: '',
          },
  }),
  skip: (ownProps) => !ownProps.loggedIn && !ownProps.fetchingAuthUpdate,
});

const mapStateToProps = (state) => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingAuthUpdate: state.userAuthSession.fetchingAuthUpdate,
  role: state.pageNav.role,
});

export default compose(connect(mapStateToProps), withMeQuery)(HeaderContainer);
