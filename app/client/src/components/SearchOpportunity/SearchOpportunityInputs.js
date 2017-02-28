
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';

import { 
  OpportunitiesQuery, 
  CampaignsQuery, 
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
  IssueAreasQuery,
} from 'schemas/queries';

import { 
  addSearchItem, setSearchDates, removeSearchItem
} from 'actions/SearchOpportunitiesActions';

import SearchInputWithButton from 'components/SearchInputWithButton';
import GeographySearch from 'components/GeographySearch';
import Accordion from 'components/Accordion';
import TogglesList from 'components/TogglesList';
import DateTimeSearch from 'components/DateTimeSearch';

import s from './SearchOpportunity.scss';


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

const ConnectedDateTimeSearch = connect((state) => ({ selectedTimes: state.opportunitiesSearch.times }))(DateTimeSearch);

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

  setDates = (dates) => {
    this.props.dispatch(setSearchDates(dates));
  }

  render() {

    const { 
      handleToggle,
      addSelectedItem,
      setDates,
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
              <ConnectedDateTimeSearch 
                setDates={setDates}
                handleToggle={handleToggle}
              />
            </Accordion>
          </div>

          <div className={s.searchContainer}>
            <Accordion title="Location">
              <GeographySearch 
                addItem={addSelectedItem}
              />
            </Accordion>
          </div>
        </div>
      </div>
    );
  }
};

export default connect()(SearchOpportunityInputs);
