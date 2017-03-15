import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { CampaignQuery } from 'schemas/queries';

import s from 'styles/Organize.scss';


class ManageCampaignContainer extends Component {

  static PropTypes = {
    campaign: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { campaign, ...props } = this.props;
    return (
      <div className={s.outerContainer}>

        <Link to={'/organize'}>
          <div className={s.organizeNavHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Organize
          </div>
        </Link>

        <div className={s.campaignHeader}>{campaign.title}</div>

        <List>

          <Link to={'/organize/' + campaign.slug + '/actions'}>
            <ListItem 
              primaryText="Actions"
            />
          </Link>

          <Link to={'/organize/' + campaign.slug + '/volunteers'}>
            <ListItem 
              primaryText="Volunteers"
            />
          </Link>

          <Link to={'/organize/' + campaign.slug + '/settings'}>
            <ListItem 
              primaryText="Settings"
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
          slug: ownProps.campaign.slug
        }
      }
    })
  }),
)(ManageCampaignContainer);
