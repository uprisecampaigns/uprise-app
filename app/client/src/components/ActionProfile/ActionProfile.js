import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import camelCase from 'camelcase';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';
import KeywordTag from 'components/KeywordTag';
import SignupRegisterLogin from 'components/SignupRegisterLogin';
import ShiftGroupList from 'components/ShiftGroupList';

import s from 'styles/Profile.scss';


class ActionProfile extends PureComponent {
  static propTypes = {
    action: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.action) {
      // Just camel-casing property keys
      const action = Object.assign(...Object.keys(this.props.action).map(k => ({ [camelCase(k)]: this.props.action[k] })));

      const activities = (Array.isArray(action.activities) && action.activities.length) ?
        action.activities.map((activity, index) => <div key={JSON.stringify(activity)} className={s.activityLine}>{activity.description}</div>) :
        [];

      const keywords = (Array.isArray(action.tags) && action.tags.length) ? (
        <div className={s.keywordLine}>
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

      const hasUpcomingShifts = (action.shifts &&
        action.shifts.filter(shift => moment(shift.end).isAfter(moment())).length > 0);

      try {
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
                  action={action}
                />
              </div>

              <div className={s.alternatingBackgroundsContainer}>

                { /* Commenting until I can convince Antonia to keep it
                <div className={s.actionDetailsContainer}>
                  <div className={s.actionDetailsTitle}>About this Volunteer Event</div>
                  { (typeof action.description === 'string' && action.description.trim() !== '') &&
                    <div className={s.actionDetailsContent}>{action.description}</div>
                  }

                  <div className={s.detailsNumbersContainer}>
                    <div className={s.detailsNumbers}>
                      <div className={s.detailsNumbersHeader}>Keywords</div>
                      <div className={s.detailsNumbersNumber}>{action.tags.length}</div>
                    </div>

                    { action.distance && (
                      <div className={s.detailsNumbers}>
                        <div className={s.detailsNumbersHeader}>Miles away</div>
                        <div className={s.detailsNumbersNumber}>{action.distance}</div>
                      </div>
                    )}
                  </div>
                </div>

                */ }

                { (action.locationName || action.streetAddress || (action.city && action.state && action.zipcode)) && (
                  <div className={s.actionDetailsContainer}>
                    <div className={s.actionDetailsTitle}>
                      Location
                    </div>
                    <div className={s.actionDetailsContent}>
                      {action.locationName &&
                        <div>{action.locationName}</div>
                      }

                      {action.streetAddress &&
                        <div>{action.streetAddress}</div>
                      }

                      {action.streetAddress2 &&
                        <div>{action.streetAddress2}</div>
                      }

                      { (action.city && action.state && action.zipcode) && (
                        <div>
                          {action.city}, {action.state} {action.zipcode}
                        </div>
                      )}

                      {action.locationNotes &&
                        <div>{action.locationNotes}</div>
                      }
                    </div>
                  </div>
                )}

                { activities.length > 0 && (
                  <div className={s.actionDetailsContainer}>
                    <div className={s.actionDetailsTitle}>
                      Activities and Skills Needed:
                    </div>
                    <div className={s.actionDetailsContent}>{activities}</div>
                  </div>
                )}

                { keywords && (
                  <div className={s.actionDetailsContainer}>
                    <div className={s.actionDetailsTitle}>
                      Keywords:
                    </div>
                    <div className={s.actionDetailsContent}>{keywords}</div>
                  </div>
                )}

                { hasUpcomingShifts && (
                  <div className={s.actionDetailsContainer}>
                    <div className={s.actionDetailsTitle}>
                    Shift Schedule
                    </div>
                    <div className={s.actionDetailsContent}>
                      <ShiftGroupList action={action} s={s} />
                    </div>
                  </div>
                )}

                { action.owner && (
                  <div className={s.actionDetailsContainer}>
                    <div className={s.actionDetailsTitle}>
                      Get in touch
                    </div>
                    <div>{action.owner.first_name} {action.owner.last_name} - Contact Coordinator</div>
                    <div>
                      <Link to={`mailto:${action.owner.email}`} mailTo external useAhref>
                        {action.owner.email}
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      } catch (e) {
        console.error(`Error rendering ActionProfile: ${e.message}`);
      }
    }
    return null;
  }
}

export default ActionProfile;
