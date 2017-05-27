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

function LoginButton(props) {
  if (!props.loggedIn) {
    return (
      <Link useAhref={false} to='/login'>
        <FlatButton label="Login" />
      </Link>
    )
  } else {
    return (

      <ContentDropdownMenu
        title="Settings"
        dropdowns={[
          { title: 'Account', path: '/settings/account' },
          { title: 'Privacy & Security', path: '/settings/privacy-security' },
          { title: 'Contact', path: '/settings/contact' },
          { title: 'Logout', path: '#', action: props.logout },
        ]}
      />
    )
  }
}

function AuthenticatedIcons(props) {
  if (props.loggedIn) {
    return (
      <div className={s.authenticatedIconsContainer}>

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
            { title: 'Action Commitments', path: '/actions' },
            { title: 'Campaign Subscriptions', path: '/campaigns' },
          ]}
        />

        <ContentDropdownMenu
          title="Organize"
          className={s.rightIcon}
          dropdowns={[
            { title: 'View All', path: '/organize' },
            { title: 'Create Campaign', path: '/organize/create-campaign' },
          ]}
        />

      </div>
    )
  } else {
    return null;
  }
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
            <AuthenticatedIcons 
              loggedIn={this.props.loggedIn}
            />

            <LoginButton 
              className={s.rightIcon}
              loggedIn={this.props.loggedIn}
              logout={this.props.clickedLogout}
              userObject={this.props.userObject}
            />
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
