import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import FontIcon from 'material-ui/FontIcon';

import ComposeMessage from 'components/ComposeMessage';
import Link from 'components/Link';

import s from 'styles/Organize.scss';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import history from 'lib/history';

import SendMessageMutation from 'schemas/mutations/SendMessageMutation.graphql';

import { notify } from 'actions/NotificationsActions';

class MessageUser extends Component {
  static propTypes = {
    userObject: PropTypes.object,
    sendMessage: PropTypes.func.isRequired,
    recipients: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  static defaultProps = {
    userObject: undefined,
  }

  handleSend = async ({ subject, body }) => {
    const {
      userObject, recipients, sendMessage, dispatch,
    } = this.props;

    const fullBody = `From: ${userObject.first_name} ${userObject.last_name}\n
      Please reply to: ${userObject.email}\n\n
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
    if (this.props.recipients && this.props.userObject) {
      const { userObject, recipients } = this.props;

      const baseUrl = `/user/${userObject.id}`;

      const detailLines = [
        `From: ${userObject.first_name} ${userObject.last_name}`,
        `Please reply to: ${userObject.email}`,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={baseUrl}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
              {userObject.first_name} {userObject.last_name}
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
  graphql(MeQuery, {
    props: ({ data }) => ({
      userObject: data.me,
    }),
    options: ownProps => ({
      fetchPolicy: 'cache-and-network',
      ...ownProps,
    }),
  }),
  graphql(SendMessageMutation, { name: 'sendMessage' }),
)(MessageUser);
