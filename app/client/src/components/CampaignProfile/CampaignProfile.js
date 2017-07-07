import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment-timezone';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';

import timeWithZone from 'lib/timeWithZone';

import Link from 'components/Link';

import s from 'styles/Profile.scss';


class CampaignProfile extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    campaign: PropTypes.object.isRequired,
    subscribe: PropTypes.func.isRequired,
    cancelSubscription: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired
  }

  render() {

    if (this.props.campaign) {

      const { campaign, saving, subscribe, cancelSubscription, ...props } = this.props;

      const keywords = (Array.isArray(campaign.tags) && campaign.tags.length > 0) ? (
        <div className={s.detailLine}>{campaign.tags.join(', ')}</div>
      ) : '';

      const issues = (Array.isArray(campaign.issue_areas) && campaign.issue_areas.length > 0) ? (
        <div className={s.detailLine}>{campaign.issue_areas.map(issue => issue.title).join(', ')}</div>
      ) : '';

      const actions = (Array.isArray(campaign.actions) && campaign.actions.length > 0) ? campaign.actions.map(action => {

        if (action.ongoing) {
          return (
            <Link to={'/action/' + action.slug} key={action.id}>
              <div className={[s.detailLine, s.actionListing].join(' ')}>
                {action.title}{action.city && ', ' + action.city}{action.state && ', ' + action.state}
              </div>
            </Link>
          );
        } else if (action.start_time && action.end_time) {
          const startTime = moment(action.start_time);
          const endTime = moment(action.end_time);

          const startTimeString = timeWithZone(startTime, action.zipcode, 'h:mma');
          const endTimeString = timeWithZone(endTime, action.zipcode, 'h:mma z');

          return (
            <Link to={'/action/' + action.slug} key={action.id}>
              <div className={[s.detailLine, s.actionListing].join(' ')}>
                {action.title}, {startTime.format('MMM Do, YYYY')}, {startTimeString} - {endTimeString}{action.city && ', ' + action.city}{action.state && ', ' + action.state}
              </div>
            </Link>
          );
        } else return null;
      }) : '';


      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>

            <div className={s.profileHeaderContainer}>
              <div className={s.titleContainer}>{campaign.title}</div>
              { campaign.is_owner && (
                <div className={s.settingsIcon}>
                  <Link to={'/organize/' + campaign.slug}>
                    <FontIcon
                      className={["material-icons"].join(' ')}
                    >settings</FontIcon>
                  </Link>
                </div>
              )}
            </div>

            { campaign.profile_image_url && (
              <div className={s.profileImageContainer}>
                <img src={campaign.profile_image_url} className={s.profileImage}/>
              </div>
            )}

            { campaign.profile_subheader && (
              <div className={s.profileSubheaderContainer}>
                {campaign.profile_subheader}
              </div>
            )}

            { campaign.website_url && (
              <div className={s.websiteUrlContainer}>
                <Link to={campaign.website_url} external={true} useAhref={true}>
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
                      primary={true}
                      label="Cancel Subscription"
                    />
                  ) : (
                    <RaisedButton
                      onTouchTap={subscribe}
                      primary={true}
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
                <Link to={'mailto:' + campaign.owner.email} external={true} mailTo={true} useAhref={true}>
                  {campaign.owner.first_name} {campaign.owner.last_name}
                </Link>
              </div>
            )}

            {actions && (
              <div className={s.actionsContainer}>
                <div className={s.header}>
                  Upcoming Actions:
                </div>
                <div>{actions}</div>
              </div>
            )}

            {issues && (
              <div className={s.issuesContainer}>
                <div className={s.header}>
                  Issues:
                </div>
                <div>{issues}</div>
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
        </div>
      );
    } else {
      return null;
    }
  }
}

export default CampaignProfile;
