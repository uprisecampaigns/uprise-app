import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { 
  OpportunitiesQuery, 
  ActivitiesQuery,
  TypesQuery 
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
    keywords: state.opportunitiesSearch.keywords
  };
}

const ConnectedOpportunitiesSearch = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
  graphql(TypesQuery, graphqlOptions('types')),
  connect(mapSearchStateToProps)
)(SearchOpportunityInputs);

class SearchOpportunitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  state = {
    keyword: '',
  }

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

  handleAddKeyword = () => {
    this.props.dispatch(addSearchItem('keywords', this.state.keyword));

    this.setState(Object.assign({},
      this.state,
      { keyword: '' }
    ));
  }

  handleInputChange = (event, type, value) => {
    this.setState(Object.assign({},
      this.state,
      { [type]: value }
    ));
  }

  render() {
    return (
      <div>
        <ConnectedOpportunitiesSearch 
          data={this.state}
          addKeyword={this.handleAddKeyword}
          removeKeyword={this.handleRemoveKeyword}
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
