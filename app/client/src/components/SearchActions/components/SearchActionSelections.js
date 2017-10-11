
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import SelectedItemsContainer from 'components/SelectedItemsContainer';

import {
  removeSearchItem, unsetSearchDates,
} from 'actions/SearchActions';

import s from 'styles/Search.scss';

const SelectedTagsContainer = connect(state => ({ items: state.actionsSearch.tags }))(SelectedItemsContainer);

const SelectedKeywordsContainer = connect(state => ({ items: state.actionsSearch.keywords }))(SelectedItemsContainer);

const SelectedActivitiesContainer = connect(state => ({ items: state.actionsSearch.activities }))(SelectedItemsContainer);

const SelectedTimesContainer = connect(state => ({ items: state.actionsSearch.times }))(SelectedItemsContainer);

const SelectedDatesContainer = connect((state) => {
  const dates = state.actionsSearch.dates;

  const items = [];

  if (dates.ongoing || dates.onDate || (dates.startDate && dates.endDate)) {
    items.push(dates);
  }

  return { items };
})(SelectedItemsContainer);

const SelectedGeographiesContainer = connect(state => ({ items: state.actionsSearch.geographies }))(SelectedItemsContainer);

const renderSelectedDateLabel = (dates) => {
  if (dates.ongoing) {
    return 'Ongoing';
  } else if (dates.onDate) {
    return moment(dates.onDate).format('M/D/YYYY');
  }
  return `${moment(dates.startDate).format('M/D/YYYY')} - ${moment(dates.endDate).format('M/D/YYYY')}`;
};

const renderSelectedGeographyLabel = geography => ((typeof geography.virtual === 'boolean' && geography.virtual) ?
  'Virtual' :
  `Within ${geography.distance} miles of ${geography.zipcode}`);

class SearchActionSelections extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  removeSelectedItem = (collectionName, value) => {
    this.props.dispatch(removeSearchItem('action', collectionName, value));
  }

  unsetDates = () => {
    this.props.dispatch(unsetSearchDates('action'));
  }

  render() {
    const {
      removeSelectedItem,
      unsetDates,
    } = this;

    return (
      <div className={s.selectedInputs}>
        <SelectedTagsContainer
          collectionName="tags"
          removeItem={removeSelectedItem}
        />
        <SelectedKeywordsContainer
          collectionName="keywords"
          removeItem={removeSelectedItem}
        />
        <SelectedActivitiesContainer
          collectionName="activities"
          removeItem={removeSelectedItem}
        />
        <SelectedDatesContainer
          collectionName="dates"
          removeItem={unsetDates}
          renderLabel={renderSelectedDateLabel}
        />
        <SelectedTimesContainer
          collectionName="times"
          removeItem={removeSelectedItem}
        />
        <SelectedGeographiesContainer
          collectionName="geographies"
          removeItem={removeSelectedItem}
          renderLabel={renderSelectedGeographyLabel}
        />
      </div>
    );
  }
}

export default connect()(SearchActionSelections);
