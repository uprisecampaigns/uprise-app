import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

import history from 'lib/history';

import RaisedButton from 'material-ui/RaisedButton';

import Link from 'components/Link';
import KeywordTag from 'components/KeywordTag';

import s from 'styles/Profile.scss';


class ViewUserProfile extends Component {
  static propTypes = {
    me: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  handleContact = (event) => {
    const { user } = this.props;
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();
    history.push(`/user/${user.id}/compose`);
  }

  render() {
    // This page won't render unless user is logged in
    const { user, me } = this.props;

    const keywords = (Array.isArray(user.tags) && user.tags.length) ? (
      <div className={s.keywordLine}>
        {user.tags.map((tag, index) => (
          <KeywordTag
            label={tag}
            type="user"
            className={s.keywordTag}
            key={JSON.stringify(tag)}
          />
        ))}
      </div>
    ) : null;

    return (
      <div className={s.outerContainer}>

        { user.id === me.id && (
          <Link to="/account/edit-profile">
            <div className={s.primaryButton}>
              <RaisedButton
                primary
                label="Edit Profile"
              />
            </div>
          </Link>
        )}

        <div className={s.profileContainer}>
          <div className={s.leftContainer}>
            <div className={[s.namePhotoContainer, s.profileBox].join(' ')}>

              { user.profile_image_url && (
                <div className={s.profileImageContainer}>
                  <img
                    src={user.profile_image_url}
                    className={s.profileImage}
                    alt="User Profile"
                  />
                </div>
              )}

              <div className={s.profileNameHeader}>
                {user.first_name} {user.last_name}
              </div>

              <div className={s.userSubheader}>
                {user.subheader}
              </div>

              <RaisedButton
                onClick={this.handleContact}
                primary
                label="Contact"
                className={s.primaryButton}
              />

              <div className={s.sectionLabel}>Keywords</div>

              <div className={s.keywordsContainer}>
                {keywords}
              </div>
            </div>
          </div>
          <div className={s.rightContainer}>
            <div className={[s.descriptionContainer, s.editProfileBox].join(' ')}>
              <div className={s.inputHeader}>
                More about me...
              </div>
              <div className={s.textareaContainer}>
                {user.description}
              </div>
            </div>
            <div className={[s.activitiesContainer, s.editProfileBox].join(' ')}>
              <div className={s.inputHeader}>
                Activities I&apos;m interested in...
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default compose(connect())(ViewUserProfile);
