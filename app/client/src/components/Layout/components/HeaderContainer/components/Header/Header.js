import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Link from 'components/Link';
import ContentDropdownMenu from 'components/ContentDropdownMenu';

import upriseLogo from 'img/uprise-logo.png';
import s from './Header.scss';


const iconButtonStyle = {
  fontSize: '3rem',
}

function UnauthenticatedIcons(props) {
  return (
    <div className={s.menuItemsContainer}>

      <div 
        className={s.headerButton}
      >
        <Link useAhref={false} to='/login'>
          <FlatButton label="LOGIN" />
        </Link>
      </div>

      <ContentDropdownMenu
        title="Home"
        className={s.rightIcon}
        dropdowns={[
          {
            title: 'Volunteers',
            path: 'http://uprisecampaigns.org/home/volunteers',
            external: true,
            sameTab: true,
          },
          {
            title: 'Campaigns',
            path: 'http://uprisecampaigns.org/home/campaigns',
            external: true,
            sameTab: true,
          }
        ]}
      />

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
  return (
    <div className={s.menuItemsContainer}>

      <ContentDropdownMenu
        title="Search"
        className={s.rightIcon}
        dropdowns={[
          { title: 'Actions', path: '/search/search-actions' },
          { title: 'Campaigns', path: '/search/search-campaigns' },
        ]}
      />

      <ContentDropdownMenu
        title="Volunteer"
        className={s.rightIcon}
        dropdowns={[
          { title: 'My Actions', path: '/volunteer/action-commitments' },
          { title: 'My Subscriptions', path: '/volunteer/campaign-subscriptions' },
        ]}
      />

      <ContentDropdownMenu
        title="Organize"
        className={s.rightIcon}
        dropdowns={[
          { title: 'My Campaigns', path: '/organize' },
          { title: 'Create Campaign', path: '/organize/create-campaign' },
        ]}
      />

      <ContentDropdownMenu
        title="Settings"
        dropdowns={[
          { title: 'Account', path: '/settings/account' },
          { title: 'Privacy & Security', path: '/settings/privacy-security' },
          { title: 'Contact', path: '/settings/contact' },
          { title: 'Logout', path: '#', action: props.logout },
        ]}
      />

    </div>
  )
}

class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    userObject: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    clickedLogout: PropTypes.func.isRequired,
    handleDrawerToggle: PropTypes.func.isRequired,
  }

  render() {
    return (
      <AppBar
        iconElementLeft={
          <div 
            className={s.menuIconContainer}
          >
            <IconButton 
              iconStyle={iconButtonStyle}
              iconClassName='material-icons'
              onTouchTap={this.props.handleDrawerToggle}
            >menu</IconButton>
          </div>
        }
        title={
          <Link useAhref={false} preventDefault={false} to='/'>
            <div className={s.logoContainer}>
              <img 
                src={upriseLogo}
                className={s.logoImage}
              />
            </div>
          </Link>
        }
        titleStyle={{
          height: 'auto'
        }}
        iconElementRight={
          <div className={s.rightIconsContainer}>

            { this.props.loggedIn ?
              <AuthenticatedIcons logout={this.props.clickedLogout}/>
              :
              <UnauthenticatedIcons />
            }

          </div>
        }
        iconStyleRight={{
          marginTop: '0px',
          display: 'flex',
          alignItems: 'center'
        }}
        className={s.appBar}
        style={{
          'backgroundColor': 'rgb(255, 255, 255)'
        }}
      />
    );
  }
}

export default Header;
