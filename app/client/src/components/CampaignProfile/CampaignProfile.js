import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';

import itemsSort from 'lib/itemsSort';

import Link from 'components/Link';
import KeywordTag from 'components/KeywordTag';
import ShiftGroupList from 'components/ShiftGroupList';

import s from 'styles/Profile.scss';

class CampaignProfile extends PureComponent {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    subscribe: PropTypes.func.isRequired,
    cancelSubscription: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired,
  };

  render() {
    if (this.props.campaign) {
      const { campaign, saving, subscribe, cancelSubscription } = this.props;

      const keywords =
        Array.isArray(campaign.tags) && campaign.tags.length ? (
          <div className={s.detailLine}>
            {campaign.tags.map((tag, index) => (
              <KeywordTag label={tag} key={JSON.stringify(tag)} type="campaign" className={s.keywordTag} />
            ))}
          </div>
        ) : null;

      const actions =
        Array.isArray(campaign.actions) && campaign.actions.length > 0
          ? Array.from(campaign.actions)
              .filter((action) => {
                if (action.ongoing) {
                  return true;
                }

                let hasUpcomingShift = false;
                if (action.shifts) {
                  action.shifts.forEach((shift) => {
                    if (moment(shift.end).isAfter(moment())) {
                      hasUpcomingShift = true;
                    }
                  });
                }

                return hasUpcomingShift;
              })
              .sort(itemsSort({ name: 'date', descending: false }))
              .map((action) => {
                const shiftLines =
                  action.shifts && action.shifts.length ? <ShiftGroupList action={action} s={s} /> : null;

                return (
                  <Link to={`/opportunity/${action.slug}`} key={action.id}>
                    <div className={[s.detailLine, s.actionListing].join(' ')}>
                      <div className={s.listHeader}>{action.title}</div>
                      <div className={s.listContent}>
                        {shiftLines}
                        {action.city}
                        {action.state && `, ${action.state}`}
                      </div>
                    </div>
                  </Link>
                );
              })
          : [];

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            {/*
            {campaign.is_owner && (
              <Link to={`/organize/${campaign.slug}`}>
                <div className={s.navHeader}>
                  <FontIcon className={['material-icons', s.backArrow].join(' ')}>arrow_back</FontIcon>
                  {campaign.title}
                </div>
              </Link>
            )}
          */}

            <div className={s.sectionsContainer}>
              <div className={s.section}>
                <div className={s.sectionContent}>
                  {campaign.profile_image_url && (
                    <div className={s.profileImageContainer}>
                      <img
                        alt={`${campaign.title} Profile`}
                        src={campaign.profile_image_url}
                        className={s.profileImage}
                      />
                    </div>
                  )}


                  {campaign.description && (
                    <div className={s.sectionHeader}>Learn More</div>
                    <div className={s.actionDetailsContainer}>
                      {typeof campaign.description === 'string' &&
                        campaign.description.trim() !== '' && (
                          <div>
                            <div className={[s.actionDetailsContent, s.bodyText].join(' ')}>{campaign.description}</div>
                          </div>
                        )}
                    </div>
                  )}
                </div>

                {actions.length > 0 && (
                  <div className={s.sectionContent}>
                    <div className={s.sectionHeader}>Volunteer Opportunities</div>
                    <div className={s.actionDetailsContainer}>
                      <div className={[s.actionDetailsContent, s.smallText].join(' ')}>{actions}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className={[s.section, s.sectionSidebar, s.sectionContent].join(' ')}>
                {campaign.is_owner ? (
                  <Link to={`/organize/${campaign.slug}/settings`} className={s.darkButton}>
                    Edit Profile
                  </Link>
                ) : (
                  <div>
                    {saving ? (
                      <div className={s.savingThrobberContainer}>
                        <CircularProgress size={100} thickness={5} />
                      </div>
                    ) : (
                      <div>
                        {campaign.subscribed ? (
                          <div
                            className={s.button}
                            onClick={cancelSubscription}
                            onKeyPress={cancelSubscription}
                            role="button"
                            tabIndex="0"
                          >
                            Cancel Subscription
                          </div>
                        ) : (
                          <div
                            className={s.primaryButton}
                            onClick={subscribe}
                            onKeyPress={subscribe}
                            role="button"
                            tabIndex="0"
                          >
                            Subscribe
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className={s.smallHeader}>Get in touch</div>
                {campaign.owner && (
                  <div>
                    <div className={s.smallText}>
                      {campaign.owner.first_name} {campaign.owner.last_name}
                    </div>
                    {campaign.owner.email && (
                      <div className={s.smallText}>
                        <Link to={`mailto:${campaign.owner.email}`} mailTo external useAhref>
                          {campaign.owner.email}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                {campaign.website_url && (
                  <div className={s.smallText}>
                    <Link to={campaign.website_url} external useAhref>
                      {campaign.website_url}
                    </Link>
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
    }
    return null;
  }
}

export default CampaignProfile;
