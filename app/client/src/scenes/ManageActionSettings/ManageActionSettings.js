import PropTypes from 'prop-types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';

import ActionSettingsContainer from 'components/ActionSettingsContainer';
import Link from 'components/Link';


import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import EditActionMutation from 'schemas/mutations/EditActionMutation.graphql';

import s from 'styles/Organize.scss';


class ManageActionSettings extends React.PureComponent {
  static propTypes = {
    action: PropTypes.object,
    campaign: PropTypes.object,
    editActionMutation: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    graphqlLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    action: undefined,
    campaign: undefined,
  }

  editAction = async (data) => {
    const actionData = { ...data, id: this.props.actionId, campaignId: this.props.campaignId };

    try {
      await this.props.editActionMutation({
        variables: {
          data: actionData,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionQuery', 'SearchActionsQuery'],
      });

      return { success: true, message: 'Changes Saved' };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }

  render() {
    if (this.props.action && this.props.campaign) {
      const { editAction } = this;
      const { action, campaign } = this.props;

      const baseActionUrl = `/organize/${campaign.slug}/opportunity/${action.slug}`;

      return (
        <div className={s.outerContainer}>

          <Link to={baseActionUrl}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
              {action.title}
            </div>
          </Link>

          <div className={s.pageSubHeader}>Settings</div>

          <ActionSettingsContainer
            submit={editAction}
            action={action}
            campaign={campaign}
          />

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
)(ManageActionSettings);
