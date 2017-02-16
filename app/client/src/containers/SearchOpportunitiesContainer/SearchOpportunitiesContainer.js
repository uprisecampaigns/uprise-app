import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { OpportunitiesQuery  } from 'schemas/queries';

import SearchOpportunityResults from 'components/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunityInputs';


const withOpportunitiesQuery = graphql(OpportunitiesQuery, {
  props: ({ data }) => ({
    opportunities: !data.loading && data.opportunities ? data.opportunities : []
  }),
});

const OpportunityResultsWithData = withOpportunitiesQuery(SearchOpportunityResults);

class SearchOpportunitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  state = {
    tag: '',
    tags: [],
    activities: [],
  }

  handleRemoveTag = (tagToDelete) => {
    this.setState({ 
      tags: this.state.tags.filter( (tag) => {
        return tagToDelete !== tag;
      }),
    });
  }

  handleAddTag = () => {
    if (this.state.tag.trim() !== '' &&
        !this.state.tags.find(tag => tag.toLowerCase() === newTag.toLowerCase())) {
      
      const newTag = this.state.tag;
      this.setState({ 
        tags: this.state.tags.concat([newTag]),
        tag: ''
      });
    }
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
            tags: this.state.tags,
            activities: this.state.activities
          }}
        />
        <SearchOpportunityInputs
          data={this.state}
          addTag={this.handleAddTag}
          removeTag={this.handleRemoveTag}
          handleInputChange={this.handleInputChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
}

export default connect(mapStateToProps)(SearchOpportunitiesContainer);
