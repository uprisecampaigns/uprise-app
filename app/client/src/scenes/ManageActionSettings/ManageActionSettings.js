import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { 
  CampaignQuery, ActionQuery 
} from 'schemas/queries';

import s from 'styles/Organize.scss';


class ManageActionSettings extends Component {

  static PropTypes = {
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

    const action = this.props.action || {
      title: '',
      slug: ''
    }

    const baseActionUrl = '/organize/' + campaign.slug + '/action/' + action.slug;

    return (
      <div className={s.outerContainer}>

        <Link to={'/organize/' + campaign.slug}>
          <div className={s.campaignHeader}>{campaign.title}</div>
        </Link>

        <Link to={baseActionUrl}>
          <div className={s.actionHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            {action.title}
          </div>
        </Link>

        <div className={s.pageSubHeader}>Settings</div>

        <List>

          <Link to={baseActionUrl + '/info' }>
            <ListItem 
              primaryText="Info"
            />
          </Link>

          <Link to={baseActionUrl + '/preferences' }>
            <ListItem 
              primaryText="Preferences"
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
          id: ownProps.campaignId
        }
      }
    }),
    props: ({ data }) => ({ 
      campaign: data.campaign
    })
  }),
  graphql(ActionQuery, {
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
  }),
)(ManageActionSettings);
