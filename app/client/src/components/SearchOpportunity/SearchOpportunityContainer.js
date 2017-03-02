import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';

import SearchOpportunityResults from 'components/SearchOpportunity/SearchOpportunityResults';
import SearchOpportunityInputs from 'components/SearchOpportunity/SearchOpportunityInputs';
import SearchOpportunitySelections from 'components/SearchOpportunity/SearchOpportunitySelections';
import SearchBar from 'components/SearchBar';

import { 
  addSearchItem, setSearchDates, removeSearchItem
} from 'actions/SearchOpportunitiesActions';

import { 
  OpportunitiesQuery, 
} from 'schemas/queries';

import s from './SearchOpportunity.scss';


class SearchOpportunityContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filtersOpen: false,
      filtersPopoverAnchorEl: null
    }
  }

  static propTypes = {
    opportunities: PropTypes.array.isRequired
  };

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem(collectionName, value));
  }

  handleOpenFilters = (event) => {
    event.preventDefault();

    this.setState(Object.assign({},
      this.state,
      { 
        filtersOpen: true,
        filtersPopoverAnchorEl: event.currentTarget
      }
    ));
  }

  handleCloseFilters = (event) => {
    this.setState(Object.assign({},
      this.state,
      { filtersOpen: false }
    ));
  }

  render() {
    const resultsCount = this.props.opportunities.length;

    return (
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
            <span>
              {resultsCount} results
            </span>
          </div>

          <div className={s.sortContainer}>
            <span>Sort by</span>
            <IconButton 
              iconClassName='material-icons'
            >sort</IconButton>
          </div>

          <div 
            className={s.filterContainer}
            onTouchTap={this.handleOpenFilters}
          >
            <span>Filter</span>
            <IconButton 
              iconClassName='material-icons'
            >filter_list</IconButton>

            <Popover
              open={this.state.filtersOpen}
              onRequestClose={this.handleCloseFilters}
              anchorEl={this.state.filtersPopoverAnchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
              className={s.filterPopover}
            >
              <SearchOpportunityInputs 
              />
            </Popover>
          </div>
        </div>

        <div
          className={s.leftContainer}
        >
        </div>

        <div
          className={s.rightContainer}
        >
          <SearchOpportunitySelections 
          />

          <SearchOpportunityResults
            opportunities={this.props.opportunities}
          />
        </div>

      </div>
    );
  }
}

const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      [collection]: !data.loading && data[collection] ? data[collection] : []
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
  }
});

export default compose(
  connect(mapStateToProps),
  graphql(OpportunitiesQuery, graphqlOptions('opportunities')),
)(SearchOpportunityContainer);
