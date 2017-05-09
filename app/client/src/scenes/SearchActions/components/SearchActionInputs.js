
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import { 
  ActionsQuery, 
  CampaignTitlesQuery, 
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
  IssueAreasQuery,
} from 'schemas/queries';

import { 
  addSearchItem, setSearchDates, removeSearchItem
} from 'actions/SearchActions';

import SearchBar from 'components/SearchBar';
import GeographySearch from 'components/GeographySearch';
import TogglesList from 'components/TogglesList';
import DateTimeSearch from 'components/DateTimeSearch';

import s from 'styles/Search.scss';


const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      collection: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const ActivitiesTogglesList = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
  connect((state) => ({ selectedCollection: state.actionsSearch.activities }))
)(TogglesList);

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
  connect((state) => ({ selectedCollection: state.actionsSearch.types }))
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect((state) => ({ selectedCollection: state.actionsSearch.levels }))
)(TogglesList);

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
  connect((state) => ({ selectedCollection: state.actionsSearch.issueAreas }))
)(TogglesList);

const ConnectedDateTimeSearch = connect((state) => ({ selectedTimes: state.actionsSearch.times }))(DateTimeSearch);

const CampaignNameSearch = graphql(CampaignTitlesQuery, {
  props: ({ data }) => ({
    collectionToSearch: !data.loading && data.campaigns ? 
      data.campaigns.map( (campaign) => campaign.title) : []
  })
})(SearchBar);

class SearchActionInputs extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  handleToggle = (collectionName, on, value) => {
    if (on) {
      this.props.dispatch(addSearchItem('action', collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem('action', collectionName, value));
    }
  }

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('action', collectionName, value));
  }

  setDates = (dates) => {
    this.props.dispatch(setSearchDates('action', dates));
  }

  render() {

    const { 
      handleToggle,
      addSelectedItem,
      setDates,
    } = this;

    return (
      <List className={s.searchInputsList}>

        <ListItem 
          primaryText="Location"
          initiallyOpen={true}
          primaryTogglesNestedList={true}
          className={s.listItemContainer}
          nestedItems={[(
            <div key={0} className={[s.listItem, s.geographySearchContainer].join(' ')}>
              <GeographySearch 
                addItem={addSelectedItem}
              />
            </div>
          )]}
        />

        <Divider />

        <ActivitiesTogglesList 
          listTitle="Activities"
          collectionName="activities" 
          displayPropName="description"
          keyPropName="title"
          handleToggle={handleToggle}
          className={s.listItemContainer}
          containerClassName={s.listItem}
        />
        
        <Divider />

        <IssueAreasTogglesList 
          listTitle="Issue Areas"
          collectionName="issueAreas" 
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
          className={s.listItemContainer}
          containerClassName={s.listItem}
        />

        <Divider />

        <ListItem 
          primaryText="Date"
          initiallyOpen={false}
          primaryTogglesNestedList={true}
          className={s.listItemContainer}
          nestedItems={[(
            <div key={0} className={s.listItem}>
              <ConnectedDateTimeSearch 
                setDates={setDates}
                handleToggle={handleToggle}
              />
            </div>
          )]}
        />
        {/* Commenting out for demo
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
        */}

        <Divider />

        <TypesTogglesList 
          listTitle="Campaign Types"
          collectionName="types" 
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
          className={s.listItemContainer}
          containerClassName={s.listItem}
        />

        <Divider />

        <LevelsTogglesList 
          listTitle="Campaign Level"
          collectionName="levels" 
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
          className={s.listItemContainer}
          containerClassName={s.listItem}
        />
      </List>
    );
  }
};

export default connect()(SearchActionInputs);
