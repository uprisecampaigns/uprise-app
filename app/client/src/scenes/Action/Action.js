import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import Link from 'components/Link';
import AddToCalendar from 'components/AddToCalendar';

import {
  notify
} from 'actions/NotificationsActions';

import {
  ActionQuery,
} from 'schemas/queries';

import {
  ActionSignupMutation,
  CancelActionSignupMutation
} from 'schemas/mutations';

import s from 'styles/Profile.scss';


class Action extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      modalOpen: false
    }
  }

  static propTypes = {
    actionId: PropTypes.string.isRequired,
    action: PropTypes.object
  };

  signup = () => {
    this.setState({ modalOpen: true });
  }

  confirmSignup = async () => {

    this.setState({ saving: true, modalOpen: false });
    try {
      const results = await this.props.signup({
        variables: {
          actionId: this.props.action.id
        },
        // TODO: decide between refetch and update
        refetchQueries: ['MyActionsQuery', 'SignedUpVolunteersQuery', 'ActionQuery'],
      });

      this.props.dispatch(notify('Signed up!'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      this.setState({ saving: false });
    }
  }

  cancelSignup = async () => {

    this.setState({ saving: true });
    try {
      const results = await this.props.cancelSignup({
        variables: {
          actionId: this.props.action.id
        },
        // TODO: decide between refetch and update
        refetchQueries: ['MyActionsQuery', 'SignedUpVolunteersQuery', 'ActionQuery', 'MyActionsQuery'],
      });

      this.props.dispatch(notify('Signup canceled'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      this.setState({ saving: false });
    }

  }

  render() {
    if (this.props.action) {

      const { action, ...props } = this.props;
      const { modalOpen, ...state } = this.state;
      const { signup, confirmSignup, cancelSignup } = this;
  
      const startTime = moment(action.start_time);
      const endTime = moment(action.end_time);

      const issueAreas = (Array.isArray(action.issue_areas) && action.issue_areas.length) ?
        action.issue_areas.map( (issue, index) => {
          return <div key={index} className={s.detailLine}>{issue.title}</div>;
        }) : [];

      const activities = (Array.isArray(action.activities) && action.activities.length) ?
        action.activities.map( (activity, index) => {
          return <div key={index} className={s.detailLine}>{activity.description}</div>;
        }) : [];

      const keywords = (Array.isArray(action.tags) && action.tags.length) ? (
        <div className={s.detailLine}>{action.tags.join(', ')}</div>
      ) : '';

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={ () => { this.setState({modalOpen: false}); }}
        />,
        <RaisedButton
          label="Confirm"
          primary={true}
          onTouchTap={ () => { confirmSignup() }}
        />
      ];

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.titleContainer}>{action.title}</div>
            <Link to={'/campaign/' + action.campaign.slug}>
              <div className={s.campaignHeader}>{action.campaign.title}</div>
            </Link>

            { (startTime.isValid() && endTime.isValid()) && (
              <div>
                <div className={s.dateTimePlaceContainer}>{startTime.format('ddd, MMM Do, YYYY')}</div>
                <div className={s.dateTimePlaceContainer}>{startTime.format('h:mm a')} - {endTime.format('h:mm a')}</div>
              </div>
            )}

            { (action.city && action.state) && 
              <div className={s.dateTimePlaceContainer}>{action.city}, {action.state}</div>
            }

            <div className={s.attendingContainer}>
              {this.state.saving ? (
                <div className={s.savingThrobberContainer}>
                  <CircularProgress
                    size={100}
                    thickness={5}
                  />
                </div>
              ) : (
                <div>
                  {action.attending ? (
                    <div>

                      <AddToCalendar className={s.calendarLinkContainer} event={action}>
                        <FlatButton
                          label="Add to Calendar"
                          secondary={true}
                          icon={<FontIcon className="material-icons">add_circle_outline</FontIcon>}
                        />
                      </AddToCalendar>

                      <RaisedButton
                        onTouchTap={cancelSignup}
                        primary={true}
                        label="Cancel attendance"
                      />
                    </div>
                  ) : (
                    <RaisedButton
                      onTouchTap={signup}
                      primary={true}
                      label="Sign up now"
                    />
                  )}
                </div>
              )}
            </div>

            { (typeof action.description === 'string' && action.description.trim() !== '') &&
              <div className={s.descriptionContainer}>{action.description}</div>
            }

            { action.owner && (
              <div className={s.contactContainer}>
                Contact Coordinator: {action.owner.first_name} {action.owner.last_name}
                <Link to={'mailto:' + action.owner.email} mailTo={true} external={true} useAhref={true}>
                  {action.owner.email}
                </Link>
              </div>
            )}

            { (action.location_name || action.street_address || (action.city && action.state && action.zipcode)) && (
              <div className={s.locationContainer}>
                <div className={s.header}>
                  Location Details
                </div>
                {action.location_name && 
                  <div className={s.detailLine}>{action.location_name}</div>
                }

                {action.street_address && 
                  <div className={s.detailLine}>{action.street_address}</div>
                }

                {action.street_address2 && 
                  <div className={s.detailLine}>{action.street_address2}</div>
                }

                { (action.city && action.state && action.zipcode) && (
                  <div className={s.detailLine}>
                    {action.city}, {action.state} {action.zipcode}
                  </div>
                )}

                {action.location_notes && 
                  <div className={s.detailLine}>{action.location_notes}</div>
                }
              </div>
            )}

            {issueAreas.length > 0 && (
              <div className={s.issueAreasContainer}>
                <div className={s.header}>
                  Issue Areas:
                </div>
                <div>{issueAreas}</div>
              </div>
            )}

            {activities.length > 0 && (
              <div className={s.activitiesContainer}>
                <div className={s.header}>
                  Activities and Skills Needed:
                </div>
                <div>{activities}</div>
              </div>
            )}

            {keywords && ( 
              <div className={s.keywordsContainer}>
                <div className={s.header}>
                  Keywords:
                </div>
                <div>{keywords}</div>
              </div>
            )}

          </div>

          {modalOpen && (
            <Dialog
              title="Permission to Share?"
              modal={true}
              actions={modalActions}
              open={modalOpen}
            >
              <p>
                May we have your permission to share your email address with the coordinator for the purpose of contacting you about this action?
              </p>
              <p>
                The coordinator is not allowed to add your email address to the campaign’s general email or any other lists or to share or sell your email address without your expressed consent.
              </p>
              <p>
                Please notify UpRise if you believe that this policy has been violated.
              </p>
            </Dialog>
          )}

        </div>
      );
    } else {
      return null;
    }
  }
}

const withActionQuery = graphql(ActionQuery, {
  options: (ownProps) => ({
    variables: {
      search: {
        id: ownProps.actionId
      }
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    action: data.action
  })
});

export default compose(
  connect(),
  withActionQuery,
  graphql(ActionSignupMutation, { name: 'signup' }),
  graphql(CancelActionSignupMutation, { name: 'cancelSignup' }),
)(Action);
