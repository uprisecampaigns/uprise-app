import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';

import KeywordTag from 'components/KeywordTag';

import history from 'lib/history';

import s from 'styles/UserProfile.scss';


// Too difficult to override in css :/
const inkBarStyle = {
  backgroundColor: '#333',
  height: '3px',
};

class UserProfile extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    activeTab: PropTypes.string,
  }

  static defaultProps = {
    activeTab: 'interests',
  }

  handleContact = (event) => {
    const { user } = this.props;
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();
    history.push(`/user/${user.id}/compose`);
  }

  render() {
    const { user, activeTab, handleTabChange } = this.props;

    const keywords = (Array.isArray(user.tags) && user.tags.length) ? (
      <div className={s.keywordLine}>
        {user.tags.map((tag, index) => (
          <KeywordTag
            label={tag}
            type="action"
            className={s.keywordTag}
            key={JSON.stringify(tag)}
          />
        ))}
      </div>
    ) : null;

    const infoBoxMapping = {
      interests: {
        singular: 'activity',
        plural: 'activities',
        headerText: 'Interested in...',
        text: activity => activity.description,
      },
      opportunities: {
        singular: 'action',
        plural: 'actions',
        headerText: 'Actions Header...',
        text: action => action.title,
      },
      campaigns: {
        singular: 'campaign',
        plural: 'campaigns',
        headerText: 'Campaigns Header...',
        text: campaign => campaign.title,
      },
    };

    const selected = infoBoxMapping[activeTab];
    const collection = user[selected.plural];

    const infoBoxContent = (Array.isArray(collection) && collection.length) ? (
      <div>
        <div className={s.infoBoxHeader}>
          { selected.headerText }
        </div>
        { collection.map((item, index) => <div key={JSON.stringify(item)} className={s.infoBoxLine}>{ selected.text(item) }</div>) }
      </div>) :
      null;

    return (
      <div className={s.userProfileContainer}>
        <div className={s.leftContent}>

          { user.profile_image_url && (
            <div className={s.profileImageContainer}>
              <img
                src={user.profile_image_url}
                className={s.profileImage}
                alt="User Profile"
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

          { user.subheader && (
            <div className={s.userSubheader}>
              { user.subheader }
            </div>
          )}

          <RaisedButton
            onTouchTap={this.handleContact}
            primary
            label="Contact"
            className={s.primaryButton}
          />

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

            <div className={s.infoBoxContainer}>
              { infoBoxContent }
            </div>

          </div>
        </div>
        <div className={s.rightContent}>
          <div className={s.keywordsHeader}>
            Keywords...
          </div>
          { keywords }
        </div>
      </div>
    );
  }
}

export default UserProfile;
