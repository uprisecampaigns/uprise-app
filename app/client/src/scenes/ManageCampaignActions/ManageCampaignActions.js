import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { CampaignQuery, ActionsQuery } from 'schemas/queries';

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

    if (this.props.campaign && this.props.actions) {
      const { campaign, actions, ...props } = this.props;

      const actionsList = actions.map( (action) => (
        <Link key={action.id} to={'/organize/' + campaign.slug + '/action/' + action.slug}>
          <ListItem>

            <div className={s.actionListTitle}>
              {action.title}
            </div>

            {action.start_time && (
              <div className={s.actionListDetailLine}>
                {moment(action.start_time).format("ddd, MMM Do YYYY, h:mm:ss a")}
              </div>
            )}

            {(action.city && action.state) && (
              <div className={s.actionListDetailLine}>
                {action.city}, {action.state}
              </div>
            )}

          </ListItem>
        </Link>
      ));

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

          <Link to={'/organize/' + campaign.slug + '/create-action'}>
            <div className={s.organizeButton}>
              <RaisedButton
                primary={true} 
                type="submit"
                label="Create Action" 
              />
            </div>
          </Link>

          <List>

            { actionsList }

          </List>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(CampaignQuery, {
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
  }),

  graphql(ActionsQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          campaignIds: [ownProps.campaignId]
        }
      }
    }),
    props: ({ data }) => ({ 
      actions: data.actions
    })
  }),

  graphql(DeleteCampaignMutation, { name: 'deleteCampaignMutation' })
)(ManageCampaignActionsContainer);
