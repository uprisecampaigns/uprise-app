import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { OpportunityQuery  } from 'schemas/queries';

import SearchOpportunities from 'components/SearchOpportunities';


const withOpportunitiesQuery = graphql(OpportunityQuery, {
  props: ({ data }) => ({
    opportunity: !data.loading && data.opportunity ? data.opportunity : {
      title: 'loading'
    }
  }),
});

const OpportunitiesWithData = withOpportunitiesQuery(SearchOpportunities);

class SearchOpportunitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  render() {
    return (
      <OpportunitiesWithData
        title="Phone Bank Party"
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
}

export default connect(mapStateToProps)(SearchOpportunitiesContainer);
