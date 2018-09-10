import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import uniqWith from 'lodash.uniqwith';
import moment from 'moment';

import SearchPresentation from 'components/SearchPresentation';

import { addSearchItem } from 'actions/SearchActions';

import SearchActionsQuery from 'schemas/queries/SearchActionsQuery.graphql';

import s from 'styles/Search.scss';

import SearchActionResults from './components/SearchActionResults';
import SearchActionInputs from './components/SearchActionInputs';
import SearchActionSelections from './components/SearchActionSelections';

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
        if (!allItemsLoaded && result.cursor) {
          return data.fetchMore({
            query: SearchActionsQuery,
            variables: {
              search: {
                ...data.variables.search,
                cursor: {
                  start_time: result.cursor.start_time,
                  created_at: result.cursor.created_at,
                  id: result.cursor.id,
                  slug: result.cursor.slug,
                  campaign_name: result.cursor.campaign.title,
                },
              },
            },
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
              const previousActions = previousResult.actions.actions;
              const newActions = fetchMoreResult.actions.actions;

              const mergedActions = uniqWith([...previousActions, ...newActions], (a, b) => a.id === b.id);

              return {
                actions: {
                  cursor: fetchMoreResult.actions.cursor,
                  total: fetchMoreResult.actions.total,
                  actions: mergedActions,
                  // eslint-disable-next-line no-underscore-dangle
                  __typename: fetchMoreResult.__typename,
                },
              };
            },
          });
        }
        return undefined;
      },
    };
  },
  options: (ownProps) => ({
    // Refresh every 5 min should be safe
    pollInterval: 60000 * 5,
    fetchPolicy: 'cache-and-network',
    variables: {
      search: ownProps.search,
      sortBy: ownProps.sortBy,
    },
  }),
};

const mapStateToProps = (state, ownProps) => {
  const aSearch = state.actionsSearch;

  let searchDates;

  const hasDateSearch = Object.keys(aSearch.dates).length > 0;

  // TODO: this will reset the infinite scroll if the time rolls over to the next hour
  searchDates = hasDateSearch
    ? aSearch.dates
    : {
        startDate: moment()
          .startOf('hour')
          .format(),
      };

  if (aSearch.roles) {
    searchDates.ongoing = true;
  } else {
    searchDates.ongoing = false;
  }

  return {
    search: {
      keywords: aSearch.keywords,
      tags: aSearch.tags,
      activities: aSearch.activities,
      campaignNames: aSearch.campaignNames,
      dates: searchDates,
      times: aSearch.times,
      geographies: aSearch.geographies,
      sortBy: aSearch.sortBy,
      showEvents: aSearch.events,
    },
    sortBy: aSearch.sortBy,
  };
};

const SearchActionResultsWithData = compose(
  connect(mapStateToProps),
  graphql(SearchActionsQuery, graphqlOptions),
)(SearchActionResults);

class SearchActions extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    showRoles: PropTypes.bool.isRequired,
  };

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('action', collectionName, value));
  };

  render() {
    return (
      <div className={s.outerContainer}>
        <SearchPresentation
          addSelectedItem={this.addSelectedItem}
          searchSelections={<SearchActionSelections />}
          searchInputs={(allOpen) => <SearchActionInputs allOpen={allOpen} showOngoing={this.props.showRoles} />}
          searchResults={<SearchActionResultsWithData showOngoing={this.props.showRoles} />}
        />
      </div>
    );
  }
}

export default connect()(SearchActions);
