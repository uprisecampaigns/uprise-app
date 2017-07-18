
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TypesQuery from 'schemas/queries/TypesQuery.graphql';
import LevelsQuery from 'schemas/queries/LevelsQuery.graphql';
import IssueAreasQuery from 'schemas/queries/IssueAreasQuery.graphql';
import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import {
  addSearchItem, setSearchDates, removeSearchItem,
} from 'actions/SearchActions';

import ControlledListItem from 'components/ControlledListItem';
import SearchBar from 'components/SearchBar';
import GeographySearch from 'components/GeographySearch';
import TogglesList from 'components/TogglesList';
import DateTimeSearch from 'components/DateTimeSearch';

import s from 'styles/Search.scss';


const graphqlOptions = collection => ({
  props: ({ data }) => ({
    collection: !data.loading && data[collection] ? data[collection] : [],
  }),
});

const ActivitiesTogglesList = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
  connect(state => ({ selectedCollection: state.actionsSearch.activities })),
)(TogglesList);

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
  connect(state => ({ selectedCollection: state.actionsSearch.types })),
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect(state => ({ selectedCollection: state.actionsSearch.levels })),
)(TogglesList);

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
  connect(state => ({ selectedCollection: state.actionsSearch.issueAreas })),
)(TogglesList);

const ConnectedDateTimeSearch = connect(state => ({ selectedTimes: state.actionsSearch.times }))(DateTimeSearch);

class SearchActionInputs extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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

        <ControlledListItem
          primaryText="Location"
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

        <ControlledListItem
          primaryText="Date"
          className={s.listItemContainer}
          nestedItems={[(
            <div key={0} className={[s.listItem, s.dateSearchContainer].join(' ')}>
              <ConnectedDateTimeSearch
                setDates={setDates}
                handleToggle={handleToggle}
              />
            </div>
          )]}
        />

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
}

export default connect()(SearchActionInputs);
