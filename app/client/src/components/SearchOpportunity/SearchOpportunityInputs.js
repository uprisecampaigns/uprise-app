
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';

import { 
  OpportunitiesQuery, 
  CampaignsQuery, 
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
  IssueAreasQuery,
} from 'schemas/queries';

import { 
  addSearchItem, setSearchDates, removeSearchItem
} from 'actions/SearchOpportunitiesActions';

import SearchBar from 'components/SearchBar';
import GeographySearch from 'components/GeographySearch';
import TogglesList from 'components/TogglesList';
import DateTimeSearch from 'components/DateTimeSearch';

import s from './SearchOpportunity.scss';


const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      collection: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const ActivitiesTogglesList = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.activities }))
)(TogglesList);

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.types }))
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.levels }))
)(TogglesList);

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.issueAreas }))
)(TogglesList);

const ConnectedDateTimeSearch = connect((state) => ({ selectedTimes: state.opportunitiesSearch.times }))(DateTimeSearch);

const CampaignNameSearch = graphql(CampaignsQuery, {
  props: ({ data }) => ({
    collectionToSearch: !data.loading && data.campaigns ? 
      data.campaigns.map( (campaign) => campaign.title) : []
  })
})(SearchBar);

class SearchOpportunityInputs extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  handleToggle = (collectionName, on, value) => {
    if (on) {
      this.props.dispatch(addSearchItem(collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem(collectionName, value));
    }
  }

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem(collectionName, value));
  }

  setDates = (dates) => {
    this.props.dispatch(setSearchDates(dates));
  }

  render() {

    const { 
      handleToggle,
      addSelectedItem,
      setDates,
    } = this;

    return (
      <List>
        <ListItem 
          primaryText="Location"
          initiallyOpen={true}
          primaryTogglesNestedList={true}
          nestedItems={[(
            <div key={0} className={[s.listItem, s.geographySearchContainer].join(' ')}>
              <GeographySearch 
                addItem={addSelectedItem}
              />
            </div>
          )]}
        />
        <ActivitiesTogglesList 
          listTitle="Activities"
          collectionName="activities" 
          displayPropName="description"
          keyPropName="title"
          handleToggle={handleToggle}
        />
        
        <IssueAreasTogglesList 
          listTitle="Issue Areas"
          collectionName="issueAreas" 
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
        />
        <ListItem 
          primaryText="Date"
          initiallyOpen={false}
          primaryTogglesNestedList={true}
          nestedItems={[(
            <div key={0} className={s.listItem}>
              <ConnectedDateTimeSearch 
                setDates={setDates}
                handleToggle={handleToggle}
              />
            </div>
          )]}
        />
        <ListItem 
          primaryText="Campaign Name"
          initiallyOpen={false}
          primaryTogglesNestedList={true}
          nestedItems={[(
            <div key={0} className={[s.listItem, s.searchBar].join(' ')}>
              <CampaignNameSearch
                collectionName="campaignNames"
                inputLabel="campaign name"
                addItem={addSelectedItem}
              />
            </div>
          )]}
        />
        <TypesTogglesList 
          listTitle="Campaign Types"
          collectionName="types" 
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
        />
        <LevelsTogglesList 
          listTitle="Campaign Level"
          collectionName="levels" 
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
        />
      </List>
    );
  }
};

export default connect()(SearchOpportunityInputs);
