import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Link from '../Link';

import upriseLogo from 'img/uprise-logo.png';
import s from './Header.scss';


const iconButtonStyle = {
  fontSize: '3rem',
}

const dropdownMenuItemStyle = {
  padding: '0px'
}


class ContentDropdownMenu extends Component {
  constructor(props) {
    super(props);
  }

  state = {}

  static propTypes = {
    titleIconName: PropTypes.string.isRequired,
    dropdowns: PropTypes.array.isRequired,
  }

  renderDropdown = (dropdown, index) => {

    const itemClicked = (event) => {
      if (typeof dropdown.action === 'function') {
        dropdown.action(event);
      }

      this.setState({
        openMenu: false
      });
    }

    return (
      <div key={index}>
        <Link 
          to={dropdown.path}
          useAhref={false}
          onClick={itemClicked}
        >
          <MenuItem 
            className={s.dropdownItemText}
            value={index + 1}
            primaryText={dropdown.title}
          />
        </Link>
        {(index < this.props.dropdowns.length - 1) && <Divider/>}
      </div>
    );
  }

  handleOpenMenu = () => {
    this.setState({
      openMenu: true
    });
  }

  handleOnRequestChange = (value) => {
    this.setState({
      openMenu: false
    });
  }

  render() {

    const dropdownItems = this.props.dropdowns.map(this.renderDropdown);

    return (
      <IconMenu
        iconButtonElement={
          <IconButton 
            iconStyle={iconButtonStyle}
            iconClassName='material-icons'
            className={s.iconButton}
            onTouchTap={this.handleOpenMenu}
          >{this.props.titleIconName}</IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'middle'}}
        targetOrigin={{ vertical: 'top', horizontal: 'middle'}}
        onRequestChange={this.handleOnRequestChange}
        open={this.state.openMenu}
      >
        <div className={s.dropdownContainer}>
          {dropdownItems}
        </div>
      </IconMenu>
    );
  }
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
        titleIconName="account_box"
        dropdowns={[
          { title: 'Profile', path: '/account/profile' },
          { title: 'Preferences', path: '/account/preferences' },
          { title: 'Settings', path: '/account/settings' },
          { title: 'Help', path: '/account/help' },
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

        <div className={s.searchContainer}>
          <TextField
            hintText="Search by name or keyword"
            value={undefined}
            errorText={''}
            onChange={ (event) => { console.log(event.target.value) } }
          />
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
          >search</IconButton>
        </div>

        <ContentDropdownMenu
          titleIconName="notifications"
          className={s.rightIcon}
          dropdowns={[
            { title: 'Notifications', path: '/communications/notifications' },
            { title: 'Requests', path: '/communications/requests' },
            { title: 'Messages', path: '/communications/messages' },
          ]}
        />

        <ContentDropdownMenu
          titleIconName="event"
          className={s.rightIcon}
          dropdowns={[
            { title: 'View Calendar', path: '/calendar/view-calendar' },
            { title: 'View List', path: '/calendar/view-list' },
          ]}
        />

        <ContentDropdownMenu
          titleIconName="work"
          className={s.rightIcon}
          dropdowns={[
            { title: 'View All', path: '/organize/view-all' },
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
              className={s.iconButton}
              onTouchTap={this.props.handleDrawerToggle}
            >menu</IconButton>
          </div>
        }
        title={
          <Link useAhref={true} to='/'>
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
        style={{
          'backgroundColor': 'rgb(255, 255, 255)'
        }}
      />
    );
  }
}

export default Header;
