import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { OpportunitiesQuery, ActivitiesQuery } from 'schemas/queries';

import { addKeyword, removeKeyword,
         addActivity, removeActivity } from 'actions/SearchOpportunitiesActions';

import SearchOpportunityResults from 'components/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunityInputs';


const withOpportunitiesQuery = graphql(OpportunitiesQuery, {
  props: ({ data }) => ({
    opportunities: !data.loading && data.opportunities ? data.opportunities : []
  }),
});

const withActivitiesQuery = graphql(ActivitiesQuery, {
  props: ({ data }) => ({
    activities: !data.loading && data.activities ? data.activities : []
  }),
});

const OpportunityResultsWithData = withOpportunitiesQuery(SearchOpportunityResults);

const mapSearchStateToProps = (state) => {
  return {
    keywords: state.opportunitiesSearch.keywords
  };
}

const ConnectedOpportunitiesSearch = compose(
  withActivitiesQuery,
  connect(mapSearchStateToProps)
)(SearchOpportunityInputs);

// const OpportunitiesSearchWithActivities = withActivitiesQuery(SearchOpportunityInputs);

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
    this.props.dispatch(addKeyword(keywordToDelete));
  }

  handleToggleActivity = (on, activity) => {
    if (on) {
      this.props.dispatch(addActivity(activity));
    } else {
      this.props.dispatch(removeActivity(activity));
    }
  }

  handleAddKeyword = () => {
    this.props.dispatch(addKeyword(this.state.keyword));

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
        <OpportunityResultsWithData
          search={{
            keywords: this.props.keywords,
            activities: this.props.activities
          }}
        />
        <ConnectedOpportunitiesSearch 
          search={{}}
          data={this.state}
          addKeyword={this.handleAddKeyword}
          removeKeyword={this.handleRemoveKeyword}
          toggleActivity={this.handleToggleActivity}
          handleInputChange={this.handleInputChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    keywords: state.opportunitiesSearch.keywords,
    activities: state.opportunitiesSearch.activities
  };
}

export default connect(mapStateToProps)(SearchOpportunitiesContainer);
