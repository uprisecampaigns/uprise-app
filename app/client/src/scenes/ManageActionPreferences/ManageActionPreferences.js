import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import camelCase from 'camelcase';

import ControlledListItem from 'components/ControlledListItem';
import TogglesList from 'components/TogglesList';
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';
import Link from 'components/Link';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import EditActionMutation from 'schemas/mutations/EditActionMutation.graphql';

import {
  notify,
  dirtyForm,
  cleanForm,
} from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';


const graphqlOptions = collection => ({
  props: ({ data }) => ({
    collection: !data.loading && data[collection] ? data[collection] : [],
  }),
});

const ActivitiesTogglesList = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
)(TogglesList);

class ManageActionPreferencesContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    action: PropTypes.object,
    campaign: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    action: undefined,
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      action: {
        title: '',
        slug: '',
        activities: [],
        tags: [],
      },
      saving: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action) {
      // Just camel-casing property keys and checking for null/undefined
      const action = Object.assign(...Object.keys(nextProps.action).map(k => ({
        [camelCase(k)]: nextProps.action[k] || '',
      })));

      Object.keys(action).forEach((k) => {
        if (!Object.keys(this.state.action).includes(camelCase(k))) {
          delete action[k];
        }
      });

      this.setState(prevState => ({
        action: Object.assign({}, prevState.action, action),
      }));
    }
  }


  saveChanges = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    this.setState({ saving: true });

    try {
      const selectedActivities = this.state.action.activities.map(activity => (activity.id));
      const selectedTags = this.state.action.tags;

      await this.props.editActionMutation({
        variables: {
          data: {
            id: this.props.action.id,
            activities: selectedActivities,
            tags: selectedTags,
          },
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionQuery', 'SearchActionsQuery'],
      });

      this.props.dispatch(cleanForm());

      this.props.dispatch(notify('Changes Saved'));

      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      this.setState({ saving: false });
    }
  }

  handleToggle = (collectionName, on, id) => {
    const oldCollection = Array.from(this.state.action[collectionName]);
    let newCollection;

    if (on) {
      newCollection = oldCollection.concat({ id });
    } else {
      newCollection = oldCollection.filter(item => item.id !== id);
    }

    const newAction = Object.assign({}, this.state.action, { [collectionName]: newCollection });

    this.props.dispatch(dirtyForm());

    this.setState(prevState => ({
      action: Object.assign({}, prevState.action, newAction),
    }));
  }

  addKeyword = (collectionName, tag) => {
    const tags = Array.from(this.state.action.tags);

    if ((typeof tag === 'string' &&
          tag.trim() !== '' &&
          !tags.find(item => item.toLowerCase() === tag.toLowerCase()))) {
      tags.push(tag);
    }

    this.props.dispatch(dirtyForm());

    this.setState(prevState => ({
      action: Object.assign({}, prevState.action, { tags }),
    }));
  }

  removeKeyword = (collectionName, tagToRemove) => {
    this.props.dispatch(dirtyForm());
    this.setState(prevState => ({
      action: Object.assign({}, prevState.action, {
        tags: prevState.action.tags.filter(tag => tag.toLowerCase() !== tagToRemove.toLowerCase()),
      }),
    }));
  }

  render() {
    if (this.state.action && this.props.campaign) {
      const { saveChanges, handleToggle, addKeyword, removeKeyword } = this;
      const { campaign } = this.props;
      const { action, saving } = this.state;

      const selectedActivities = action.activities ? action.activities.map(activity => activity.id) : [];
      const selectedTags = action.tags;

      const baseActionUrl = `/organize/${campaign.slug}/action/${action.slug}`;

      return (
        <div className={s.outerContainer}>

          <Link to={`${baseActionUrl}/settings`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Preferences</div>

          <List className={s.navList}>

            <Divider />

            <ActivitiesTogglesList
              listTitle="Activities"
              collectionName="activities"
              displayPropName="description"
              keyPropName="id"
              handleToggle={handleToggle}
              selectedCollection={selectedActivities}
            />

            <Divider />

            <ControlledListItem
              primaryText="Keywords"
              nestedItems={[(
                <ListItem key={0} disabled className={s.keywordsContainer}>
                  <div className={s.keywordsInputContainer}>
                    <SearchBar
                      collectionName="tags"
                      inputLabel="Keyword"
                      addItem={addKeyword}
                      iconName="add"
                    />
                  </div>
                  <SelectedItemsContainer
                    collectionName="tags"
                    removeItem={removeKeyword}
                    items={selectedTags}
                  />
                </ListItem>
              )]}
            />

            <Divider />

          </List>

          { saving ? (

            <div className={s.savingThrobberContainer}>
              <CircularProgress
                size={100}
                thickness={5}
              />
            </div>
          ) : (

            <div className={[s.organizeButton, s.saveButton].join(' ')}>
              <RaisedButton
                onTouchTap={saveChanges}
                primary
                type="submit"
                label="Save Changes"
              />
            </div>
          )}
        </div>
      );
    }
    return null;
  }
}

const withActionQuery = graphql(ActionQuery, {
  options: ownProps => ({
    variables: {
      search: {
        id: ownProps.actionId,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    action: data.action,
  }),
});

const withCampaignQuery = graphql(CampaignQuery, {
  options: ownProps => ({
    variables: {
      search: {
        id: ownProps.campaignId,
      },
    },
  }),
  props: ({ data }) => ({
    campaign: data.campaign,
  }),
});

export default compose(
  connect(),
  withActionQuery,
  withCampaignQuery,
  graphql(EditActionMutation, { name: 'editActionMutation' }),
)(ManageActionPreferencesContainer);
