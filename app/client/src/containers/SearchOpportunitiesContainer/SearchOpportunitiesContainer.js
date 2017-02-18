import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { 
  OpportunitiesQuery, 
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
} from 'schemas/queries';

import { 
  addSearchItem, removeSearchItem,
} from 'actions/SearchOpportunitiesActions';

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

const mapSearchStateToProps = (state) => {
  return {
    selectedKeywords: state.opportunitiesSearch.keywords,
    selectedTypes: state.opportunitiesSearch.types,
    selectedLevels: state.opportunitiesSearch.levels,
    selectedActivities: state.opportunitiesSearch.activities
  };
}

const ConnectedOpportunitiesSearchInputs = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
  graphql(TypesQuery, graphqlOptions('types')),
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect(mapSearchStateToProps)
)(SearchOpportunityInputs);

class SearchOpportunitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  handleRemoveKeyword = (keywordToDelete) => {
    this.props.dispatch(removeSearchItem('keywords', keywordToDelete));
  }

  handleToggle = (collectionName, on, value) => {
    if (on) {
      this.props.dispatch(addSearchItem(collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem(collectionName, value));
    }
  }

  handleAddSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem(collectionName, value));
  }

  handleRemoveSelectedItem = (collectionName, value) => {
    this.props.dispatch(removeSearchItem(collectionName, value));
  }

  render() {
    return (
      <div>
        <SearchOpportunityInputs 
          addSelectedItem={this.handleAddSelectedItem}
          removeSelectedItem={this.handleRemoveSelectedItem}
          handleToggle={this.handleToggle}
          handleInputChange={this.handleInputChange}
        />

        <OpportunityResultsWithData
          search={{
            keywords: this.props.keywords,
            types: this.props.types,
            activities: this.props.activities
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
  };
}

export default connect(mapStateToProps)(SearchOpportunitiesContainer);
