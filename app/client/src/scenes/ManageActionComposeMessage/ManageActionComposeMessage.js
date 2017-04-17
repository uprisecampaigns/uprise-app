import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import FontIcon from 'material-ui/FontIcon';

import ComposeMessage from 'components/ComposeMessage';
import Link from 'components/Link';

import s from 'styles/Organize.scss';

import { 
  CampaignQuery, ActionQuery, SignedUpVolunteersQuery, MeQuery
} from 'schemas/queries';

import history from 'lib/history';

import { SendMessageMutation } from 'schemas/mutations';

import { notify } from 'actions/NotificationsActions';

class ManageActionComposeMessage extends Component {

  static PropTypes = {
    actionId: PropTypes.string.isRequired,
    campaignId: PropTypes.string.isRequired,
    campaign: PropTypes.object,
    action: PropTypes.object,
    sendMessage: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  sendMessage = async ({ subject, body }) => {

    const { userObject, recipients, sendMessage, ...props } = this.props;

    try {
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

      this.props.dispatch(notify('Message Sent'));

      setTimeout( () => {
        history.goBack();
      }, 500);

    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error sending your message.'));
    }
  }

  render() {

    if (this.props.campaign && this.props.action && this.props.recipients && this.props.userObject) {

      const { campaign, action, userObject, recipients, ...props } = this.props;

      const baseActionUrl = '/organize/' + campaign.slug + '/action/' + action.slug;

      const detailLines = [
        'From: ' + userObject.first_name + ' ' + userObject.last_name,
        'Please reply to: ' + userObject.email,
        campaign.title,
        action.title,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={baseActionUrl}>
            <div className={s.navSubHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Dashboard
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
  graphql(ActionQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          id: ownProps.actionId
        }
      }
    }),
    props: ({ data }) => ({ 
      action: data.action
    })
  }),
  graphql(MeQuery, {
    props: ({ data }) => ({
      userObject: data.me
    }),
  }),
  graphql(SendMessageMutation, { name: 'sendMessage' })
)(ManageActionComposeMessage);
