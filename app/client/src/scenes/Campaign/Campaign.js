import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import CampaignProfile from 'components/CampaignProfile';
import Link from 'components/Link';

import {
  CampaignSubscriptionMutation,
  CancelCampaignSubscriptionMutation,
} from 'schemas/mutations';

import { 
  CampaignQuery, 
} from 'schemas/queries';

import {
  notify
} from 'actions/NotificationsActions';

import s from 'styles/Campaign.scss';


class Campaign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      modalOpen: false
    }
  }

  static propTypes = {
    campaign: PropTypes.object,
    campaignId: PropTypes.string.isRequired
  };

  subscribe = () => {
    this.setState({ modalOpen: true });
  }

  confirmSubscription = async () => {

    this.setState({ saving: true, modalOpen: false });
    try {
      const results = await this.props.subscribe({
        variables: {
          campaignId: this.props.campaign.id
        },
        // TODO: decide between refetch and update
        refetchQueries: ['SubscribersQuery', 'CampaignQuery'],
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
      const results = await this.props.cancelSubscription({
        variables: {
          campaignId: this.props.campaign.id
        },
        // TODO: decide between refetch and update
        refetchQueries: ['SubscribersQuery', 'CampaignQuery'],
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

      const { campaign, ...props } = this.props;
      const { modalOpen, ...state } = this.state;

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={ () => { this.setState({modalOpen: false}); }}
        />,
        <RaisedButton
          label="Confirm"
          primary={true}
          onTouchTap={ () => { this.confirmSubscription() }}
        />
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
            title="Are You Sure?"
            modal={true}
            actions={modalActions}
            open={modalOpen}
          >
            <p>
              In subscribing to this campaign, you are agreeing to give the campaign coordinator your email address for the purposes of contacting you about volunteering for this campaign. 
            </p>
            <p>
              The coordinator is not allowed to add your email address to the campaign’s general email or any other lists or to share or sell your email address without your expressed consent. 
            </p>
            <p>
              Please notify UpRise if you believe that this policy has been violated.
            </p>
          </Dialog>
        </div>

      );
    } else {
      return null;
    }
  }
}

const withCampaignQuery = graphql(CampaignQuery, {
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
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(CampaignSubscriptionMutation, { name: 'subscribe' }),
  graphql(CancelCampaignSubscriptionMutation, { name: 'cancelSubscription' }),
)(Campaign);
