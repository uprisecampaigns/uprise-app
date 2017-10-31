import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment-timezone';
import camelCase from 'camelcase';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

import timeWithZone from 'lib/timeWithZone';
import itemsSort from 'lib/itemsSort';

import Link from 'components/Link';
import KeywordTag from 'components/KeywordTag';
import SignupRegisterLogin from 'components/SignupRegisterLogin';
import AddToCalendar from 'components/AddToCalendar';

import s from 'styles/Profile.scss';


class ActionProfile extends PureComponent {
  static propTypes = {
    action: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
    cancelSignup: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired,
  }

  render() {
    if (this.props.action) {
      const {
        saving, signup, cancelSignup,
      } = this.props;

      // Just camel-casing property keys
      const action = Object.assign(...Object.keys(this.props.action).map((k) => {
        return { [camelCase(k)]: this.props.action[k] };
      }));

      const activities = (Array.isArray(action.activities) && action.activities.length) ?
        action.activities.map((activity, index) => <div key={JSON.stringify(activity)} className={s.detailLine}>{activity.description}</div>) :
        [];

      const shiftGroups = (Array.isArray(action.shifts) && action.shifts.length) ?
        [...action.shifts]
          .filter(shift => moment(shift.end).isAfter(moment()))
          .sort(itemsSort({ name: 'shiftDate' }))
          .reduce((result, shift) => ({ // performs "group by date"
            ...result,
            [moment(shift.start).startOf('day').toDate()]: [
              ...(result[moment(shift.start).startOf('day').toDate()] || []),
              shift,
            ],
          }), {}) : [];

      const shiftDisplay = Object.keys(shiftGroups).map((date, index) => {
        const shiftGroup = shiftGroups[date];
        const dateString = timeWithZone(date, action.zipcode, 'ddd MMM Do');

        const shiftLines = shiftGroup.map((shift, shiftIndex) => (
          <div key={JSON.stringify(shift)}>
            {timeWithZone(shift.start, action.zipcode, 'h:mm')} - {timeWithZone(shift.end, action.zipcode, 'h:mm a z')}
          </div>
        ));

        return (
          <div key={JSON.stringify(shiftGroup)} className={s.detailLine}>
            {dateString}:
            <div>
              {shiftLines}
            </div>
          </div>
        );
      });

      const keywords = (Array.isArray(action.tags) && action.tags.length) ? (
        <div className={s.detailLine}>
          {action.tags.map((tag, index) => (
            <KeywordTag
              label={tag}
              type="action"
              className={s.keywordTag}
              key={JSON.stringify(tag)}
            />
          ))}
        </div>
      ) : null;


      const startTime = moment(action.startTime);
      const endTime = moment(action.endTime);

      const startTimeString = timeWithZone(startTime, action.zipcode, 'h:mma');
      const endTimeString = timeWithZone(endTime, action.zipcode, 'h:mma z');

      return (
        <div className={s.outerContainer}>

          { action.isOwner && (
            <Link to={`/organize/${action.campaign.slug}/opportunity/${action.slug}`}>
              <div className={s.navHeader}>
                <FontIcon
                  className={['material-icons', s.backArrow].join(' ')}
                >arrow_back
                </FontIcon>
                {action.title}
              </div>
            </Link>
          )}

          <div className={s.innerContainer}>

            <div className={s.actionTitleSignupContainer}>
              <div className={s.actionHeaderContainer}>
                <div className={s.actionTitle}>{action.title}</div>
                <Link to={`/campaign/${action.campaign.slug}`}>
                  <div className={s.actionSubheader}>{action.campaign.title}</div>
                </Link>
              </div>
              <SignupRegisterLogin 
                className={s.desktopSignupRegisterLogin}
                attending={action.attending}
                shifts={action.shifts}
                handleSignup={signup}
              />
            </div>

            <div className={s.aboutContainer}>
              <div className={s.aboutTitle}>About this Volunteer Event</div>
              { (typeof action.description === 'string' && action.description.trim() !== '') &&
                <div className={s.descriptionText}>{action.description}</div>
              }
            </div>

            <div className={s.attendingContainer}>
              {saving ? (
                <div className={s.savingThrobberContainer}>
                  <CircularProgress
                    size={100}
                    thickness={5}
                  />
                </div>
              ) : (
                <div>
                  { action.attending ? (
                    <div>

                      { !action.ongoing && (startTime.isValid() && endTime.isValid()) && (
                        <AddToCalendar className={s.calendarLinkContainer} event={action}>
                          <FlatButton
                            label="Add to Calendar"
                            secondary
                            icon={<FontIcon className="material-icons">add_circle_outline</FontIcon>}
                          />
                        </AddToCalendar>
                      )}

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

            { (startTime.isValid() && endTime.isValid()) && (
              <div>
                <div className={s.dateTimePlaceContainer}>{startTime.format('ddd, MMM Do, YYYY')}</div>
                <div className={s.dateTimePlaceContainer}>{startTimeString} - {endTimeString}</div>
              </div>
            )}

            { (action.city && action.state) &&
              <div className={s.dateTimePlaceContainer}>{action.city}, {action.state}</div>
            }
            { action.owner && (
              <div className={s.contactContainer}>
                Contact Coordinator: {action.owner.firstName} {action.owner.lastName}
                <Link to={`mailto:${action.owner.email}`} mailTo external useAhref>
                  {action.owner.email}
                </Link>
              </div>
            )}

            { (action.locationName || action.streetAddress || (action.city && action.state && action.zipcode)) && (
              <div className={s.locationContainer}>
                <div className={s.header}>
                  Location Details
                </div>
                {action.locationName &&
                  <div className={s.detailLine}>{action.locationName}</div>
                }

                {action.streetAddress &&
                  <div className={s.detailLine}>{action.streetAddress}</div>
                }

                {action.streetAddress2 &&
                  <div className={s.detailLine}>{action.streetAddress2}</div>
                }

                { (action.city && action.state && action.zipcode) && (
                  <div className={s.detailLine}>
                    {action.city}, {action.state} {action.zipcode}
                  </div>
                )}

                {action.locationNotes &&
                  <div className={s.detailLine}>{action.locationNotes}</div>
                }
              </div>
            )}

            { activities.length > 0 && (
              <div className={s.activitiesContainer}>
                <div className={s.header}>
                  Activities and Skills Needed:
                </div>
                <div>{activities}</div>
              </div>
            )}

            { shiftDisplay.length > 0 && (
              <div className={s.shiftsContainer}>
                <div className={s.header}>
                Shift Schedule
                </div>
                <div>{shiftDisplay}</div>
              </div>
            )}

            { keywords && (
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
    }
    return null;
  }
}

export default ActionProfile;
