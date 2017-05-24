import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import uniqWith from 'lodash.uniqwith';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import SearchBar from 'components/SearchBar';
import SearchSort from 'components/SearchSort';
import ResultsCount from 'components/ResultsCount';
import Link from 'components/Link';

import SearchActionResults from './components/SearchActionResults';
import SearchActionInputs from './components/SearchActionInputs';
import SearchActionSelections from './components/SearchActionSelections';

import {
  addSearchItem, sortBy
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
                  campaign_name: result.cursor.campaign.title
                }
              })
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
                  __typename: fetchMoreResult.__typename
                }
              };
            },
          });
        }
      }
    }
  },
  options: (ownProps) => ({
    // Refresh every 5 min should be safe
    pollInterval: 60000 * 5,
    ...ownProps,
  })
};

const mapStateToProps = (state) => ({
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
    sortBy: state.actionsSearch.sortBy
  },
  sortBy: state.actionsSearch.sortBy
});

const ResultsCountWithData = compose(
  connect(mapStateToProps),
  graphql(SearchActionsQuery, graphqlOptions),
)(ResultsCount);

const SearchActionResultsWithData = compose(
  connect(mapStateToProps),
  graphql(SearchActionsQuery, graphqlOptions),
)(SearchActionResults);

const ConnectedSearchSort = connect( (state) => ({
  selected: state.actionsSearch.sortBy.name,
  descending: state.actionsSearch.sortBy.descending,
}))(SearchSort);


class SearchActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterOpen: false,
      filterPopoverAnchorEl: null,
      sortOpen: false,
      sortPopoverAnchorEl: null,
    }
  }

  static propTypes = {
  };

  addSelectedItem = (collectionName, value) => {
    this.searchBarInputElement.blur();
    this.props.dispatch(addSearchItem('action', collectionName, value));
  }

  sortSelect = (value, event) => {
    this.handleCloseSort(event);

    this.props.dispatch(sortBy('action', value));
  }

  handleOpenSort = (event) => {
    this.searchBarInputElement.blur();
    event.preventDefault();

    this.setState(Object.assign({},
      this.state,
      {
        sortOpen: true,
        sortPopoverAnchorEl: event.currentTarget
      }
    ));
  }

  handleCloseSort = (event) => {
    typeof event.preventDefault === 'function' && event.preventDefault();
    this.setState(Object.assign({},
      this.state,
      { sortOpen: false }
    ));
  }

  handleOpenFilter = (event) => {
    this.searchBarInputElement.blur();
    event.preventDefault();

    this.setState((prevState) => (Object.assign({},
      prevState,
      {
        filterOpen: !prevState.filterOpen,
        filterPopoverAnchorEl: event.currentTarget
      }
    )));
  }

  handleCloseFilter = (event) => {
    typeof event.preventDefault === 'function' && event.preventDefault();
    this.setState((prevState) => (Object.assign({},
      prevState,
      { filterOpen: false }
    )));
  }

  render() {

    return (
      <div className={s.outerContainer}>

        <Link to="/search">
          <div className={[s.navHeader, s.searchNavHeader].join(' ')}>
            <FontIcon
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Search
          </div>
        </Link>

        <div className={s.titleContainer}>
          Search Actions
        </div>

        <div className={s.mobileSearchBarContainer}>
          <div className={s.searchBarContainer}>
            <SearchBar
              collectionName="keywords"
              inputLabel="keyword search"
              addItem={this.addSelectedItem}
              inputRef={el => this.searchBarInputElement = el}
            />
          </div>
        </div>
        <div className={s.filterResultsOuterContainer}>

          <div className={s.desktopSearchOptionsContainer}>
            <div className={s.desktopFilterHeader}>Narrow Your Search</div>

            <div className={s.searchBarContainer}>
              <SearchBar
                collectionName="keywords"
                inputLabel="keyword search"
                addItem={this.addSelectedItem}
                inputRef={el => this.searchBarInputElement = el}
              />
            </div>

            <SearchActionInputs
            />

          </div>

          <div>
            <div className={s.countSortFilterContainer}>

              <div className={s.countContainer}>
                <ResultsCountWithData/>
              </div>

              <div
                onTouchTap={this.handleOpenSort}
                className={s.sortContainer}
              >
                <span>Sort by</span>
                <IconButton
                  iconClassName='material-icons'
                >sort</IconButton>

                <Popover
                  open={this.state.sortOpen}
                  anchorEl={this.state.sortPopoverAnchorEl}
                  onRequestClose={this.handleCloseSort}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  className={s.popover}
                >
                  <ConnectedSearchSort
                    onSelect={this.sortSelect}
                    items={[
                      { label: 'Date', prop: 'date' },
                      { label: 'Campaign Name', prop: 'campaignName' },
                    ]}
                  />
                </Popover>
              </div>

              <div
                className={s.filterContainer}
                onTouchTap={this.handleOpenFilter}
              >
                <span>Filter</span>
                <IconButton
                  iconClassName='material-icons'
                >filter_list</IconButton>

    { /*
                <Popover
                  open={this.state.filterOpen}
                  autoCloseWhenOffScreen={false}
                  anchorEl={this.state.filterPopoverAnchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  className={s.popover}
                >
                  <div>
                    <div className={s.sortFilterHeaderContainer}>
                      <span>Filter</span>

                      <span
                        className={s.closePopoverContainer}
                        onClick={this.handleCloseFilter}
                      >
                        <IconButton
                          iconClassName='material-icons'
                        >close</IconButton>
                      </span>
                    </div>

                    <SearchActionInputs
                    />

                  </div>
                </Popover>
    */}
              </div>
            </div>

            <div className={s.selectionsContainer}>
              <SearchActionSelections
              />
            </div>

            { this.state.filterOpen && (
              <div className={s.filterOptionsContainer}>
                <div>

                  <Divider />

                  <div className={s.filterHeaderContainer}>
                    <RaisedButton
                      className={s.primaryButton}
                      onTouchTap={this.handleCloseFilter}
                      primary={true}
                      label="Done"
                    />

                    <span className={s.filterHeader}>Filter</span>

                    <span
                      className={s.closeIcon}
                      onTouchTap={this.handleCloseFilter}
                    >
                      <IconButton
                        iconClassName='material-icons'
                      >close</IconButton>
                    </span>
                  </div>

                  <Divider />

                  <SearchActionInputs
                  />

                </div>
                <Divider />
              </div>
            )}

            { !this.state.filterOpen && (
              <div className={s.resultsContainer}>
                <SearchActionResultsWithData
                />
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }
}

export default connect()(SearchActions);
