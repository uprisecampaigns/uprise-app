import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';

import SearchNav from 'components/SearchNav';
import SearchBar from 'components/SearchBar';
import SearchSort from 'components/SearchSort';
import ResultsCount from 'components/ResultsCount';

import SearchOpportunityResults from './components/SearchOpportunityResults';
import SearchOpportunityInputs from './components/SearchOpportunityInputs';
import SearchOpportunitySelections from './components/SearchOpportunitySelections';

import { 
  addSearchItem, sortBy
} from 'actions/SearchActions';

import { 
  OpportunitiesQuery, 
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
      pollInterval: 30000,
      ...ownProps,
    })
  };
};

const mapStateToProps = (state) => ({
  search: {
    keywords: state.opportunitiesSearch.keywords,
    types: state.opportunitiesSearch.types,
    activities: state.opportunitiesSearch.activities,
    campaignNames: state.opportunitiesSearch.campaignNames,
    issueAreas: state.opportunitiesSearch.issueAreas,
    levels: state.opportunitiesSearch.levels,
    dates: state.opportunitiesSearch.dates,
    times: state.opportunitiesSearch.times,
    geographies: state.opportunitiesSearch.geographies,
  },
  sortBy: state.opportunitiesSearch.sortBy
});

const ResultsCountWithData = compose(
  connect(mapStateToProps),
  graphql(OpportunitiesQuery, graphqlOptions('opportunities')),
)(ResultsCount);

const SearchOpportunityResultsWithData = compose(
  connect(mapStateToProps),
  graphql(OpportunitiesQuery, graphqlOptions('opportunities')),
)(SearchOpportunityResults);

const ConnectedSearchSort = connect( (state) => ({
  selected: state.opportunitiesSearch.sortBy.name,
  descending: state.opportunitiesSearch.sortBy.descending,
}))(SearchSort);
  

class SearchOpportunities extends Component {
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
    this.props.dispatch(addSearchItem('opportunity', collectionName, value));
  }

  sortSelect = (value) => {
    this.handleCloseSort();

    this.props.dispatch(sortBy('opportunity', value));
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
      <SearchNav selected="search-opportunities">
        <div className={s.outerContainer}>

          <div className={s.titleContainer}>
            Search Opportunities
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
                <SearchOpportunityInputs 
                />
              </Popover>
            </div>
          </div>

          <div className={s.selectionsContainer}>
            <SearchOpportunitySelections 
            />
          </div>

          <div className={s.resultsContainer}>
            <SearchOpportunityResultsWithData
            />
          </div>

        </div>
      </SearchNav>
    );
  }
}

export default connect()(SearchOpportunities);
