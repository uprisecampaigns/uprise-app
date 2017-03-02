
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';

import SelectedItemsContainer from 'components/SelectedItemsContainer';

import { 
  removeSearchItem, unsetSearchDates
} from 'actions/SearchOpportunitiesActions';

import s from './SearchOpportunity.scss';


const SelectedKeywordsContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.keywords };
})(SelectedItemsContainer);

const SelectedActivitiesContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.activities };
})(SelectedItemsContainer);

const SelectedCampaignNamesContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.campaignNames };
})(SelectedItemsContainer);

const SelectedTypesContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.types };
})(SelectedItemsContainer);

const SelectedLevelsContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.levels };
})(SelectedItemsContainer);

const SelectedIssueAreasContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.issueAreas };
})(SelectedItemsContainer);

const SelectedTimesContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.times };
})(SelectedItemsContainer);

const SelectedDatesContainer = connect((state) => { 
  const dates = state.opportunitiesSearch.dates;

  const items = [];

  if (dates.onDate || (dates.startDate && dates.endDate)) {
    items.push(dates);
  } 

  return { items };

})(SelectedItemsContainer);

const SelectedGeographiesContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.geographies };
})(SelectedItemsContainer);

const renderSelectedDateLabel = (dates) => {
  if (dates.onDate) {
    return moment(dates.onDate).format('M/D/YYYY');
  } else if (dates.startDate && dates.endDate) {
    return moment(dates.startDate).format('M/D/YYYY') + ' - ' + moment(dates.endDate).format('M/D/YYYY');
  }
}

const renderSelectedGeographyLabel = (geography) => {
  return 'Within ' + geography.distance + ' miles of ' + geography.zipcode;
};

class SearchOpportunitySelections extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  removeSelectedItem = (collectionName, value) => {
    this.props.dispatch(removeSearchItem(collectionName, value));
  }

  unsetDates = () => {
    this.props.dispatch(unsetSearchDates());
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
        <SelectedTypesContainer
          collectionName="types"
          removeItem={removeSelectedItem}
        />
        <SelectedLevelsContainer
          collectionName="levels"
          removeItem={removeSelectedItem}
        />
        <SelectedIssueAreasContainer
          collectionName="issueAreas"
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

export default connect()(SearchOpportunitySelections); 
