import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import FontIcon from 'material-ui/FontIcon';

import ComposeMessage from 'components/ComposeMessage';
import Link from 'components/Link';

import s from 'styles/Organize.scss';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import MeQuery from 'schemas/queries/MeQuery.graphql';

import history from 'lib/history';

import SendMessageMutation from 'schemas/mutations/SendMessageMutation.graphql';

import { notify } from 'actions/NotificationsActions';

class ManageActionComposeMessage extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    action: PropTypes.object,
    userObject: PropTypes.object.isRequired,
    recipients: PropTypes.arrayOf(PropTypes.object).isRequired,
    // TODO: I don't know why eslint is complaining about this one
    // eslint-disable-next-line react/no-unused-prop-types
    sendMessage: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
    action: undefined,
  }

  handleSend = async ({ subject, body }) => {
    const { userObject, recipients, sendMessage, ...props } = this.props;

    const fullBody = `From: ${userObject.first_name} ${userObject.last_name
    }\nPlease reply to: ${userObject.email
    }\n${props.campaign.title
    }\n${props.action.title
    }\n\n${body}`;

    try {
      await sendMessage({
        variables: {
          data: {
            replyToEmail: userObject.email,
            recipientEmails: recipients.map(r => r.email),
            body: fullBody,
            subject,
          },
        },
      });

      props.dispatch(notify('Message Sent'));

      setTimeout(() => {
        history.goBack();
      }, 500);
    } catch (e) {
      console.error(e);
      props.dispatch(notify('There was an error sending your message.'));
    }
  }

  render() {
    if (this.props.campaign && this.props.action && this.props.recipients && this.props.userObject) {
      const { campaign, action, userObject, recipients } = this.props;

      const baseActionUrl = `/organize/${campaign.slug}/opportunity/${action.slug}`;

      const detailLines = [
        `From: ${userObject.first_name} ${userObject.last_name}`,
        `Please reply to: ${userObject.email}`,
        campaign.title,
        action.title,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={baseActionUrl}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Dashboard
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
  graphql(ActionQuery, {
    options: ownProps => ({
      variables: {
        search: {
          id: ownProps.actionId,
        },
      },
    }),
    props: ({ data }) => ({
      action: data.action,
    }),
  }),
  graphql(MeQuery, {
    props: ({ data }) => ({
      userObject: data.me,
    }),
  }),
  graphql(SendMessageMutation, { name: 'sendMessage' }),
)(ManageActionComposeMessage);
