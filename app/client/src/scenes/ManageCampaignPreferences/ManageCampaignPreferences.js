import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import camelCase from 'camelcase';

import TogglesList from 'components/TogglesList';
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';
import Link from 'components/Link';

import history from 'lib/history';

import { 
  MeQuery,
  CampaignQuery ,
  TypesQuery,
  LevelsQuery,
  IssueAreasQuery,
} from 'schemas/queries';

import { 
  EditCampaignMutation
} from 'schemas/mutations';

import s from 'styles/Organize.scss';


const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      collection: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
)(TogglesList);

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
)(TogglesList);

class ManageCampaignPreferencesContainer extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      campaign: {
        title: '',
        slug: '',
        issueAreas: [],
        levels: [],
        types: [],
        tags: []
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaign) {

      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(...Object.keys(nextProps.campaign).map(k => ({
          [camelCase(k)]: nextProps.campaign[k] || ''
      })));

      Object.keys(campaign).forEach( (k) => {
        if (!Object.keys(this.state.campaign).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      this.setState( (prevState) => ({
        campaign: Object.assign({}, prevState.campaign, campaign)
      }));
    }
  }


  saveChanges = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    try {

      const selectedIssueAreas = this.state.campaign.issueAreas.map( (issueArea) => ( issueArea.id ));
      const selectedLevels = this.state.campaign.levels.map( (level) => ( level.id ));
      const selectedTypes = this.state.campaign.types.map( (level) => ( level.id ));
      const selectedTags = this.state.campaign.tags;

      const results = await this.props.editCampaignMutation({ 
        variables: {
          data: {
            id: this.props.campaign.id,
            issueAreas: selectedIssueAreas,
            levels: selectedLevels,
            types: selectedTypes,
            tags: selectedTags
          }
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignQuery', 'CampaignsQuery', 'MyCampaignsQuery'],
      });

      console.log('edited campaign');

    } catch (e) {
      console.error(e);
    }
  }

  handleToggle = (collectionName, on, id) => {
    const oldCollection = Array.from(this.state.campaign[collectionName]);
    let newCollection;

    if (on) {
      newCollection = oldCollection.concat({ id });
    } else {
      newCollection = oldCollection.filter( (item) => item.id !== id );
    }

    const newCampaign = Object.assign({}, this.state.campaign, { [collectionName]: newCollection });

    this.setState( (prevState) => ({
      campaign: Object.assign({}, prevState.campaign, newCampaign)
    }));
  }

  addKeyword = (collectionName, tag) => {
    const tags = Array.from(this.state.campaign.tags);

    if (( typeof tag === 'string' &&
          tag.trim() !== '' &&
          !tags.find(item => item.toLowerCase() === tag.toLowerCase()))) {

      tags.push(tag);
    }

    this.setState( (prevState) => ({
      campaign: Object.assign({}, prevState.campaign, { tags })
    }));
  }

  removeKeyword = (collectionName, tagToRemove) => {
    this.setState( (prevState) => ({
      campaign: Object.assign({}, prevState.campaign, { 
        tags: prevState.campaign.tags.filter( (tag) => {
          return tag.toLowerCase() !== tagToRemove.toLowerCase();
        })
      })
    }));
  }

  render() {
    const { saveChanges, handleToggle, addKeyword, removeKeyword } = this;
    const { user, ...props } = this.props;
    const { campaign } = this.state;

    const selectedIssueAreas = campaign.issueAreas.map( (issueArea) => issueArea.id );
    const selectedLevels = campaign.levels.map( (level) => level.id );
    const selectedTypes = campaign.types.map( (type) => type.id );
    const selectedTags = campaign.tags;

    return (
      <div className={s.outerContainer}>
        <div className={s.campaignHeader}>{campaign.title}</div>

        <Link to={'/organize/' + campaign.slug + '/settings'}>
          <div className={s.navSubHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Settings
          </div>
        </Link>

        <div className={s.pageSubHeader}>Preferences</div>

        <List>
          
          <IssueAreasTogglesList 
            listTitle="Issue Areas"
            collectionName="issueAreas" 
            displayPropName="title"
            keyPropName="id"
            handleToggle={handleToggle}
            selectedCollection={selectedIssueAreas}
          />

          <LevelsTogglesList 
            listTitle="Campaign Levels"
            collectionName="levels" 
            displayPropName="title"
            keyPropName="id"
            handleToggle={handleToggle}
            selectedCollection={selectedLevels}
          />

          <TypesTogglesList 
            listTitle="Campaign Types"
            collectionName="types" 
            displayPropName="title"
            keyPropName="id"
            handleToggle={handleToggle}
            selectedCollection={selectedTypes}
          />

          <ListItem 
            primaryText="Keywords"
            initiallyOpen={false}
            primaryTogglesNestedList={true}
            nestedItems={[(
              <ListItem key={0} disabled={true} className={[s.listItem, s.searchBar].join(' ')}>
                <SearchBar
                  collectionName="tags"
                  inputLabel="Keyword"
                  addItem={addKeyword}
                  iconName="add"
                />
                <SelectedItemsContainer
                  collectionName="tags"
                  removeItem={removeKeyword}
                  items={selectedTags}
                />
              </ListItem>
            )]}
          />

        </List>

        <div className={s.button}>
          <FlatButton 
            onTouchTap={saveChanges} 
            primary={true} 
            type="submit"
            label="Save Changes" 
          />
        </div>

      </div>
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    user: !data.loading && data.me ? data.me : {
      email: '',
    }, 
  })
});

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        slug: ownProps.campaignSlug
      }
    }
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign
  })
});

export default compose(
  withMeQuery,
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignPreferencesContainer);
