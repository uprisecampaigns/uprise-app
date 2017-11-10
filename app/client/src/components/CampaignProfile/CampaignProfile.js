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
  }

  render() {
    if (this.props.campaign) {
      const {
        campaign, saving, subscribe, cancelSubscription,
      } = this.props;

      const keywords = (Array.isArray(campaign.tags) && campaign.tags.length) ? (
        <div className={s.detailLine}>
          {campaign.tags.map((tag, index) => (
            <KeywordTag
              label={tag}
              key={JSON.stringify(tag)}
              type="campaign"
              className={s.keywordTag}
            />
          ))}
        </div>
      ) : null;

      const actions = (Array.isArray(campaign.actions) && campaign.actions.length > 0) ?
        Array.from(campaign.actions)
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
            const shiftLines = (action.shifts && action.shifts.length) ?
              <ShiftGroupList action={action} s={s} /> : null;

            return (
              <Link to={`/opportunity/${action.slug}`} key={action.id}>
                <div className={[s.detailLine, s.actionListing].join(' ')}>
                  <div className={s.listHeader}>
                    {action.title}
                  </div>
                  <div className={s.listContent}>
                    {shiftLines}
                    {action.city}{action.state && `, ${action.state}`}
                  </div>
                </div>
              </Link>
            );
          }) : [];


      return (
        <div className={s.outerContainer}>

          { campaign.is_owner && (

            <Link to={`/organize/${campaign.slug}`}>
              <div className={s.navHeader}>
                <FontIcon
                  className={['material-icons', s.backArrow].join(' ')}
                >arrow_back
                </FontIcon>
                {campaign.title}
              </div>
            </Link>

          )}

          <div className={s.innerContainer}>

            <div className={s.profileHeaderContainer}>
              <div className={s.titleContainer}>{campaign.title}</div>
            </div>

            { campaign.profile_image_url && (
              <div className={s.profileImageContainer}>
                <img alt={`${campaign.title} Profile`} src={campaign.profile_image_url} className={s.profileImage} />
              </div>
            )}

            { campaign.profile_subheader && (
              <div className={s.profileSubheaderContainer}>
                {campaign.profile_subheader}
              </div>
            )}

            { campaign.website_url && (
              <div className={s.websiteUrlContainer}>
                <Link to={campaign.website_url} external useAhref>
                  {campaign.website_url}
                </Link>
              </div>
            )}

            <div className={s.subscribedContainer}>
              {saving ? (
                <div className={s.savingThrobberContainer}>
                  <CircularProgress
                    size={100}
                    thickness={5}
                  />
                </div>
              ) : (
                <div>
                  {campaign.subscribed ? (
                    <RaisedButton
                      onTouchTap={cancelSubscription}
                      primary
                      label="Cancel Subscription"
                    />
                  ) : (
                    <RaisedButton
                      onTouchTap={subscribe}
                      primary
                      label="Subscribe"
                    />
                  )}
                </div>
              )}
            </div>

            { (typeof campaign.description === 'string' && campaign.description.trim() !== '') &&
              <div className={s.descriptionContainer}>{campaign.description}</div>
            }

            { campaign.owner && (
              <div className={s.contactContainer}>
                Contact Coordinator:
                <Link to={`mailto:${campaign.owner.email}`} external mailTo useAhref>
                  {campaign.owner.first_name} {campaign.owner.last_name}
                </Link>
              </div>
            )}

            { (actions.length > 0) && (
              <div className={s.actionsContainer}>
                <div className={s.header}>
                  Upcoming Opportunities:
                </div>
                <div>{actions}</div>
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

export default CampaignProfile;
