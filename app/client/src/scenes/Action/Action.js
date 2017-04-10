import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';

import Link from 'components/Link';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

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

import s from 'styles/Action.scss';


class ActionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false
    }
  }

  static propTypes = {
    actionId: PropTypes.string.isRequired,
    action: PropTypes.object
  };

  signup = async () => {

    this.setState({ saving: true });
    try {
      const results = await this.props.signup({
        variables: {
          actionId: this.props.action.id
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionsQuery', 'ActionQuery'],
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
        refetchQueries: ['ActionsQuery', 'ActionQuery'],
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
      const { signup, cancelSignup } = this;
  
      const startTime = moment(action.start_time);
      const endTime = moment(action.end_time);

      const issueAreas = (typeof action.issue_areas === 'object') ?
        action.issue_areas.map( (issue, index) => {
          return <div key={index} className={s.detailLine}>{issue.title}</div>;
        }) : [];

      const activities = (typeof action.activities === 'object') ?
        action.activities.map( (activity, index) => {
          return <div key={index} className={s.detailLine}>{activity.description}</div>;
        }) : [];

      const keywords = (typeof action.tags === 'object') ?
        action.tags.map( (tag, index) => {
          return <div key={index} className={s.detailLine}>{tag}</div>;
        }) : [];

      return (
        <div className={s.outerContainer}>
          <Link to={'/campaign/' + action.campaign.slug}>
            <div className={s.campaignHeader}>{action.campaign.title}</div>
          </Link>
          <div className={s.innerContainer}>
            <div className={s.titleContainer}>{action.title}</div>
            <div className={s.dateTimePlaceContainer}>{startTime.format('ddd MMM Do, YYYY')}, {action.city}, {action.state}</div>

            <div className={s.contactContainer}>
              Contact Coordinator: {action.owner.first_name} {action.owner.last_name}
              <Link to={'mailto:' + action.owner.email} external={true} useAhref={true}>
                {action.owner.email}
              </Link>
            </div>

            <div className={s.descriptionContainer}>{action.description}</div>

            <div className={s.locationContainer}>
              <div className={s.header}>
                Location Details
              </div>
              <div className={s.detailLine}>{action.location_name}</div>
              <div className={s.detailLine}>{action.street_address}</div>
              <div className={s.detailLine}>{action.street_address2}</div>
              <div className={s.detailLine}>
                {action.city}, {action.state} {action.zipcode}
              </div>
              <div className={s.detailLine}>{action.location_notes}</div>
            </div>

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
                    <RaisedButton
                      onTouchTap={cancelSignup}
                      primary={true}
                      label="Cancel attendance"
                    />
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

            {keywords.length > 0 && (
              <div className={s.keywordsContainer}>
                <div className={s.header}>
                  Keywords:
                </div>
                <div>{keywords}</div>
              </div>
            )}

          </div>
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
    }
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
)(ActionContainer);
