import PropTypes from 'prop-types';
import React from 'react';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Avatar from 'material-ui/Avatar';

import Link from 'components/Link';
import ContentDropdownMenu from 'components/ContentDropdownMenu';

import s from 'styles/Header.scss';


function UnauthenticatedIcons(props) {
  return (
    <div className={s.menuItemsContainer}>

      <div
        className={s.headerButton}
      >
        <Link useAhref={false} to="/login">
          LOGIN
        </Link>
      </div>

      <div
        className={s.headerButton}
      >
        <Link useAhref={false} external to="uprisecampaigns.org/donate">
        Donate
        </Link>
      </div>

      <ContentDropdownMenu
        title="About UpRise"
        className={s.rightIcon}
        dropdowns={[
          {
            title: 'About',
            path: 'http://uprisecampaigns.org/about',
            external: true,
            sameTab: true,
          },
          {
            title: 'People',
            path: 'http://uprisecampaigns.org/people',
            external: true,
            sameTab: true,
          },
          {
            title: 'Contact',
            path: 'http://uprisecampaigns.org/contact',
            external: true,
            sameTab: true,
          },
        ]}
      />

      <ContentDropdownMenu
        title="Campaign Reform"
        className={s.rightIcon}
        dropdowns={[
          {
            title: 'What Works',
            path: 'http://uprisecampaigns.org/whatworks',
            external: true,
            sameTab: true,
          },
          {
            title: 'Volunteer Engagement',
            path: 'http://uprisecampaigns.org/volunteerengagement',
            external: true,
            sameTab: true,
          },
          {
            title: 'Research',
            path: 'http://uprisecampaigns.org/research',
            external: true,
            sameTab: true,
          },
        ]}
      />
    </div>
  );
}

function AuthenticatedIcons(props) {
  const { userObject } = props;

  const accountIcon = (
    <span>
      { userObject.profile_image_url ? (
        <Avatar
          className={s.accountIcon}
          src={userObject.profile_image_url}
        />) : (
          <AccountCircle className={s.accountIcon} />
      )}
    </span>
  );

  return (
    <div className={s.menuItemsContainer}>

      <div
        className={s.headerButton}
      >
        <Link useAhref={false} to="/">
          Volunteer
        </Link>
        { props.role === 'volunteer' && (
          <ArrowDropUp />
        )}
      </div>

      <div
        className={s.headerButton}
      >
        <Link useAhref={false} to="/organize">
          Organize
        </Link>
        { props.role === 'organize' && (
          <ArrowDropUp />
        )}
      </div>

      <ContentDropdownMenu
        title={accountIcon}
        showExpandCaret={false}
        dropdowns={[
          { title: 'Profile', path: '/volunteer' },
          { title: 'Settings', path: '/settings' },
          { title: 'Logout', path: '#', action: props.logout },
        ]}
      />

    </div>
  );
}

AuthenticatedIcons.propTypes = {
  userObject: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  logout: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};

AuthenticatedIcons.defaultProps = {
  userObject: undefined,
};

function Header(props) {
  return (
    <div className={s.outerHeaderContainer}>
      <div className={s.header}>
        { props.loggedIn ?
          <AuthenticatedIcons
            userObject={props.userObject}
            logout={props.clickedLogout}
            role={props.role}
          /> :
          <UnauthenticatedIcons />
        }
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
  clickedLogout: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};

Header.defaultProps = {
  userObject: undefined,
};

export default Header;
