import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { 
  OpportunitiesQuery, 
} from 'schemas/queries';

import SearchOpportunityResults from 'components/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunityInputs';


const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      [collection]: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const OpportunityResultsWithData = graphql(OpportunitiesQuery, graphqlOptions('opportunities'))(SearchOpportunityResults);

class SearchOpportunitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  render() {
    return (
      <div>
        <SearchOpportunityInputs 
        />

        <OpportunityResultsWithData
          search={{
            keywords: this.props.keywords,
            activities: this.props.activities,
            types: this.props.types,
            levels: this.props.levels,
            issueAreas: this.props.issueAreas,
            campaignNames: this.props.campaignNames,
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    keywords: state.opportunitiesSearch.keywords,
    types: state.opportunitiesSearch.types,
    activities: state.opportunitiesSearch.activities,
    campaignNames: state.opportunitiesSearch.campaignNames,
    issueAreas: state.opportunitiesSearch.issueAreas,
    levels: state.opportunitiesSearch.levels,
  };
}

export default connect(mapStateToProps)(SearchOpportunitiesContainer);
