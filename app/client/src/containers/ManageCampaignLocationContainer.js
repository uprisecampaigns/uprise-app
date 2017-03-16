import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
const camelCase = require('camelcase');

import TogglesList from 'components/TogglesList';
import SearchBar from 'components/SearchBar';
import SelectedItemsContainer from 'components/SelectedItemsContainer';
import Link from 'components/Link';

import history from 'lib/history';

import { 
  CampaignQuery ,
} from 'schemas/queries';

import { 
  EditCampaignMutation
} from 'schemas/mutations';

import s from 'styles/Organize.scss';


class ManageCampaignLocationContainer extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      campaign: {
        title: '',
        slug: ''
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

      const results = await this.props.editCampaignMutation({ 
        variables: {
          data: {
            id: this.props.campaign.id,
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

  render() {
    const { saveChanges } = this;
    const { user, ...props } = this.props;
    const { campaign } = this.state;

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

        <div className={s.pageSubHeader}>Location</div>

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
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignLocationContainer);
