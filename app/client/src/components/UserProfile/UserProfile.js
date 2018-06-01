import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import KeywordTag from 'components/KeywordTag';

import history from 'lib/history';
import Link from 'components/Link';

import s from 'styles/UserProfile.scss';

class UserProfile extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  handleContact = (event) => {
    const { user } = this.props;
    typeof event === 'object' && typeof event.preventDefault === 'function' && event.preventDefault();
    history.push(`/user/${user.id}/compose`);
  };

  handleEdit = (event) => {
    typeof event === 'object' && typeof event.preventDefault === 'function' && event.preventDefault();
    history.push('/settings/edit-profile');
  };

  render() {
    const { user } = this.props;

    const keywords =
      Array.isArray(user.tags) && user.tags.length ? (
        <div className={s.keywordLine}>
          {user.tags.map((tag, index) => (
            <KeywordTag label={tag} type="action" className={s.keywordTag} key={JSON.stringify(tag)} />
          ))}
        </div>
      ) : null;

    const infoBoxContent =
      Array.isArray(user.activities) && user.activities.length ? (
        <div>
          {user.activities.map((activity, index) => (
            <div key={JSON.stringify(activity)} className={s.infoBoxLine}>
              {activity.description}
            </div>
          ))}
        </div>
      ) : (
        <div>This user doesn&apos;t have any interests selected yet!</div>
      );

    return (
      <div>
        {/*
        <div className={s.headerButtonsContainer}>
          <RaisedButton onClick={this.handleEdit} primary label="Edit Profile" className={s.editProfileButton} />
        </div>
        */}
        <div className={s.userProfileContainer}>
          <div className={s.leftContent}>
            {user.profile_image_url && (
              <div className={s.profileImageContainer}>
                <img src={user.profile_image_url} className={s.profileImage} alt="User Profile" />
              </div>
            )}
            <div className={s.nameHeader}>
              {user.first_name} {user.last_name}
            </div>

            {user.city &&
              user.state && (
                <div className={s.userLocation}>
                  {user.city}, {user.state}
                </div>
              )}

            {user.subheader && <div className={s.userSubheader}>{user.subheader}</div>}

            <RaisedButton onClick={this.handleContact} primary label="Contact" className={s.primaryButton} />

            <div className={s.keywordsHeader}>Keywords</div>
            {keywords}
          </div>

          <div className={s.centerContent}>
            {user.description && (
              <div className={s.infoBox}>
                <div className={s.infoBoxHeader}>More about me...</div>
                <div className={s.userDescription}>{user.description}</div>
              </div>
            )}

            <div className={s.infoBox}>
              <div className={s.infoBoxHeader}>Activities I'm interested in...</div>

              <div className={s.infoBoxContainer}>{infoBoxContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
