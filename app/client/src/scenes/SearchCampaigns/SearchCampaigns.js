import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import SearchBar from 'components/SearchBar';
import SearchSort from 'components/SearchSort';
import ResultsCount from 'components/ResultsCount';
import Link from 'components/Link';

import SearchCampaignResults from './components/SearchCampaignResults';
import SearchCampaignInputs from './components/SearchCampaignInputs';
import SearchCampaignSelections from './components/SearchCampaignSelections';

import { 
  addSearchItem, sortBy
} from 'actions/SearchActions';

import { 
  CampaignsQuery, 
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
      ...ownProps
    })
  };
};

const mapStateToProps = (state) => ({
  // TODO: something fancy to just pass along campaignsSearch?
  search: {
    keywords: state.campaignsSearch.keywords,
    types: state.campaignsSearch.types,
    issueAreas: state.campaignsSearch.issueAreas,
    levels: state.campaignsSearch.levels,
    geographies: state.campaignsSearch.geographies,
  },
  sortBy: state.campaignsSearch.sortBy
});

const ResultsCountWithData = compose(
  connect(mapStateToProps),
  graphql(CampaignsQuery, graphqlOptions('campaigns')),
)(ResultsCount);

const SearchCampaignResultsWithData = compose(
  connect(mapStateToProps),
  graphql(CampaignsQuery, graphqlOptions('campaigns')),
)(SearchCampaignResults);

const ConnectedSearchSort = connect( (state) => ({
  selected: state.campaignsSearch.sortBy.name,
  descending: state.campaignsSearch.sortBy.descending,
}))(SearchSort);
  

class SearchCampaigns extends Component {
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
    this.props.dispatch(addSearchItem('campaign', collectionName, value));
  }

  sortSelect = (value) => {
    this.handleCloseSort();

    this.props.dispatch(sortBy('campaign', value));
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
    this.setState(Object.assign({},
      this.state,
      { sortOpen: false }
    ));
  }

  handleOpenFilter = (event) => {
    this.searchBarInputElement.blur();
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
          Search Campaigns
        </div>

        <div className={s.searchBarContainer}>
          <SearchBar
            collectionName="keywords"
            inputLabel="keyword search"
            addItem={this.addSelectedItem}
            inputRef={el => this.searchBarInputElement = el}
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
                  { label: 'Campaign Name', prop: 'title' },
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
              <SearchCampaignInputs 
              />
            </Popover>
          </div>
        </div>

        <div className={s.selectionsContainer}>
          <SearchCampaignSelections 
          />
        </div>

        <div className={s.resultsContainer}>
          <SearchCampaignResultsWithData
          />
        </div>

      </div>
    );
  }
}

export default connect()(SearchCampaigns);
