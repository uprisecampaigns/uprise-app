import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';

import SearchNav from 'components/SearchNav';
import SearchBar from 'components/SearchBar';
import SearchSort from 'components/SearchSort';
import ResultsCount from 'components/ResultsCount';

import SearchActionResults from './components/SearchActionResults';
import SearchActionInputs from './components/SearchActionInputs';
import SearchActionSelections from './components/SearchActionSelections';

import { 
  addSearchItem, sortBy
} from 'actions/SearchActions';

import { 
  ActionsQuery, 
} from 'schemas/queries';

import s from 'styles/Search.scss';

const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      [collection]: data[collection],
      items: data[collection],
      graphqlLoading: data.loading
    }),
    options: (ownProps) => ({
      fetchPolicy: 'cache-and-network',
      pollInterval: 30000,
      ...ownProps,
    })
  };
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
  },
  sortBy: state.actionsSearch.sortBy
});

const ResultsCountWithData = compose(
  connect(mapStateToProps),
  graphql(ActionsQuery, graphqlOptions('actions')),
)(ResultsCount);

const SearchActionResultsWithData = compose(
  connect(mapStateToProps),
  graphql(ActionsQuery, graphqlOptions('actions')),
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
    this.props.dispatch(addSearchItem('action', collectionName, value));
  }

  sortSelect = (value) => {
    this.handleCloseSort();

    this.props.dispatch(sortBy('action', value));
  }

  handleOpenSort = (event) => {
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
    this.setState(Object.assign({},
      this.state,
      { sortOpen: false }
    ));
  }

  handleOpenFilter = (event) => {
    event.preventDefault();

    this.setState(Object.assign({},
      this.state,
      { 
        filterOpen: true,
        filterPopoverAnchorEl: event.currentTarget
      }
    ));
  }

  handleCloseFilter = (event) => {
    this.setState(Object.assign({},
      this.state,
      { filterOpen: false }
    ));
  }

  render() {

    return (
      <SearchNav selected="search-actions">
        <div className={s.outerContainer}>

          <div className={s.titleContainer}>
            Search Actions
          </div>

          <div className={s.searchBarContainer}>
            <SearchBar
              collectionName="keywords"
              inputLabel="keyword search"
              addItem={this.addSelectedItem}
            />
          </div>

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
                onRequestClose={this.handleCloseSort}
                anchorEl={this.state.sortPopoverAnchorEl}
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

              <Popover
                open={this.state.filterOpen}
                onRequestClose={this.handleCloseFilter}
                anchorEl={this.state.filterPopoverAnchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                className={s.popover}
              >
                <SearchActionInputs 
                />
              </Popover>
            </div>
          </div>

          <div className={s.selectionsContainer}>
            <SearchActionSelections 
            />
          </div>

          <div className={s.resultsContainer}>
            <SearchActionResultsWithData
            />
          </div>

        </div>
      </SearchNav>
    );
  }
}

export default connect()(SearchActions);
