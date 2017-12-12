import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import { Tabs, Tab } from 'material-ui/Tabs';

import itemsSort from 'lib/itemsSort';
import withTimeWithZone from 'lib/withTimeWithZone';

import Link from 'components/Link';
import KeywordTag from 'components/KeywordTag';

import inkBarStyle from 'styles/tabInkBarStyle';
import s from 'styles/UserProfile.scss';


class UserProfile extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    activeTab: PropTypes.string,
  }

  static defaultProps = {
    activeTab: 'interests',
  }

  render() {
    const { user, activeTab, handleTabChange } = this.props;

    let infoBoxContent;

    switch (activeTab) {
      case 'interests': {
        infoBoxContent = (Array.isArray(user.activities) && user.activities.length) ?
          user.activities.map((activity, index) => <div key={JSON.stringify(activity)} className={s.infoBoxLine}>{activity.description}</div>) :
          null;
        break;
      }
      case 'opportunities': {
        infoBoxContent = 'Opportunities!';
        infoBoxContent = (Array.isArray(user.actions) && action.actions.length) ?
          user.actions.map((action, index) => <div key={JSON.stringify(action)} className={s.infoBoxLine}>{action.title}</div>) :
          null;
        break;
      }
      case 'campaigns': {
        infoBoxContent = (Array.isArray(user.campaigns) && action.campaigns.length) ?
          user.campaigns.map((campaign, index) => <div key={JSON.stringify(campaign)} className={s.infoBoxLine}>{campaign.title}</div>) :
          null;
        break;
      }
      default: {
        infoBoxContent = null;
      }
    }

    return (
      <div className={s.userProfileContainer}>
        <div className={s.leftContent}>

          { user.profile_image_url && (
            <div className={s.profileImageContainer}>
              <img
                src={user.profile_image_url}
                className={s.profileImage}
                alt="User Profile Image"
              />
            </div>
          )}
          <div className={s.nameHeader}>
            { user.first_name } { user.last_name }
          </div>

          { user.city && user.state && (
            <div className={s.userLocation}>
              { user.city }, { user.state }
            </div>
          )}

          <RaisedButton
            onTouchTap={() => {}}
            primary
            label="Contact"
            className={s.primaryButton}
          />

          { user.subheader && (
            <div className={s.userSubheader}>
              { user.subheader }
            </div>
          )}

          { user.description && (
            <div className={s.userDescription}>
              { user.description }
            </div>
          )}

        </div>

        <div className={s.centerContent}>
          <div className={s.infoBox}>
            <div className={s.tabsOuterContainer}>
              <div className={s.tabsInnerContainer}>
                <Tabs
                  className={s.tabs}
                  contentContainerClassName={s.tabsContentContainer}
                  onChange={handleTabChange}
                  value={activeTab}
                  inkBarStyle={inkBarStyle}
                >
                  <Tab
                    label="Interests"
                    className={activeTab === 'interests' ? s.activeTab : s.tab}
                    value="interests"
                  />

                  <Tab
                    label="Opportunities"
                    className={activeTab === 'opportunities' ? s.activeTab : s.tab}
                    value="opportunities"
                  />

                  <Tab
                    label="Campaigns"
                    className={activeTab === 'campaigns' ? s.activeTab : s.tab}
                    value="campaigns"
                  />
                </Tabs>
              </div>
            </div>

            <div>
              { infoBoxContent }
            </div>

          </div>
        </div>
        <div className={s.rightContent}>

        </div>
      </div>
    );
  }
}

export default withTimeWithZone(UserProfile);
