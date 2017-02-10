import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { MeQuery } from 'schemas/queries';

import SearchOpportunities from 'components/SearchOpportunities';

class SearchOpportunitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  render() {
    return (
      <SearchOpportunities
      />
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : {
      first_name: '',
      last_name: '',
      email: '',
      zip: ''
    }
  }),
  skip: (ownProps) => !ownProps.loggedIn,
});

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
  };
}

export default compose(
  connect(mapStateToProps),
  withMeQuery,
)(SearchOpportunitiesContainer);
