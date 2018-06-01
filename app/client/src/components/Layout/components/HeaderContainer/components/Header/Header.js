import PropTypes from 'prop-types';
import React from 'react';
import ClassNames from 'classnames';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Avatar from 'material-ui/Avatar';

import Link from 'components/Link';
import ContentDropdownMenu from 'components/ContentDropdownMenu';

import s from 'styles/Header.scss';

function UnauthenticatedIcons(props) {
  return (
    <div className={s.menuItemsContainer}>
      <div className={s.headerButton}>
        <Link to="/login">Log In</Link>
      </div>

      <div className={[s.headerButton, s.primaryButton].join(' ')}>
        <Link to="/signup">Register</Link>
      </div>
    </div>
  );
}

function AuthenticatedIcons(props) {
  const { userObject } = props;

  const accountIcon = (
    <div>
      {userObject.profile_image_url ? (
        <Avatar className={s.accountIcon} src={userObject.profile_image_url} />
      ) : (
        <AccountCircle className={s.accountIcon} />
      )}
    </div>
  );

  return (
    <div className={s.menuItemsContainer}>
      <div
        className={ClassNames({
          [s.headerButton]: true,
          [s.activeButton]: props.role === 'volunteer',
        })}
      >
        <Link to="/">Volunteer</Link>
      </div>

      <div
        className={ClassNames({
          [s.headerButton]: true,
          [s.activeButton]: props.role === 'organize',
        })}
      >
        <Link to="/organize">Organize</Link>
      </div>

      <div
        className={ClassNames({
          [s.headerButton]: true,
          [s.avatarButton]: true,
          [s.activeButton]: props.role === 'user',
        })}
      >
        <Link to="/volunteer">{accountIcon}</Link>
      </div>
    </div>
  );
}

AuthenticatedIcons.propTypes = {
  userObject: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  role: PropTypes.string.isRequired,
};

AuthenticatedIcons.defaultProps = {
  userObject: undefined,
};

function Header(props) {
  return (
    <div className={s.outerHeaderContainer}>
      <div className={s.header}>
        {props.loggedIn ? (
          <AuthenticatedIcons userObject={props.userObject} role={props.role} />
        ) : (
          <UnauthenticatedIcons />
        )}
      </div>
    </div>
  );
}

Header.propTypes = {
  userObject: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  loggedIn: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
};

Header.defaultProps = {
  userObject: undefined,
};

export default Header;
