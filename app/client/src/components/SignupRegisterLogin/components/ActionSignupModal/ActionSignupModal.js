import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import isEqual from 'lodash.isequal';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

import Link from 'components/Link';

import withTimeWithZone from 'lib/withTimeWithZone';

import { notify } from 'actions/NotificationsActions';
import { closedModal } from 'actions/ActionSignupActions';

import MeQuery from 'schemas/queries/MeQuery.graphql';
import ActionSignupMutation from 'schemas/mutations/ActionSignupMutation.graphql';
import CancelActionSignupMutation from 'schemas/mutations/CancelActionSignupMutation.graphql';


export class ActionSignupModal extends Component {
  static propTypes = {
    action: PropTypes.object,
    userObject: PropTypes.object.isRequired,
    timeWithZone: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired,
    cancelAttendance: PropTypes.func.isRequired,
  }

  static defaultProps = {
    action: undefined,
  }

  constructor(props) {
    super(props);

    const { action } = props;

    const startingPage = action.ongoing ? 1 : 0;
    const shifts = Array.isArray(action.shifts) ? [...action.shifts].map(this.mapShift) : [];

    if (Array.isArray(action.signedUpShifts)) {
      action.signedUpShifts.forEach((signedUpShift) => {
        shifts.find(s => s.id === signedUpShift.id).selected = true;
      });
    }

    this.state = {
      agreeToShare: false,
      page: startingPage,
      shifts,
      attending: action.attending,
    };
  }

  mapShift = shift => ({
    id: shift.id,
    start: shift.start,
    end: shift.end,
    selected: shift.selected,
  })

  toggleCheck = (shift) => {
    const shifts = [...this.state.shifts].map(this.mapShift);

    // eslint-disable-next-line no-restricted-syntax
    for (const s of shifts) {
      if (isEqual(s, this.mapShift(shift))) {
        s.selected = !s.selected;
      }
    }

    this.setState({ shifts });
  }

  selectShifts = () => {
    if (this.state.shifts.filter(s => s.selected).length) {
      this.setState({ page: 1 });
    } else {
      this.props.dispatch(notify('Please select at least one shift'));
    }
  }

  confirmSignup = async () => {
    if (this.state.agreeToShare) {
      try {
        await this.props.signup({
          variables: {
            actionId: this.props.action.id,
            shifts: this.state.shifts.filter(s => s.selected).map(s => ({ id: s.id, start: s.start, end: s.end })),
          },
          // TODO: decide between refetch and update
          refetchQueries: ['ActionCommitmentsQuery', 'SignedUpVolunteersQuery', 'ActionQuery'],
        });

        this.props.dispatch(notify('Signed up!'));
        this.setState({ page: 2 });
      } catch (e) {
        console.error(e);
        this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      }
    } else {
      this.props.dispatch(notify('In order to sign up for this, you must agree to share your contact info.'));
    }
  }

  cancelAttendance = async () => {
    try {
      await this.props.cancelAttendance({
        variables: {
          actionId: this.props.action.id,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionCommitmentsQuery', 'SignedUpVolunteersQuery', 'ActionQuery'],
      });

      this.setState({ page: 2 });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
    }
  }

  formatShiftLine = (shift) => {
    const { action, timeWithZone } = this.props;

    return `${timeWithZone(shift.start, action.zipcode, 'ddd MMM Do: h:mm')} - ${timeWithZone(shift.end, action.zipcode, 'h:mm a z')}`;
  }

  render() {
    const { action, userObject } = this.props;

    const {
      shifts, page,
      agreeToShare, attending,
    } = this.state;

    const {
      toggleCheck, selectShifts, confirmSignup, formatShiftLine, cancelAttendance,
    } = this;

    switch (page) {
      case 0: {
        const shiftsList = shifts.map((shift) => {
          const timeDisplay = formatShiftLine(shift);

          return (
            <div key={JSON.stringify(shift)}>
              <Checkbox
                label={timeDisplay}
                checked={shift.selected}
                onCheck={() => toggleCheck(shift)}
              />
            </div>
          );
        });

        return (
          <div>
            <div>Select Shifts</div>
            { shiftsList }
            { attending &&
              <FlatButton
                label="I can no longer attend this"
                onClick={cancelAttendance}
              />
            }
            <FlatButton
              label="Continue"
              onClick={selectShifts}
            />
          </div>
        );
      }

      case 1: {
        return (
          <div>
            { attending ? (
              <div>Confirm Changes</div>
            ) : (
              <div>Almost there!</div>
            )}

            <div>{ action.title }</div>

            { !action.ongoing && (
              <div>
                <div>Shifts selected</div>
                { shifts.filter(s => s.selected).map(shift => (
                  <div key={JSON.stringify(shift)}>
                    { formatShiftLine(shift) }
                  </div>
                ))}
              </div>
            )}
            <div>Your Name:</div>
            <div>{userObject.first_name} {userObject.last_name}</div>
            <div>Your Email:</div>
            <div>{userObject.email}</div>

            <Checkbox
              label="Share my contact details with the campaign manager"
              checked={agreeToShare}
              onCheck={() => this.setState({ agreeToShare: !agreeToShare })}
            />

            <FlatButton
              label="Sign up now"
              onClick={confirmSignup}
            />

          </div>
        );
      }

      case 2: {
        if (attending) {
          return (
            <div>
              <div>Your scheduled shifts have been successfully changed.</div>
              <div>
                Lorem Ipsum
              </div>
              <FlatButton
                label="Done"
                onClick={e => this.props.dispatch(closedModal())}
              />
            </div>
          );
        }

        return (
          <div>
            <div>You&apos;ve been signed up</div>
            <div>
              Thank you so much for signing up. Saved events will show up
              in your profile so you can easily view them later.
            </div>
            <Link
              to="/volunteer/opportunity-commitments"
              useAhref={false}
            >
              <FlatButton
                label="View Events"
              />
            </Link>
          </div>
        );
      }

      default: {
        return null;
      }
    }
  }
}

const mapStateToProps = state => ({
  action: state.actionSignup.action,
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingAuthUpdate: state.userAuthSession.fetchingAuthUpdate,
});


const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : {
      email: '',
    },
  }),
  skip: ownProps => !ownProps.loggedIn && !ownProps.fetchingAuthUpdate,
});

export default compose(
  withTimeWithZone,
  connect(mapStateToProps),
  withMeQuery,
  graphql(ActionSignupMutation, { name: 'signup' }),
  graphql(CancelActionSignupMutation, { name: 'cancelAttendance' }),
)(ActionSignupModal);
