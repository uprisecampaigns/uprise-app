import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import ResultsCount from 'components/ResultsCount';
import Link from 'components/Link';
import SearchPresentation from 'components/SearchPresentation';

import SearchCampaignResults from './components/SearchCampaignResults';
import SearchCampaignInputs from './components/SearchCampaignInputs';
import SearchCampaignSelections from './components/SearchCampaignSelections';

import { 
  addSearchItem, sortBy
} from 'actions/SearchActions';

import CampaignsQuery from 'schemas/queries/CampaignsQuery.graphql';

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

const searchSortWrapper = connect( (state) => ({
  selected: state.campaignsSearch.sortBy.name,
  descending: state.campaignsSearch.sortBy.descending,
}));

const searchSortItems = [
  { label: 'Campaign Name', prop: 'title' },
];
  

class SearchCampaigns extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('campaign', collectionName, value));
  }

  sortSelect = (value) => {
    this.props.dispatch(sortBy('campaign', value));
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

        <SearchPresentation
          addSelectedItem={this.addSelectedItem}
          sortSelect={this.sortSelect}
          resultsCount={<ResultsCountWithData/>}
          searchSortWrapper={searchSortWrapper}
          searchSortItems={searchSortItems}
          searchSelections={<SearchCampaignSelections/>}
          searchInputs={<SearchCampaignInputs/>}
          searchResults={<SearchCampaignResultsWithData/>}
        />

      </div>
    );
  }
}

export default connect()(SearchCampaigns);
