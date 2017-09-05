
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import SelectedItemsContainer from 'components/SelectedItemsContainer';

import {
  removeSearchItem, unsetSearchDates,
} from 'actions/SearchActions';

import s from 'styles/Search.scss';


const SelectedKeywordsContainer = connect(state => ({ items: state.campaignsSearch.keywords }))(SelectedItemsContainer);

const SelectedActivitiesContainer = connect(state => ({ items: state.campaignsSearch.activities }))(SelectedItemsContainer);

const SelectedCampaignNamesContainer = connect(state => ({ items: state.campaignsSearch.campaignNames }))(SelectedItemsContainer);

const SelectedTimesContainer = connect(state => ({ items: state.campaignsSearch.times }))(SelectedItemsContainer);

const SelectedDatesContainer = connect((state) => {
  const dates = state.campaignsSearch.dates;

  const items = [];

  if (dates.onDate || (dates.startDate && dates.endDate)) {
    items.push(dates);
  }

  return { items };
})(SelectedItemsContainer);

const SelectedGeographiesContainer = connect(state => ({ items: state.campaignsSearch.geographies }))(SelectedItemsContainer);

const renderSelectedDateLabel = (dates) => {
  if (dates.onDate) {
    return moment(dates.onDate).format('M/D/YYYY');
  }
  return `${moment(dates.startDate).format('M/D/YYYY')} - ${moment(dates.endDate).format('M/D/YYYY')}`;
};

const renderSelectedGeographyLabel = geography => `Active in: ${geography.zipcode}`;

class SearchCampaignSelections extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  removeSelectedItem = (collectionName, value) => {
    this.props.dispatch(removeSearchItem('campaign', collectionName, value));
  }

  unsetDates = () => {
    this.props.dispatch(unsetSearchDates('campaign'));
  }

  render() {
    const {
      removeSelectedItem,
      unsetDates,
    } = this;

    return (
      <div className={s.selectedInputs}>
        <SelectedKeywordsContainer
          collectionName="keywords"
          removeItem={removeSelectedItem}
        />
        <SelectedActivitiesContainer
          collectionName="activities"
          removeItem={removeSelectedItem}
        />
        <SelectedCampaignNamesContainer
          collectionName="campaignNames"
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

export default connect()(SearchCampaignSelections);
