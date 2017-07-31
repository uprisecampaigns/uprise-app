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
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';
import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import EditCampaignMutation from 'schemas/mutations/EditCampaignMutation.graphql';

import {
  notify,
  dirtyForm,
  cleanForm,
} from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';


class ManageCampaignPreferencesContainer extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      campaign: {
        title: '',
        slug: '',
        tags: [],
      },
      saving: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaign) {
      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(...Object.keys(nextProps.campaign).map(k => ({
        [camelCase(k)]: nextProps.campaign[k] || '',
      })));

      Object.keys(campaign).forEach((k) => {
        if (!Object.keys(this.state.campaign).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      this.setState(prevState => ({
        campaign: Object.assign({}, prevState.campaign, campaign),
      }));
    }
  }


  saveChanges = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    this.setState({ saving: true });

    try {
      const selectedTags = this.state.campaign.tags;

      await this.props.editCampaignMutation({
        variables: {
          data: {
            id: this.props.campaign.id,
            tags: selectedTags,
          },
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignQuery', 'CampaignsQuery', 'MyCampaignsQuery'],
      });

      this.props.dispatch(cleanForm());

      this.props.dispatch(notify('Changes Saved'));

      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
    }
  }

  addKeyword = (collectionName, tag) => {
    const tags = Array.from(this.state.campaign.tags);

    if ((typeof tag === 'string' &&
          tag.trim() !== '' &&
          !tags.find(item => item.toLowerCase() === tag.toLowerCase()))) {
      tags.push(tag);
    }

    this.props.dispatch(dirtyForm());

    this.setState(prevState => ({
      campaign: Object.assign({}, prevState.campaign, { tags }),
    }));
  }

  removeKeyword = (collectionName, tagToRemove) => {
    this.props.dispatch(dirtyForm());

    this.setState(prevState => ({
      campaign: Object.assign({}, prevState.campaign, {
        tags: prevState.campaign.tags.filter(tag => tag.toLowerCase() !== tagToRemove.toLowerCase()),
      }),
    }));
  }

  render() {
    const { saveChanges, addKeyword, removeKeyword } = this;
    const { campaign, saving } = this.state;

    const selectedTags = campaign.tags;

    return (
      <div className={s.outerContainer}>

        <Link to={`/organize/${campaign.slug}/settings`}>
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
}

const withCampaignQuery = graphql(CampaignQuery, {
  options: ownProps => ({
    variables: {
      search: {
        slug: ownProps.campaignSlug,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    campaign: data.campaign,
  }),
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' }),
)(ManageCampaignPreferencesContainer);
