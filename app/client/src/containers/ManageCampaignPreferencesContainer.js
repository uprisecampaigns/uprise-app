import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
const camelCase = require('camelcase');

import TogglesList from 'components/TogglesList';
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
        types: []
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


  formSubmit = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    try {

      const selectedIssueAreas = this.state.campaign.issueAreas.map( (issueArea) => ( issueArea.id ));
      const selectedLevels = this.state.campaign.levels.map( (level) => ( level.id ));
      const selectedTypes = this.state.campaign.types.map( (level) => ( level.id ));

      const results = await this.props.editCampaignMutation({ 
        variables: {
          data: {
            id: this.props.campaign.id,
            issueAreas: selectedIssueAreas,
            levels: selectedLevels,
            types: selectedTypes
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

  render() {
    const { formSubmit, handleToggle } = this;
    const { user, ...props } = this.props;
    const { campaign } = this.state;

    const selectedIssueAreas = campaign.issueAreas.map( (issueArea) => issueArea.id );
    const selectedLevels = campaign.levels.map( (level) => level.id );
    const selectedTypes = campaign.types.map( (type) => type.id );

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

        <form 
          onSubmit={formSubmit}
        >
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
          </List>

          <div className={s.button}>
            <RaisedButton 
              onTouchTap={formSubmit} 
              primary={true} 
              type="submit"
              label="Save" 
            />
          </div>
        </form>

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
