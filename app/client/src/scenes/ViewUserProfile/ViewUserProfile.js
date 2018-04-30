import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';

import ViewUserProfile from 'components/ViewUserProfile';

import UserQuery from 'schemas/queries/UserQuery.graphql';


class ViewUserProfileScene extends Component {
  static propTypes = {
    me: PropTypes.object,
    user: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    isUser: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    userId: PropTypes.string,
  }

  static defaultProps = {
    user: undefined,
    me: undefined,
    userId: undefined,
    isUser: false,
  }

  render() {
    if (this.props.me && this.props.user) {
      const { me, user } = this.props;

      return (
        <ViewUserProfile
          user={user}
          me={me}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  me: state.userAuthSession.userObject,
});

export default compose(
  connect(mapStateToProps),
  graphql(UserQuery, {
    options: (ownProps) => {
      if (typeof ownProps.me === 'undefined') {
        return {
          skip: true,
        };
      }

      const variables = {
        search: {
          id: ownProps.userId,
        },
      };

      if (ownProps.isUser) {
        variables.search.id = ownProps.me.id;
      }

      return {
        variables,
        fetchPolicy: 'cache-and-network',
      };
    },
    props: ({ data: { user } = {} }) => ({
      user,
    }),
  }),
)(ViewUserProfileScene);
