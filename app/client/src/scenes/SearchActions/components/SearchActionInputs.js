
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
import DateTimeSearch from 'components/DateTimeSearch';

import togglesList from 'lib/togglesList';

import s from 'styles/Search.scss';


const ConnectedDateTimeSearch = connect(state => ({ selectedTimes: state.actionsSearch.times }))(DateTimeSearch);

class SearchActionInputs extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedCollection: PropTypes.string.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
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

    const activitiesTogglesList = togglesList({
      collection: this.props.activities,
      selectedCollection: this.props.selectedCollection,
      collectionName: 'activities',
      keyPropName: 'title',
      displayPropName: 'description',
      containerClassName: s.listItem,
      handleToggle,
    });

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

        <div className={s.listItemContainer}>
          <ControlledListItem
            primaryText="Activities"
            nestedItems={activitiesTogglesList}
          />
        </div>

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

export default compose(
  graphql(ActivitiesQuery, {
    props: ({ data }) => ({
      activities: !data.loading && data.activities ? data.activities : [],
    }),
  }),
  connect(state => ({ selectedCollection: state.actionsSearch.activities })),
)(SearchActionInputs);
