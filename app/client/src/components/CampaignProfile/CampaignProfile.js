import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';

import itemsSort from 'lib/itemsSort';
import withTimeWithZone from 'lib/withTimeWithZone';

import Link from 'components/Link';
import KeywordTag from 'components/KeywordTag';

import s from 'styles/Profile.scss';


class CampaignProfile extends PureComponent {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    subscribe: PropTypes.func.isRequired,
    cancelSubscription: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired,
    timeWithZone: PropTypes.func.isRequired,
  }

  render() {
    if (this.props.campaign) {
      const {
        campaign, saving, subscribe, cancelSubscription, timeWithZone,
      } = this.props;

      const keywords = (Array.isArray(campaign.tags) && campaign.tags.length) ? (
        <div className={s.detailLine}>
          {campaign.tags.map((tag, index) => (
            <KeywordTag
              label={tag}
              key={index}
              type="campaign"
              className={s.keywordTag}
            />
          ))}
        </div>
      ) : null;

      const actions = (Array.isArray(campaign.actions) && campaign.actions.length > 0) ?
        Array.from(campaign.actions)
          .filter(a => (moment(a.end_time).isAfter(moment()) || a.ongoing))
          .sort(itemsSort({ name: 'date', descending: false }))
          .map((action) => {
            if (action.ongoing) {
              return (
                <Link to={`/opportunity/${action.slug}`} key={action.id}>
                  <div className={[s.detailLine, s.actionListing].join(' ')}>
                    <div>
                      {action.title}
                    </div>
                    <div>
                      {action.city}{action.state && `, ${action.state}`}
                    </div>
                  </div>
                </Link>
              );
            } else if (action.start_time && action.end_time) {
              const startTime = moment(action.start_time);
              const endTime = moment(action.end_time);

              const startTimeString = timeWithZone(startTime, action.zipcode, 'h:mma');
              const endTimeString = timeWithZone(endTime, action.zipcode, 'h:mma z');

              return (
                <Link to={`/opportunity/${action.slug}`} key={action.id}>
                  <div className={[s.detailLine, s.actionListing].join(' ')}>
                    <div>
                      {action.title}
                    </div>
                    <div>
                      {startTime.format('MMM Do, YYYY')}, {startTimeString} - {endTimeString}
                      {action.city && `, ${action.city}`}{action.state && `, ${action.state}`}
                    </div>
                  </div>
                </Link>
              );
            } return null;
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
                      onClick={cancelSubscription}
                      primary
                      label="Cancel Subscription"
                    />
                  ) : (
                    <RaisedButton
                      onClick={subscribe}
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

export default withTimeWithZone(CampaignProfile);
