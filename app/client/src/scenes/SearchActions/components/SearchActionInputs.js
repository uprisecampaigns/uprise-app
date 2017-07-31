
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import {
  addSearchItem, setSearchDates, removeSearchItem,
} from 'actions/SearchActions';

import ControlledListItem from 'components/ControlledListItem';
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

const ConnectedDateTimeSearch = connect(state => ({ selectedTimes: state.actionsSearch.times }))(DateTimeSearch);

class SearchActionInputs extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  setDates = (dates) => {
    this.props.dispatch(setSearchDates('action', dates));
  }

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
      </List>
    );
  }
}

export default connect()(SearchActionInputs);
