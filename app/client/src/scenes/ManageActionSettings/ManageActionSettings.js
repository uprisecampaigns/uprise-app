import PropTypes from 'prop-types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';

import ActionSettingsContainer from 'components/ActionSettingsContainer';
import Link from 'components/Link';

import { notify } from 'actions/NotificationsActions';

import history from 'lib/history';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import EditActionMutation from 'schemas/mutations/EditActionMutation.graphql';

import s from 'styles/Organize.scss';

class ManageActionSettings extends React.PureComponent {
  static propTypes = {
    action: PropTypes.object,
    campaign: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editActionMutation: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    graphqlLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    action: undefined,
    campaign: undefined,
  };

  editAction = async (data) => {
    const actionData = { ...data, id: this.props.actionId, campaignId: this.props.campaignId };

    try {
      const results = await this.props.editActionMutation({
        variables: {
          data: actionData,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionQuery', 'SearchActionsQuery'],
      });

      const action = results.data.editAction;

      this.props.dispatch(notify('Opportunity successfully modified'));

      setTimeout(() => {
        history.push(`/opportunity/${action.slug}`);
      }, 500);
    } catch (e) {
      console.error(e);
      this.props.dispatch(
        notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'),
      );
    }
  };

  render() {
    if (this.props.action && this.props.campaign) {
      const { editAction } = this;
      const { action, campaign } = this.props;

      const baseActionUrl = `/organize/${campaign.slug}/opportunity/${action.slug}`;

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <Link to={`${baseActionUrl}`}>{action.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Settings
              </div>
            </div>

            <ActionSettingsContainer submit={editAction} action={action} campaign={campaign} />
          </div>
        </div>
      );
    }
    return null;
  }
}

const withActionQuery = graphql(ActionQuery, {
  options: (ownProps) => ({
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
  options: (ownProps) => ({
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
