/* eslint-disable max-len */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import withTimeWithZone from 'lib/withTimeWithZone';

import { notify } from 'actions/NotificationsActions';
import { closedModal } from 'actions/ActionSignupActions';

import MeQuery from 'schemas/queries/MeQuery.graphql';
import ActionSignupMutation from 'schemas/mutations/ActionSignupMutation.graphql';
import CancelActionSignupMutation from 'schemas/mutations/CancelActionSignupMutation.graphql';

import s from 'styles/SignupRegisterLogin.scss';


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
        shifts.find(shift => shift.id === signedUpShift.id).selected = true;
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

  toggleCheck = (toggleShift) => {
    const shifts = [...this.state.shifts].map(this.mapShift);

    // eslint-disable-next-line no-restricted-syntax
    for (const shift of shifts) {
      if (isEqual(shift, this.mapShift(toggleShift))) {
        shift.selected = !shift.selected;
      }
    }

    this.setState({ shifts });
  }

  selectShifts = () => {
    if (this.state.shifts.filter(shift => shift.selected).length) {
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
            shifts: this.state.shifts.filter(shift => shift.selected).map(shift => ({ id: shift.id, start: shift.start, end: shift.end })),
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
        const shiftsList = [...shifts]
          .filter(shift => moment(shift.start).isAfter(moment()))
          .map((shift) => {
            const timeDisplay = formatShiftLine(shift);

            return (
              <div key={JSON.stringify(shift)}>
                <Checkbox
                  label={timeDisplay}
                  checked={shift.selected}
                  onCheck={() => toggleCheck(shift)}
                  className={s.shiftCheckbox}
                />
              </div>
            );
          });

        return (
          <div className={s.container}>
            <div className={s.header}>Select Shifts</div>

            { shiftsList }

            <Divider />

            <div className={s.buttonContainer}>
              { attending &&
                <div
                  className={s.cancelButton}
                  onClick={cancelAttendance}
                  onKeyPress={cancelAttendance}
                  role="button"
                  tabIndex="0"
                >
                  I can no longer attend this event
                </div>
              }

              <div
                className={s.button}
                onClick={selectShifts}
                onKeyPress={selectShifts}
                role="button"
                tabIndex="0"
              >
                Continue
              </div>
            </div>
          </div>
        );
      }

      case 1: {
        if (attending && action.ongoing) {
          return (
            <div className={s.container}>
              <div className={s.header}>Cancel</div>

              <div className={s.content}>
                <div>{ action.title }</div>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
              </div>

              <Divider />

              <div
                className={s.cancelButton}
                onClick={cancelAttendance}
                onKeyPress={cancelAttendance}
                role="button"
                tabIndex="0"
              >
                I can no longer fill this role
              </div>
            </div>
          );
        }

        return (
          <div className={s.container}>
            { attending ? (
              <div className={s.header}>Confirm Changes</div>
            ) : (
              <div className={s.header}>Almost there!</div>
            )}

            <div className={s.content}>
              <div>{ action.title }</div>

              { !action.ongoing && (
                <div>
                  <div className={s.label}>Shifts selected</div>
                  { shifts.filter(shift => shift.selected).map(shift => (
                    <div key={JSON.stringify(shift)}>
                      { formatShiftLine(shift) }
                    </div>
                  ))}
                </div>
              )}
              <div className={s.label}>Your Name:</div>
              <div>{userObject.first_name} {userObject.last_name}</div>
              <div className={s.label}>Your Email:</div>
              <div>{userObject.email}</div>
            </div>

            <Divider />

            <Checkbox
              label="Share my contact details with the campaign manager"
              checked={agreeToShare}
              onCheck={() => this.setState({ agreeToShare: !agreeToShare })}
              className={s.checkbox}
            />

            <div
              className={s.button}
              onClick={confirmSignup}
              onKeyPress={confirmSignup}
              role="button"
              tabIndex="0"
            >
              Sign up now
            </div>

          </div>
        );
      }

      case 2: {
        if (attending) {
          return (
            <div className={s.container}>
              <div className={s.header}>Your scheduled shifts have been successfully changed.</div>
              <div className={s.content}>
                Lorem Ipsum
              </div>

              <div
                className={s.button}
                onClick={e => this.props.dispatch(closedModal())}
                onKeyPress={e => this.props.dispatch(closedModal())}
                role="button"
                tabIndex="0"
              >
                Done
              </div>
            </div>
          );
        }

        return (
          <div className={s.container}>
            <div className={s.header}>You&apos;ve been signed up</div>

            <div className={s.content}>
              Thank you so much for signing up. Saved events will show up
              in your profile so you can easily view them later.
            </div>

            <Divider />

            <Link
              to="/volunteer/opportunity-commitments"
              useAhref={false}
            >
              <div
                className={s.button}
                onClick={e => this.props.dispatch(closedModal())}
                onKeyPress={e => this.props.dispatch(closedModal())}
                role="button"
                tabIndex="0"
              >
                View Events
              </div>
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
