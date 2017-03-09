
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';

import { 
  CampaignsQuery, 
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

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
  connect((state) => ({ selectedCollection: state.campaignsSearch.types }))
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect((state) => ({ selectedCollection: state.campaignsSearch.levels }))
)(TogglesList);

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
  connect((state) => ({ selectedCollection: state.campaignsSearch.issueAreas }))
)(TogglesList);

class SearchCampaignInputs extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  handleToggle = (collectionName, on, value) => {
    if (on) {
      this.props.dispatch(addSearchItem('campaign', collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem('campaign', collectionName, value));
    }
  }

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('campaign', collectionName, value));
  }

  setDates = (dates) => {
    this.props.dispatch(setSearchDates('campaign', dates));
  }

  render() {

    const { 
      handleToggle,
      addSelectedItem,
      setDates,
    } = this;

    return (
      <List>
        
        <IssueAreasTogglesList 
          listTitle="Issue Areas"
          collectionName="issueAreas" 
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
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

export default connect()(SearchCampaignInputs);