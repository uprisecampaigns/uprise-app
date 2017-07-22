import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import moment from 'moment-timezone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';

import timeWithZone from 'lib/timeWithZone';

import Link from 'components/Link';
import AddToCalendar from 'components/AddToCalendar';

import {
  notify,
} from 'actions/NotificationsActions';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';

import ActionSignupMutation from 'schemas/mutations/ActionSignupMutation.graphql';
import CancelActionSignupMutation from 'schemas/mutations/CancelActionSignupMutation.graphql';

import s from 'styles/Profile.scss';


class Action extends Component {
  static propTypes = {
    action: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionSlug: PropTypes.string.isRequired,
  };

  static defaultProps = {
    action: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      modalOpen: false,
    };
  }

  signup = () => {
    this.setState({ modalOpen: true });
  }

  confirmSignup = async () => {
    this.setState({ saving: true, modalOpen: false });
    try {
      await this.props.signup({
        variables: {
          actionId: this.props.action.id,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionCommitmentsQuery', 'SignedUpVolunteersQuery', 'ActionQuery'],
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
      await this.props.cancelSignup({
        variables: {
          actionId: this.props.action.id,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionCommitmentsQuery', 'SignedUpVolunteersQuery', 'ActionQuery'],
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
      const { action } = this.props;
      const { modalOpen } = this.state;
      const { signup, confirmSignup, cancelSignup } = this;

      const issueAreas = (Array.isArray(action.issue_areas) && action.issue_areas.length) ?
        action.issue_areas.map((issue, index) => <div key={JSON.stringify(issue)} className={s.detailLine}>{issue.title}</div>) :
        [];

      const activities = (Array.isArray(action.activities) && action.activities.length) ?
        action.activities.map((activity, index) => <div key={JSON.stringify(activity)} className={s.detailLine}>{activity.description}</div>) :
        [];

      const keywords = (Array.isArray(action.tags) && action.tags.length) ? (
        <div className={s.detailLine}>{action.tags.join(', ')}</div>
      ) : '';

      const startTime = moment(action.start_time);
      const endTime = moment(action.end_time);

      const startTimeString = timeWithZone(startTime, action.zipcode, 'h:mma');
      const endTimeString = timeWithZone(endTime, action.zipcode, 'h:mma z');

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={(event) => { event.preventDefault(); this.setState({ modalOpen: false }); }}
        />,
        <RaisedButton
          label="Confirm"
          primary
          onTouchTap={(event) => { event.preventDefault(); confirmSignup(); }}
          className={s.primaryButton}
        />,
      ];

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>

            <div className={s.profileHeaderContainer}>
              <div className={s.titleContainer}>{action.title}</div>
              { action.is_owner && (
                <div className={s.settingsIcon}>
                  <Link to={`/organize/${action.campaign.slug}/action/${action.slug}`}>
                    <FontIcon
                      className={['material-icons'].join(' ')}
                    >settings</FontIcon>
                  </Link>
                </div>
              )}
            </div>

            <Link to={`/campaign/${action.campaign.slug}`}>
              <div className={s.campaignHeader}>{action.campaign.title}</div>
            </Link>

            { (startTime.isValid() && endTime.isValid()) && (
              <div>
                <div className={s.dateTimePlaceContainer}>{startTime.format('ddd, MMM Do, YYYY')}</div>
                <div className={s.dateTimePlaceContainer}>{startTimeString} - {endTimeString}</div>
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
                          secondary
                          icon={<FontIcon className="material-icons">add_circle_outline</FontIcon>}
                        />
                      </AddToCalendar>

                      <RaisedButton
                        onTouchTap={cancelSignup}
                        primary
                        label="Cancel attendance"
                      />
                    </div>
                  ) : (
                    <RaisedButton
                      onTouchTap={signup}
                      primary
                      className={s.primaryButton}
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
                <Link to={`mailto:${action.owner.email}`} mailTo external useAhref>
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
              modal
              actions={modalActions}
              actionsContainerClassName={s.modalActionsContainer}
              open={modalOpen}
              autoScrollBodyContent
            >
              <p>
                May we have your permission to share your email address with the coordinator for the purpose of contacting you about this action?
              </p>
            </Dialog>
          )}

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
        slug: ownProps.actionSlug,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    action: data.action,
  }),
});

export default compose(
  connect(),
  withActionQuery,
  graphql(ActionSignupMutation, { name: 'signup' }),
  graphql(CancelActionSignupMutation, { name: 'cancelSignup' }),
)(Action);
