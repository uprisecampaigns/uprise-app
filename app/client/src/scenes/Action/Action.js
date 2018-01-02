import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import ActionProfile from 'components/ActionProfile';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';


class Action extends Component {
  static propTypes = {
    action: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    actionSlug: PropTypes.string.isRequired,
  };

  static defaultProps = {
    action: undefined,
  }

  render() {
    if (this.props.action) {
      const { action } = this.props;

      return (
        <div>
          <ActionProfile
            action={action}
          />
        </div>
      );
    }
    return null;
  }
}

const withActionQuery = graphql(ActionQuery, {
  options: ownProps => ({
    variables: {
      search: {
        slug: ownProps.actionSlug,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    action: data.action,
  }),
});

export default withActionQuery(Action);
