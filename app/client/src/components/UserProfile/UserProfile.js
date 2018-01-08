import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import KeywordTag from 'components/KeywordTag';

import history from 'lib/history';

import s from 'styles/UserProfile.scss';


class UserProfile extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  handleContact = (event) => {
    const { user } = this.props;
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();
    history.push(`/user/${user.id}/compose`);
  }

  render() {
    const { user } = this.props;

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

    const infoBoxContent = (Array.isArray(user.activities) && user.activities.length) ? (
      <div>
        { user.activities.map((activity, index) => <div key={JSON.stringify(activity)} className={s.infoBoxLine}>{ activity.description }</div>) }
      </div>
    ) : (
      <div>This user doesn&apos;t have any interests selected yet!</div>
    );

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

        </div>

        <div className={s.centerContent}>

          { user.description && (
            <div className={s.infoBox}>
              <div className={s.userDescription}>
                { user.description }
              </div>
            </div>
          )}

          <div className={s.infoBox}>
            <div className={s.infoBoxHeader}>
              Interested in...
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
