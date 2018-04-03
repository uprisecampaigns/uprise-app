import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import SearchPresentation from 'components/SearchPresentation';

import {
  addSearchItem,
} from 'actions/SearchActions';

import CampaignsQuery from 'schemas/queries/CampaignsQuery.graphql';

import s from 'styles/Search.scss';

import SearchCampaignResults from './components/SearchCampaignResults';
import SearchCampaignInputs from './components/SearchCampaignInputs';
import SearchCampaignSelections from './components/SearchCampaignSelections';


const graphqlOptions = collection => ({
  props: ({ data }) => ({
    [collection]: data[collection],
    items: data[collection],
    graphqlLoading: data.loading,
  }),
  options: ownProps => ({
    // Refresh every 5 min should be safe
    pollInterval: 60000 * 5,
    fetchPolicy: 'cache-and-network',
    ...ownProps,
  }),
});

const mapStateToProps = state => ({
  // TODO: something fancy to just pass along campaignsSearch?
  search: {
    keywords: state.campaignsSearch.keywords,
    tags: state.campaignsSearch.tags,
    geographies: state.campaignsSearch.geographies,
  },
  sortBy: state.campaignsSearch.sortBy,
});

const SearchCampaignResultsWithData = compose(
  connect(mapStateToProps),
  graphql(CampaignsQuery, graphqlOptions('campaigns')),
)(SearchCampaignResults);


class SearchCampaigns extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };


  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('campaign', collectionName, value));
  }

  render() {
    return (
      <div className={s.outerContainer}>

        <div className={s.searchHeaderOuterContainer}>
          <div className={s.searchHeaderTitle}>
            Follow a Campaign
          </div>
          <div className={s.searchSubHeader}>
            23 Campaigns
          </div>
          <div className={s.searchSubHeader}>
            Learn more >
          </div>
        </div>

        <SearchPresentation
          addSelectedItem={this.addSelectedItem}
          searchSelections={<SearchCampaignSelections />}
          searchInputs={allOpen => <SearchCampaignInputs allOpen={allOpen} />}
          searchResults={<SearchCampaignResultsWithData />}
        />

      </div>
    );
  }
}

export default connect()(SearchCampaigns);
