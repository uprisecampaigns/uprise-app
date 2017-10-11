import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
  static propTypes = {
    campaign: PropTypes.object,
    userObject: PropTypes.object,
    sendMessage: PropTypes.func.isRequired,
    recipients: PropTypes.arrayOf(PropTypes.object).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
    userObject: undefined,
  }

  handleSend = async ({ subject, body }) => {
    const {
      userObject, recipients, sendMessage, campaign, dispatch,
    } = this.props;

    const fullBody = `From: ${userObject.first_name} ${userObject.last_name}\n
      Please reply to: ${userObject.email}\n
      ${campaign.title}\n\n
      ${body}
    `;

    if (!this.sending) {
      try {
        this.sending = true;

        await sendMessage({
          variables: {
            data: {
              replyToEmail: userObject.email,
              recipientEmails: recipients.map(r => r.email),
              subject,
              body: fullBody,
            },
          },
        });

        this.sending = false;
        dispatch(notify('Message Sent'));

        setTimeout(() => {
          history.goBack();
        }, 500);
      } catch (e) {
        console.error(e);
        this.sending = false;
        dispatch(notify('There was an error sending your message.'));
      }
    }
  }

  render() {
    if (this.props.campaign && this.props.recipients && this.props.userObject) {
      const { campaign, userObject, recipients } = this.props;

      const baseUrl = `/organize/${campaign.slug}`;

      const detailLines = [
        `From: ${userObject.first_name} ${userObject.last_name}`,
        `Please reply to: ${userObject.email}`,
        campaign.title,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={`${baseUrl}/volunteers`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
              Volunteers
            </div>
          </Link>

          <div className={s.pageSubHeader}>Compose Message</div>

          <ComposeMessage
            fromEmail={userObject.email}
            detailLines={detailLines}
            recipients={recipients}
            handleSend={this.handleSend}
          />

        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  recipients: state.messages.recipients,
});

export default compose(
  connect(mapStateToProps),
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
  graphql(MeQuery, {
    props: ({ data }) => ({
      userObject: data.me,
    }),
  }),
  graphql(SendMessageMutation, { name: 'sendMessage' }),
)(ManageCampaignComposeMessage);
