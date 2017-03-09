import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';

import SearchCampaignResults from 'components/SearchCampaign/SearchCampaignResults';
import SearchCampaignInputs from 'components/SearchCampaign/SearchCampaignInputs';
import SearchCampaignSelections from 'components/SearchCampaign/SearchCampaignSelections';
import SearchBar from 'components/SearchBar';
import SearchSort from 'components/SearchSort';
import ResultsCount from 'components/ResultsCount';

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
      pollInterval: 20000,
      ...ownProps
    })
  };
};

const mapStateToProps = (state) => ({
  search: {
    keywords: state.campaignsSearch.keywords,
    types: state.campaignsSearch.types,
    issueAreas: state.campaignsSearch.issueAreas,
    levels: state.campaignsSearch.levels,
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
  

class SearchCampaignContainer extends Component {
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
    this.props.dispatch(addSearchItem('campaign', collectionName, value));
  }

  sortSelect = (value) => {
    this.handleCloseSort();

    this.props.dispatch(sortBy('campaign', value));
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
      <div className={s.outerContainer}>

        <div className={s.titleContainer}>
          Search Campaigns
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

export default connect()(SearchCampaignContainer);
