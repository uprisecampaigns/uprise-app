
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import SelectedItemsContainer from 'components/SelectedItemsContainer';

import {
  removeSearchItem, unsetSearchDates,
} from 'actions/SearchActions';

import s from 'styles/Search.scss';

const aggregateDates = (dates) => {
  const items = [];

  if (dates.ongoing || dates.onDate || (dates.startDate && dates.endDate)) {
    items.push(dates);
  }

  return items;
};

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

class SearchSelections extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    selectedState: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  removeSelectedItem = (collectionName, value) => {
    this.props.dispatch(removeSearchItem(this.props.type, collectionName, value));
  }

  unsetDates = () => {
    this.props.dispatch(unsetSearchDates(this.props.type));
  }

  render() {
    const { selectedState } = this.props;
    const {
      removeSelectedItem,
      unsetDates,
    } = this;

    return (
      <div className={s.selectedInputs}>

        <SelectedItemsContainer
          collectionName="tags"
          items={selectedState.tags}
          removeItem={removeSelectedItem}
        />

        <SelectedItemsContainer
          collectionName="geographies"
          items={selectedState.geographies}
          removeItem={removeSelectedItem}
          renderLabel={renderSelectedGeographyLabel}
        />

        <SelectedItemsContainer
          items={selectedState.keywords}
          collectionName="keywords"
          removeItem={removeSelectedItem}
        />

        <SelectedItemsContainer
          items={selectedState.activities}
          collectionName="activities"
          removeItem={removeSelectedItem}
        />

        <SelectedItemsContainer
          collectionName="dates"
          items={aggregateDates(selectedState.dates)}
          removeItem={unsetDates}
          renderLabel={renderSelectedDateLabel}
        />

      </div>
    );
  }
}

export default connect()(SearchSelections);
