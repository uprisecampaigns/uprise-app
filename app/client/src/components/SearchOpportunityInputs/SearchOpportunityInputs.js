
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';

import { 
  OpportunitiesQuery, 
  CampaignsQuery, 
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
  IssueAreasQuery,
} from 'schemas/queries';

import { 
  addSearchItem, removeSearchItem,
} from 'actions/SearchOpportunitiesActions';


import Link from 'components/Link';
import Accordion from 'components/Accordion';
import TogglesList from 'components/TogglesList';

import s from './SearchOpportunityInputs.scss';


class InputWithButton extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  static propTypes = {
    collectionName: PropTypes.string.isRequired,
    collectionToSearch: PropTypes.array,
    addItem: PropTypes.func.isRequired,
    inputLabel: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
  }

  handleInputChange = (value) => {
    this.setState(Object.assign({},
      this.state,
      { value }
    ));
  }

  addItem = (event) => {

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    this.props.addItem(this.props.collectionName, this.state.value);

    this.setState(Object.assign({},
      this.state,
      { value: '' }
    ));
  }

  render() {

    const { collectionToSearch, inputLabel, ...props } = this.props;

    const input = (typeof collectionToSearch === 'object' && collectionToSearch.length) ? (
      <AutoComplete
        floatingLabelText={inputLabel}
        searchText={this.state.value}
        onUpdateInput={this.handleInputChange}
        onNewRequest={(item) => this.addItem()} 
        dataSource={collectionToSearch}
        openOnFocus={true}
        filter={(searchText, item) => searchText !== '' && item.toLowerCase().includes(searchText.toLowerCase())}
      />
    ) : (
      <TextField
        floatingLabelText={inputLabel}
        value={this.state.value}
        onChange={ (event) => { this.handleInputChange(event.target.value) } }
      />
    );

    return (
      <div>
        <form onSubmit={this.addItem}>
          {input}
          <RaisedButton 
            onTouchTap={this.addItem} 
            type="submit"
            primary={false} 
            label={props.buttonLabel} 
          />
        </form>
      </div>
    )
  }
}

const SelectedItemsContainer = (props) => {

  const { collectionName, items, removeItem } = props;

  const selectedItemsContainer = items.map( (item, index) => {
    return (
      <div 
        className={s.searchChip}
        key={index}
      >
        <Chip 
          onRequestDelete={ (event) => { removeItem(collectionName, item) }}
        >
          {item}
        </Chip>
      </div>
    );
  });

  return items.length ? (
    <div className={s.searchByContainer}>
      <span className={s.searchByTitle}>{collectionName}:</span>
      <div className={s.searchChips}>
        {selectedItemsContainer}
      </div>
    </div>
  ) : null;
}

SelectedItemsContainer.PropTypes = {
  collectionName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired
}

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


const CampaignNameSearch = graphql(CampaignsQuery, {
  props: ({ data }) => ({
    collectionToSearch: !data.loading && data.campaigns ? 
      data.campaigns.map( (campaign) => campaign.title) : []
  })
})(InputWithButton);

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


  render() {

    const { 
      handleToggle,
      addSelectedItem,
      removeSelectedItem,
    } = this;

    return (
      <div className={s.outerContainer}>
        <div className={s.inputs}>

          <div className={s.searchContainer}>
            <Accordion title="Keywords">
              <InputWithButton
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
        </div>
      </div>
    );
  }
};

export default connect()(SearchOpportunityInputs);
