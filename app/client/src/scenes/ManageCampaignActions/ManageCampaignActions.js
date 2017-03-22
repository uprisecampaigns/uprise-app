import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { CampaignQuery } from 'schemas/queries';

import { 
  DeleteCampaignMutation
} from 'schemas/mutations';

import s from 'styles/Organize.scss';


class ManageCampaignActionsContainer extends Component {

  static PropTypes = {
    campaign: PropTypes.object.isRequired,
    campaignSlug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const campaign = this.props.campaign || {
      title: '',
      slug: ''
    }

    return (
      <div className={s.outerContainer}>

        <Link to={'/organize/' + campaign.slug}>
          <div className={s.campaignHeader}>

            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>

            {campaign.title}
          </div>
        </Link>

        <div className={s.campaignSubHeader}>Actions</div>

        <List>

          <Link to={'/organize/' + campaign.slug + '/actions-list'}>
            <ListItem 
              primaryText="Calendar/List"
            />
          </Link>

          <Link to={'/organize/' + campaign.slug + '/new-action'}>
            <ListItem 
              primaryText="New Action"
            />
          </Link>

        </List>
      </div>
    );
  }
}

export default compose(
  graphql(CampaignQuery, {
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
  }),
  graphql(DeleteCampaignMutation, { name: 'deleteCampaignMutation' })
)(ManageCampaignActionsContainer);
