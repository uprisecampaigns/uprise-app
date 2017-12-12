import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import UserProfile from 'components/UserProfile';

import UserQuery from 'schemas/queries/UserQuery.graphql';

import s from 'styles/Profile.scss';


class UserProfileContainer extends Component {
  static propTypes = {
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    user: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'interests',
    };
  }

  handleTabChange = (activeTab) => {
    this.setState({ activeTab });
  };


  render() {
    if (this.props.user) {
      const { user, loggedIn } = this.props;

      return (
        <UserProfile
          activeTab={this.state.activeTab}
          handleTabChange={this.handleTabChange}
          user={user}
        />
      );
    }
    return null;
  }
}

const withUserQuery = graphql(UserQuery, {
  options: ownProps => ({
    variables: {
      search: {
        id: ownProps.userId,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    user: data.user,
  }),
});

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
});

export default compose(
  connect(mapStateToProps),
  withUserQuery,
)(UserProfileContainer);
