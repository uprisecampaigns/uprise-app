import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose, graphql } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import timeWithZone from 'lib/timeWithZone';

import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import SearchActionsQuery from 'schemas/queries/SearchActionsQuery.graphql';

import s from 'styles/Organize.scss';


class ManageCampaignActionsContainer extends PureComponent {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  }

  render() {
    if (this.props.campaign && this.props.actions) {
      const { campaign, actions } = this.props;

      const actionsList = actions.map(action => (
        <Link key={action.id} to={`/organize/${campaign.slug}/opportunity/${action.slug}`}>
          <ListItem>

            <div className={s.actionListTitle}>
              {action.title}
            </div>

            {action.start_time && (
              <div className={s.actionListDetailLine}>
                {timeWithZone(action.start_time, action.zipcode, 'ddd, MMM Do YYYY, h:mma z')}
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

          <Link to={`/organize/${campaign.slug}`}>
            <div className={[s.navHeader, s.campaignNavHeader].join(' ')}>

              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>

              {campaign.title}
            </div>
          </Link>

          <div className={s.pageSubHeader}>Opportunities</div>

          <Link to={`/organize/${campaign.slug}/create-opportunity`}>
            <div className={s.organizeButton}>
              <RaisedButton
                primary
                type="submit"
                label="Create Opportunity"
              />
            </div>
          </Link>

          <List>

            { actionsList }

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

  graphql(SearchActionsQuery, {
    options: ownProps => ({
      variables: {
        search: {
          campaignIds: [ownProps.campaignId],
          // This prevents paging - we just want them all at once
          // TODO: better implementation
          limit: 1000,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      actions: data.actions ? data.actions.actions : [],
    }),
  }),

)(ManageCampaignActionsContainer);
