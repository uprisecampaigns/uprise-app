import PropTypes from 'prop-types';
import React from 'react';
import Menu from 'material-ui/svg-icons/navigation/menu';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Assignment from 'material-ui/svg-icons/action/assignment';

import Link from 'components/Link';
import ContentDropdownMenu from 'components/ContentDropdownMenu';
import HandHeartIcon from 'components/HandHeartIcon';

import upriseLogo from 'img/uprise-logo.png';
import s from './Header.scss';


function UnauthenticatedIcons(props) {
  return (
    <div className={s.menuItemsContainer}>

      <div className={s.leftHeaderItems}>
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
      </div>

      <div className={s.rightHeaderItems}>
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
    </div>
  );
}

function AuthenticatedIcons(props) {
  const { userObject } = props;

  const accountIcon = (
    <span>
      <AccountCircle className={s.accountIcon} />
      {userObject.first_name} {userObject.last_name}
    </span>
  );

  return (
    <div className={s.menuItemsContainer}>

      <div className={s.leftHeaderItems}>
        <div
          className={s.headerButton}
        >
          <Link useAhref={false} to="/">
            <HandHeartIcon className={s.accountIcon} />
            Volunteer
          </Link>
        </div>

        <div
          className={s.headerButton}
        >
          <Link useAhref={false} to="/organize">
            <Assignment className={s.accountIcon} />
            Organize
          </Link>
        </div>
      </div>

      <div className={s.rightHeaderItems}>
        <ContentDropdownMenu
          title={accountIcon}
          dropdowns={[
            { title: 'Profile', path: '/volunteer' },
            { title: 'Settings', path: '/settings' },
            { title: 'Logout', path: '#', action: props.logout },
          ]}
        />
      </div>

    </div>
  );
}

AuthenticatedIcons.propTypes = {
  userObject: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  logout: PropTypes.func.isRequired,
};

AuthenticatedIcons.defaultProps = {
  userObject: undefined,
};

function Header(props) {
  return (
    <div className={s.outerHeaderContainer}>
      <div className={s.header}>
        <div
          className={s.menuIconContainer}
          onClick={props.handleDrawerToggle}
          onKeyPress={props.handleDrawerToggle}
          role="button"
          tabIndex="0"
        >
          <Menu />
        </div>

        <Link useAhref={false} preventDefault={false} to="/">
          <div className={s.logoContainer}>
            <img
              alt="UpRise Campaigns Logo"
              src={upriseLogo}
              className={s.logoImage}
            />
          </div>
        </Link>

        { props.loggedIn ?
          <AuthenticatedIcons
            userObject={props.userObject}
            logout={props.clickedLogout}
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
  handleDrawerToggle: PropTypes.func.isRequired,
};

Header.defaultProps = {
  userObject: undefined,
};

export default Header;
