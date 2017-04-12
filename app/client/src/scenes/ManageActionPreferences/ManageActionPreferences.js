
import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import camelCase from 'camelcase';

import TogglesList from 'components/TogglesList';
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';
import Link from 'components/Link';

import history from 'lib/history';

import { 
  ActionQuery,
  CampaignQuery,
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
  IssueAreasQuery,
} from 'schemas/queries';

import { 
  EditActionMutation
} from 'schemas/mutations';

import { 
  notify
} from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';


const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      collection: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const ActivitiesTogglesList = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
)(TogglesList);

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
)(TogglesList);

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
)(TogglesList);

class ManageActionPreferencesContainer extends Component {

  static PropTypes = {
    actionId: PropTypes.string.isRequired,
    action: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      action: {
        title: '',
        slug: '',
        activities: [],
        issueAreas: [],
        levels: [],
        types: [],
        tags: []
      },
      saving: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action) {

      // Just camel-casing property keys and checking for null/undefined
      const action = Object.assign(...Object.keys(nextProps.action).map(k => ({
          [camelCase(k)]: nextProps.action[k] || ''
      })));

      Object.keys(action).forEach( (k) => {
        if (!Object.keys(this.state.action).includes(camelCase(k))) {
          delete action[k];
        }
      });

      this.setState( (prevState) => ({
        action: Object.assign({}, prevState.action, action)
      }));
    }
  }


  saveChanges = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    this.setState({ saving: true });

    try {

      const selectedActivities = this.state.action.activities.map( (activity) => ( activity.id ));
      const selectedIssueAreas = this.state.action.issueAreas.map( (issueArea) => ( issueArea.id ));
      const selectedLevels = this.state.action.levels.map( (level) => ( level.id ));
      const selectedTypes = this.state.action.types.map( (level) => ( level.id ));
      const selectedTags = this.state.action.tags;

      const results = await this.props.editActionMutation({ 
        variables: {
          data: {
            id: this.props.action.id,
            activities: selectedActivities,
            issueAreas: selectedIssueAreas,
            levels: selectedLevels,
            types: selectedTypes,
            tags: selectedTags
          }
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionQuery', 'ActionsQuery'],
      });

      console.log('edited action');
      this.props.dispatch(notify('Changes Saved'));
      this.setState({ saving: false });

    } catch (e) {
      console.error(e);
    }
  }

  handleToggle = (collectionName, on, id) => {
    const oldCollection = Array.from(this.state.action[collectionName]);
    let newCollection;

    if (on) {
      newCollection = oldCollection.concat({ id });
    } else {
      newCollection = oldCollection.filter( (item) => item.id !== id );
    }

    const newAction = Object.assign({}, this.state.action, { [collectionName]: newCollection });

    this.setState( (prevState) => ({
      action: Object.assign({}, prevState.action, newAction)
    }));
  }

  addKeyword = (collectionName, tag) => {
    const tags = Array.from(this.state.action.tags);

    if (( typeof tag === 'string' &&
          tag.trim() !== '' &&
          !tags.find(item => item.toLowerCase() === tag.toLowerCase()))) {

      tags.push(tag);
    }

    this.setState( (prevState) => ({
      action: Object.assign({}, prevState.action, { tags })
    }));
  }

  removeKeyword = (collectionName, tagToRemove) => {
    this.setState( (prevState) => ({
      action: Object.assign({}, prevState.action, { 
        tags: prevState.action.tags.filter( (tag) => {
          return tag.toLowerCase() !== tagToRemove.toLowerCase();
        })
      })
    }));
  }

  render() {
    const { saveChanges, handleToggle, addKeyword, removeKeyword } = this;
    const { ...props } = this.props;
    const { action, saving } = this.state;

    const selectedActivities = action.activities.map( (activity) => activity.id );
    const selectedIssueAreas = action.issueAreas.map( (issueArea) => issueArea.id );
    const selectedLevels = action.levels.map( (level) => level.id );
    const selectedTypes = action.types.map( (type) => type.id );
    const selectedTags = action.tags;

    const campaign = props.campaign || {
      title: '',
      slug: ''
    };

    const baseActionUrl = '/organize/' + campaign.slug + '/action/' + action.slug;

    return (
      <div className={s.outerContainer}>
        
        <Link to={baseActionUrl + '/settings'}>
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

          <ActivitiesTogglesList 
            listTitle="Activities"
            collectionName="activities" 
            displayPropName="description"
            keyPropName="id"
            handleToggle={handleToggle}
            selectedCollection={selectedActivities}
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

        { saving ? (

          <div className={s.savingThrobberContainer}>
            <CircularProgress
              size={100}
              thickness={5}
            />
          </div>
        ) : (

          <div className={s.organizeButton}>
            <RaisedButton 
              onTouchTap={saveChanges} 
              primary={true} 
              type="submit"
              label="Save Changes" 
            />
          </div>
        )}
      </div>
    );
  }
}

const withActionQuery = graphql(ActionQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        id: ownProps.actionId
      }
    }
  }),
  props: ({ data }) => ({ 
    action: data.action
  })
});

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        id: ownProps.campaignId
      }
    }
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign
  })
});

export default compose(
  connect(),
  withActionQuery,
  withCampaignQuery,
  graphql(EditActionMutation, { name: 'editActionMutation' })
)(ManageActionPreferencesContainer);
