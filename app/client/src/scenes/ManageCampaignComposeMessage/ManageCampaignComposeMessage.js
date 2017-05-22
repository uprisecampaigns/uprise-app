import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import FontIcon from 'material-ui/FontIcon';

import ComposeMessage from 'components/ComposeMessage';
import Link from 'components/Link';

import s from 'styles/Organize.scss';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import MeQuery from 'schemas/queries/MeQuery.graphql';

import history from 'lib/history';

import SendMessageMutation from 'schemas/mutations/SendMessageMutation.graphql';

import { notify } from 'actions/NotificationsActions';

class ManageCampaignComposeMessage extends Component {

  static PropTypes = {
    campaignId: PropTypes.string.isRequired,
    campaign: PropTypes.object,
    sendMessage: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  sendMessage = async ({ subject, body }) => {

    const { userObject, recipients, sendMessage, ...props } = this.props;

    body = 'From: ' + userObject.first_name + ' ' + userObject.last_name + 
      '\nPlease reply to: ' + userObject.email + 
      '\n' + this.props.campaign.title + 
      '\n\n' + body;

    if (!this.sending) {

      try {

        this.sending = true;

        const results = await sendMessage({
          variables: {
            data: {
              replyToEmail: userObject.email,
              recipientEmails: recipients.map(r => r.email),
              subject,
              body
            }
          },
        });

        this.sending = false;
        this.props.dispatch(notify('Message Sent'));

        setTimeout( () => {
          history.goBack();
        }, 500);

      } catch (e) {
        console.error(e);
        this.sending = false;
        this.props.dispatch(notify('There was an error sending your message.'));
      }
    }
  }

  render() {

    if (this.props.campaign && this.props.recipients && this.props.userObject) {

      const { campaign, userObject, recipients, ...props } = this.props;

      const baseUrl = '/organize/' + campaign.slug;

      const detailLines = [
        'From: ' + userObject.first_name + ' ' + userObject.last_name,
        'Please reply to: ' + userObject.email,
        campaign.title,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={baseUrl + '/volunteers'}>
            <div className={s.navHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Volunteers
            </div>
          </Link>

          <div className={s.pageSubHeader}>Compose Message</div>

          <ComposeMessage 
            fromEmail={userObject.email}
            detailLines={detailLines}
            recipients={recipients}
            sendMessage={this.sendMessage}
          />

        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    recipients: state.messages.recipients,
  };
}

export default compose(
  connect(mapStateToProps),
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
  graphql(MeQuery, {
    props: ({ data }) => ({
      userObject: data.me
    }),
  }),
  graphql(SendMessageMutation, { name: 'sendMessage' })
)(ManageCampaignComposeMessage);
