import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import history from 'lib/history';

import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import s from 'styles/Organize.scss';


class ManageCampaignContainer extends Component {
  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.campaign) {
      const { campaign, ...props } = this.props;

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize'}>
            <div className={[s.navHeader, s.organizeNavHeader].join(' ')}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Organize
            </div>
          </Link>

          <div className={s.campaignHeader}>{campaign.title}</div>

          <List className={s.navList}>

            <Divider />

            <Link to={`/organize/${campaign.slug}/actions`}>
              <ListItem
                primaryText="Campaign Actions"
              />
            </Link>

            <Divider />

            <Link to={`/organize/${campaign.slug}/volunteers`}>
              <ListItem
                primaryText="Volunteers"
              />
            </Link>

            <Divider />

            <Link to={`/organize/${campaign.slug}/settings`}>
              <ListItem
                primaryText="Settings"
              />
            </Link>

            <Divider />

          </List>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  graphql(CampaignQuery, {
    options: ownProps => ({
      variables: {
        search: {
          slug: ownProps.campaignSlug,
        },
      },
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),
)(ManageCampaignContainer);
