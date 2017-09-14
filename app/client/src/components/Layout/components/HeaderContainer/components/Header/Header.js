import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

import Link from 'components/Link';
import ContentDropdownMenu from 'components/ContentDropdownMenu';

import upriseLogo from 'img/uprise-logo.png';
import s from './Header.scss';


const iconButtonStyle = {
  fontSize: '3rem',
};

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
      <AccountCircle className={s.accountIcon} />
      {userObject.first_name} {userObject.last_name}
    </span>
  );

  return (
    <div className={s.menuItemsContainer}>

      <ContentDropdownMenu
        title={accountIcon}
        dropdowns={[
          { title: 'Profile', path: '/volunteer' },
          { title: 'Organize', path: '/organize' },
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
};

AuthenticatedIcons.defaultProps = {
  userObject: undefined,
};

function Header(props) {
  return (
    <AppBar
      iconElementLeft={
        <div
          className={s.menuIconContainer}
        >
          <IconButton
            iconStyle={iconButtonStyle}
            iconClassName="material-icons"
            onTouchTap={props.handleDrawerToggle}
          >menu</IconButton>
        </div>
      }
      title={
        <Link useAhref={false} preventDefault={false} to="/">
          <div className={s.logoContainer}>
            <img
              alt="UpRise Campaigns Logo"
              src={upriseLogo}
              className={s.logoImage}
            />
          </div>
        </Link>
      }
      titleStyle={{
        height: 'auto',
      }}
      iconElementRight={
        <div className={s.rightIconsContainer}>

          { props.loggedIn ?
            <AuthenticatedIcons
              userObject={props.userObject}
              logout={props.clickedLogout}
            />
            :
            <UnauthenticatedIcons />
          }

        </div>
      }
      iconStyleRight={{
        marginTop: '0px',
        display: 'flex',
        alignItems: 'center',
      }}
      className={s.appBar}
      style={{
        backgroundColor: 'rgb(255, 255, 255)',
      }}
    />
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
