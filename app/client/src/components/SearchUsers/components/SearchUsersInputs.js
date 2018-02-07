import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import {
  addSearchItem, removeSearchItem,
} from 'actions/SearchActions';

import ControlledListItem from 'components/ControlledListItem';
import GeographySearch from 'components/GeographySearch';

import togglesList from 'lib/togglesList';

import s from 'styles/Search.scss';


class SearchUsersInputs extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedCollection: PropTypes.arrayOf(PropTypes.string).isRequired,
    allOpen: PropTypes.bool,
  }

  static defaultProps = {
    allOpen: false,
  }

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('user', collectionName, value));
  }

  handleToggle = (collectionName, on, value) => {
    if (on) {
      this.props.dispatch(addSearchItem('user', collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem('user', collectionName, value));
    }
  }

  render() {
    const {
      addSelectedItem,
      handleToggle,
    } = this;

    const { allOpen } = this.props;

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
          initiallyOpen={allOpen}
          nestedItems={[(
            <div key={0} className={[s.listItem, s.geographySearchContainer].join(' ')}>
              <GeographySearch
                addItem={addSelectedItem}
                showVirtual={false}
              />
            </div>
          )]}
        />

        <ControlledListItem
          primaryText="Activities"
          initiallyOpen={allOpen}
          nestedItems={activitiesTogglesList}
          className={s.listItemContainer}
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
  connect(state => ({ selectedCollection: state.usersSearch.activities })),
)(SearchUsersInputs);
