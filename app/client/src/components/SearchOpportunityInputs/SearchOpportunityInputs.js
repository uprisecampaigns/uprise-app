
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';

import { 
  OpportunitiesQuery, 
  CampaignsQuery, 
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
  IssueAreasQuery,
} from 'schemas/queries';

import { 
  addSearchItem, removeSearchItem, setSearchDates, unsetSearchDates
} from 'actions/SearchOpportunitiesActions';

import SearchInputWithButton from 'components/SearchInputWithButton';
import Accordion from 'components/Accordion';
import TogglesList from 'components/TogglesList';
import DateTimeSearch from 'components/DateTimeSearch';
import SelectedItemsContainer from 'components/SelectedItemsContainer';

import s from './SearchOpportunityInputs.scss';


const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      collection: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const ActivitiesTogglesList = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.activities }))
)(TogglesList);

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.types }))
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.levels }))
)(TogglesList);

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.issueAreas }))
)(TogglesList);

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

const SelectedDatesContainer = connect((state) => { 
  const dates = state.opportunitiesSearch.dates;

  let items = [];

  if (dates.onDate) {
    items = [moment(dates.onDate).format('M/D/YYYY')];
  } else if (dates.startDate && dates.endDate) {
    items = [moment(dates.startDate).format('M/D/YYYY') + ' - ' + moment(dates.endDate).format('M/D/YYYY')];
  }

  return { items };
})(SelectedItemsContainer);



const CampaignNameSearch = graphql(CampaignsQuery, {
  props: ({ data }) => ({
    collectionToSearch: !data.loading && data.campaigns ? 
      data.campaigns.map( (campaign) => campaign.title) : []
  })
})(SearchInputWithButton);

class SearchOpportunityInputs extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  };

  handleToggle = (collectionName, on, value) => {
    if (on) {
      this.props.dispatch(addSearchItem(collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem(collectionName, value));
    }
  }

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem(collectionName, value));
  }

  removeSelectedItem = (collectionName, value) => {
    this.props.dispatch(removeSearchItem(collectionName, value));
  }

  setDates = (dates) => {
    this.props.dispatch(setSearchDates(dates));
  }

  unsetDates = () => {
    this.props.dispatch(unsetSearchDates());
  }

  render() {

    const { 
      handleToggle,
      addSelectedItem,
      removeSelectedItem,
      setDates,
      unsetDates,
    } = this;

    return (
      <div className={s.outerContainer}>
        <div className={s.inputs}>

          <div className={s.searchContainer}>
            <Accordion title="Keywords">
              <SearchInputWithButton
                collectionName="keywords"
                inputLabel="keywords"
                buttonLabel="Add to Search >> "
                addItem={addSelectedItem}
              />
            </Accordion>
          </div>

          <div className={s.searchContainer}>
            <Accordion title="Activities">
              <ActivitiesTogglesList 
                collectionName="activities" 
                displayPropName="description"
                keyPropName="title"
                handleToggle={handleToggle}
              />
            </Accordion>
          </div>

          <div className={s.searchContainer}>
            <Accordion title="Campaign Name">
              <CampaignNameSearch
                collectionName="campaignNames"
                inputLabel="campaign name"
                buttonLabel="Add to Search >> "
                addItem={addSelectedItem}
              />
            </Accordion>
          </div>

          <div className={s.searchContainer}>
            <Accordion title="Campaign Type">
              <TypesTogglesList 
                collectionName="types" 
                displayPropName="title"
                keyPropName="title"
                handleToggle={handleToggle}
              />
            </Accordion>
          </div>

          <div className={s.searchContainer}>
            <Accordion title="Campaign Level">
              <LevelsTogglesList 
                collectionName="levels" 
                displayPropName="title"
                keyPropName="title"
                handleToggle={handleToggle}
              />
            </Accordion>
          </div>

          <div className={s.searchContainer}>
            <Accordion title="Issue Areas">
              <IssueAreasTogglesList 
                collectionName="issueAreas" 
                displayPropName="title"
                keyPropName="title"
                handleToggle={handleToggle}
              />
            </Accordion>
          </div>

          <div className={s.searchContainer}>
            <Accordion title="Date, Time">
              <DateTimeSearch 
                setDates={setDates}
              />
            </Accordion>
          </div>
        </div>

        <div className={s.selectedInputs}>
          <div className={s.yourSearch}>Your Search:</div>
          <div>
            <SelectedKeywordsContainer
              collectionName="keywords"
              removeItem={removeSelectedItem}
            />
          </div>
          <div>
            <SelectedActivitiesContainer
              collectionName="activities"
              removeItem={removeSelectedItem}
            />
          </div>
          <div>
            <SelectedCampaignNamesContainer
              collectionName="campaignNames"
              removeItem={removeSelectedItem}
            />
          </div>
          <div>
            <SelectedTypesContainer
              collectionName="types"
              removeItem={removeSelectedItem}
            />
          </div>
          <div>
            <SelectedLevelsContainer
              collectionName="levels"
              removeItem={removeSelectedItem}
            />
          </div>
          <div>
            <SelectedIssueAreasContainer
              collectionName="issueAreas"
              removeItem={removeSelectedItem}
            />
          </div>
          <div>
            <SelectedDatesContainer
              collectionName="dates"
              removeItem={unsetDates}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default connect()(SearchOpportunityInputs);
