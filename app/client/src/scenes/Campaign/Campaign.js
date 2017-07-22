import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import CampaignProfile from 'components/CampaignProfile';

import CampaignSubscriptionMutation from 'schemas/mutations/CampaignSubscriptionMutation.graphql';
import CancelCampaignSubscriptionMutation from 'schemas/mutations/CancelCampaignSubscriptionMutation.graphql';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import {
  notify,
} from 'actions/NotificationsActions';

import s from 'styles/Profile.scss';


class Campaign extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  };

  static defaultProps = {
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      modalOpen: false,
    };
  }

  subscribe = () => {
    this.setState({ modalOpen: true });
  }

  confirmSubscription = async () => {
    this.setState({ saving: true, modalOpen: false });
    try {
      await this.props.subscribe({
        variables: {
          campaignId: this.props.campaign.id,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignSubscriptionsQuery', 'SubscribersQuery', 'CampaignQuery'],
      });

      this.props.dispatch(notify('Subscribed!'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      this.setState({ saving: false });
    }
  }

  cancelSubscription = async () => {
    this.setState({ saving: true });
    try {
      await this.props.cancelSubscription({
        variables: {
          campaignId: this.props.campaign.id,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignSubscriptionsQuery', 'SubscribersQuery', 'CampaignQuery'],
      });

      this.props.dispatch(notify('Subscription canceled'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      this.setState({ saving: false });
    }
  }

  render() {
    if (this.props.campaign) {
      const { campaign } = this.props;
      const { modalOpen } = this.state;

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={(event) => { event.preventDefault(); this.setState({ modalOpen: false }); }}
        />,
        <RaisedButton
          label="Confirm"
          primary
          onTouchTap={(event) => { event.preventDefault(); this.confirmSubscription(); }}
          className={s.primaryButton}
        />,
      ];

      return (
        <div>
          <CampaignProfile
            subscribe={this.subscribe}
            cancelSubscription={this.cancelSubscription}
            campaign={campaign}
            saving={this.state.saving}
          />

          <Dialog
            title="Permission to Share?"
            modal
            actions={modalActions}
            actionsContainerClassName={s.modalActionsContainer}
            open={modalOpen}
            autoScrollBodyContent
          >
            <p>
              May we have your permission to share your email address with the coordinator
              for the purpose of contacting you about volunteering for this campaign?
            </p>
          </Dialog>
        </div>

      );
    }
    return null;
  }
}

const withCampaignQuery = graphql(CampaignQuery, {
  options: ownProps => ({
    variables: {
      search: {
        slug: ownProps.campaignSlug,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    campaign: data.campaign,
  }),
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(CampaignSubscriptionMutation, { name: 'subscribe' }),
  graphql(CancelCampaignSubscriptionMutation, { name: 'cancelSubscription' }),
)(Campaign);
