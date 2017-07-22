import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import s from 'styles/Organize.scss';


class ManageActionProfile extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    action: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.object.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
    action: undefined,
  }

  render() {
    if (this.props.campaign && this.props.action) {
      const { campaign, action } = this.props;

      const baseActionUrl = `/organize/${campaign.slug}/action/${action.slug}`;

      return (
        <div className={s.outerContainer}>

          <Link to={`${baseActionUrl}/settings/`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Profile</div>

          <List className={s.navList}>

            <Divider />

            <Link to={`/action/${action.slug}`}>
              <ListItem
                primaryText="View"
              />
            </Link>

            <Divider />

            <Link to={`${baseActionUrl}/profile/edit`}>
              <ListItem
                primaryText="Edit"
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
          id: ownProps.campaignId,
        },
      },
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),
  graphql(ActionQuery, {
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
      graphqlLoading: data.loading,
    }),
  }),
)(ManageActionProfile);
