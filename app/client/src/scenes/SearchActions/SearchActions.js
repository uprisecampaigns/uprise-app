import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import uniqWith from 'lodash.uniqwith';
import FontIcon from 'material-ui/FontIcon';

import ResultsCount from 'components/ResultsCount';
import Link from 'components/Link';

import SearchPresentation from 'components/SearchPresentation';

import SearchActionResults from './components/SearchActionResults';
import SearchActionInputs from './components/SearchActionInputs';
import SearchActionSelections from './components/SearchActionSelections';

import {
  addSearchItem, sortBy,
} from 'actions/SearchActions';

import SearchActionsQuery from 'schemas/queries/SearchActionsQuery.graphql';

import s from 'styles/Search.scss';

const graphqlOptions = {
  props: ({ data }) => {
    const result = data.actions || {};
    const allItemsLoaded = result.actions && result.total === result.actions.length;

    return {
      actions: result.actions,
      items: result.actions,
      graphqlLoading: data.loading,
      cursor: result.cursor,
      total: result.total,
      isInfiniteLoading: false,
      allItemsLoaded,
      handleInfiniteLoad: () => {
        if (!allItemsLoaded) {
          return data.fetchMore({
            query: SearchActionsQuery,
            variables: {
              search: Object.assign({}, data.variables.search, {
                cursor: {
                  start_time: result.cursor.start_time,
                  id: result.cursor.id,
                  slug: result.cursor.slug,
                  campaign_name: result.cursor.campaign.title,
                },
              }),
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const previousActions = previousResult.actions.actions;
              const newActions = fetchMoreResult.actions.actions;

              const mergedActions = uniqWith([...previousActions, ...newActions], (a, b) => (a.id === b.id));

              return {
                actions: {
                  cursor: fetchMoreResult.actions.cursor,
                  total: fetchMoreResult.actions.total,
                  actions: mergedActions,
                  __typename: fetchMoreResult.__typename,
                },
              };
            },
          });
        }
      },
    };
  },
  options: ownProps => ({
    // Refresh every 5 min should be safe
    pollInterval: 60000 * 5,
    fetchPolicy: 'cache-and-network',
    ...ownProps,
  }),
};

const mapStateToProps = state => ({
  search: {
    keywords: state.actionsSearch.keywords,
    types: state.actionsSearch.types,
    activities: state.actionsSearch.activities,
    campaignNames: state.actionsSearch.campaignNames,
    issueAreas: state.actionsSearch.issueAreas,
    levels: state.actionsSearch.levels,
    dates: state.actionsSearch.dates,
    times: state.actionsSearch.times,
    geographies: state.actionsSearch.geographies,
    sortBy: state.actionsSearch.sortBy,
  },
  sortBy: state.actionsSearch.sortBy,
});

const ResultsCountWithData = compose(
  connect(mapStateToProps),
  graphql(SearchActionsQuery, graphqlOptions),
)(ResultsCount);

const SearchActionResultsWithData = compose(
  connect(mapStateToProps),
  graphql(SearchActionsQuery, graphqlOptions),
)(SearchActionResults);

const searchSortWrapper = connect(state => ({
  selected: state.actionsSearch.sortBy.name,
  descending: state.actionsSearch.sortBy.descending,
}));

const searchSortItems = [
  { label: 'Date', prop: 'date' },
  { label: 'Campaign Name', prop: 'campaignName' },
];

class SearchActions extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('action', collectionName, value));
  }

  sortSelect = (value) => {
    this.props.dispatch(sortBy('action', value));
  }

  render() {
    return (
      <div className={s.outerContainer}>

        <Link to="/search">
          <div className={[s.navHeader, s.searchNavHeader].join(' ')}>
            <FontIcon
              className={['material-icons', s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Search
          </div>
        </Link>

        <div className={s.titleContainer}>
          Search Actions
        </div>

        <SearchPresentation
          addSelectedItem={this.addSelectedItem}
          sortSelect={this.sortSelect}
          resultsCount={<ResultsCountWithData />}
          searchSortWrapper={searchSortWrapper}
          searchSortItems={searchSortItems}
          searchSelections={<SearchActionSelections />}
          searchInputs={<SearchActionInputs />}
          searchResults={<SearchActionResultsWithData />}
        />

      </div>
    );
  }
}

export default connect()(SearchActions);
