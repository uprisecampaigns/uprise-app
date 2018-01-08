import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';

import UserProfile from 'components/UserProfile';

import UserQuery from 'schemas/queries/UserQuery.graphql';


class UserProfileContainer extends Component {
  static propTypes = {
    user: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    user: undefined,
  }

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.user) {
      const { user } = this.props;

      return (
        <UserProfile
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

export default compose(withUserQuery)(UserProfileContainer);
