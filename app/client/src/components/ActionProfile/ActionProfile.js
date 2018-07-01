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
  };

  render() {
    if (this.props.action) {
      // Just camel-casing property keys
      const action = Object.assign(
        ...Object.keys(this.props.action).map((k) => ({ [camelCase(k)]: this.props.action[k] })),
      );

      const activities =
        Array.isArray(action.activities) && action.activities.length
          ? action.activities.map((activity, index) => (
              <div key={JSON.stringify(activity)} className={s.activityLine}>
                {activity.description}
              </div>
            ))
          : [];

      const keywords =
        Array.isArray(action.tags) && action.tags.length ? (
          <div className={s.keywordLine}>
            {action.tags.map((tag, index) => (
              <KeywordTag label={tag} type="action" className={s.keywordTag} key={JSON.stringify(tag)} />
            ))}
          </div>
        ) : null;

      const hasUpcomingShifts =
        action.shifts && action.shifts.filter((shift) => moment(shift.end).isAfter(moment())).length > 0;

      try {
        return (
          <div className={s.outerContainer}>
            <div className={s.innerContainer}>
              <div className={s.sectionHeaderContainer}>
                <div className={[s.sectionHeader, s.actionTitle].join(' ')}>
                  <Link to={`/campaign/${action.campaign.slug}`}>{action.campaign.title}</Link>
                </div>
                <div className={s.sectionSubheader}>{action.campaign.profile_subheader}</div>
              </div>

              <div className={s.sectionsContainer}>
                <div className={s.section}>
                  <div className={s.infoBox}>
                    <div className={s.pageSubHeader}>{action.title}</div>
                    {action.description && (
                      <div>
                        {typeof action.description === 'string' &&
                          action.description.trim() !== '' && (
                            <div>
                              <div className={[s.actionDetailsContent, s.bodyText].join(' ')}>{action.description}</div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                  {activities.length > 0 && (
                    <div className={[s.actionDetailsContainer, s.infoBox].join(' ')}>
                      <div className={s.actionDetailsTitle}>Activities and Skills:</div>
                      <div className={s.actionDetailsContent}>{activities}</div>
                    </div>
                  )}
                  {hasUpcomingShifts && (
                    <div className={[s.actionDetailsContainer, s.infoBox].join(' ')}>
                      <div className={s.actionDetailsTitle}>Shift Schedule</div>
                      <div className={[s.actionDetailsContent, s.smallText].join(' ')}>
                        <ShiftGroupList action={action} s={s} />
                      </div>
                    </div>
                  )}
                </div>
                <div className={[s.section, s.sectionSidebar, s.sectionContent].join(' ')}>
                  {action.isOwner ? (
                    <Link to={`/organize/${action.campaign.slug}/opportunity/${action.slug}`} className={s.darkButton}>
                      Edit Opportunity
                    </Link>
                  ) : (
                    <SignupRegisterLogin className={s.desktopSignupRegisterLogin} action={action} />
                  )}
                  {action.owner && (
                    <div>
                      <div className={s.smallHeader}>Get in touch</div>
                      <div className={s.smallText}>
                        {action.owner.first_name} {action.owner.last_name}
                      </div>
                      <div className={s.smallText}>
                        <Link to={`mailto:${action.owner.email}`} mailTo external useAhref>
                          {action.owner.email}
                        </Link>
                      </div>
                    </div>
                  )}

                  {(action.locationName || action.streetAddress || (action.city && action.state && action.zipcode)) && (
                    <div>
                      <div className={s.smallHeader}>Location</div>
                      <div className={s.smallText}>
                        {action.locationName && <div>{action.locationName}</div>}

                        {action.streetAddress && <div>{action.streetAddress}</div>}

                        {action.streetAddress2 && <div>{action.streetAddress2}</div>}

                        {action.city &&
                          action.state &&
                          action.zipcode && (
                            <div>
                              {action.city}, {action.state} {action.zipcode}
                            </div>
                          )}

                        {action.locationNotes && <div>{action.locationNotes}</div>}
                      </div>
                    </div>
                  )}

                  {keywords && (
                    <div>
                      <div className={s.smallHeader}>Keywords</div>
                      <div className={s.actionDetailsContent}>{keywords}</div>
                    </div>
                  )}
                </div>
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
