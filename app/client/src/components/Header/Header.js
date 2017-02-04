import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import TextField from 'material-ui/TextField';
import Link from '../Link';

import upriseLogo from 'img/uprise-logo.png';
import s from './Header.scss';


const iconButtonStyle = {
  fontSize: '3rem'
}

const dropdownMenuItemStyle = {
  padding: '0px'
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
      <IconMenu
        iconButtonElement={
          <IconButton 
            iconStyle={iconButtonStyle}
            iconClassName='material-icons'
            className={s.iconButton}
          >account_box</IconButton>}
        className={s.accountMenuContainer}
      >
        <div className={s.dropdownContainer}>
          <MenuItem 
            innerDivStyle={dropdownMenuItemStyle}
            value="1">
            <Link 
              to="/account/profile"
              useAhref={false}
              className={s.dropdownItemText}
            >Profile</Link>
          </MenuItem>

          <Divider />

          <MenuItem 
            innerDivStyle={dropdownMenuItemStyle}
            value="2">
            <Link 
              to="/account/preferences"
              useAhref={false}
              className={s.dropdownItemText}
            >Preferences</Link>
          </MenuItem>

          <Divider />

          <MenuItem 
            innerDivStyle={dropdownMenuItemStyle}
            value="3">
            <Link 
              to="/account/settings"
              useAhref={false}
              className={s.dropdownItemText}
            >Settings</Link>
          </MenuItem>
   
          <Divider />

          <MenuItem 
            innerDivStyle={dropdownMenuItemStyle}
            value="4">
            <Link 
              to="/account/help"
              useAhref={false}
              className={s.dropdownItemText}
            >Help</Link>
          </MenuItem>
           <Divider />

          <MenuItem 
            innerDivStyle={dropdownMenuItemStyle}
            value="5">

            <div 
              onTouchTap={props.logout}
              className={s.dropdownItemText}
            >
              Log out 
            </div>
          </MenuItem>
        </div>
      </IconMenu>
    )
  }
}

function CommunicationDropdown(props) {
  return (
    <IconMenu
      iconButtonElement={
        <IconButton 
          iconStyle={iconButtonStyle}
          iconClassName='material-icons'
          className={s.iconButton}
        >notifications</IconButton>}
    >
      <div className={s.dropdownContainer}>
        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="1">
          <Link 
            to="/communications/notifications"
            useAhref={false}
            className={s.dropdownItemText}
          >Notifications</Link>
        </MenuItem>

        <Divider />

        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="2">
          <Link 
            to="/communications/requests"
            useAhref={false}
            className={s.dropdownItemText}
          >Requests</Link>
        </MenuItem>

        <Divider />

        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="3">
          <Link 
            to="/communications/messages"
            useAhref={false}
            className={s.dropdownItemText}
          >Messages</Link>
        </MenuItem>
      </div>
    </IconMenu>
  )
}

function CalendarDropdown(props) {
  return (
    <IconMenu
      iconButtonElement={
        <IconButton 
          iconStyle={iconButtonStyle}
          iconClassName='material-icons'
          className={s.iconButton}
        >event</IconButton>}
    >
      <div className={s.dropdownContainer}>
        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="1">
          <Link 
            to="/calendar/view-calendar"
            useAhref={false}
            className={s.dropdownItemText}
          >View Calendar</Link>
        </MenuItem>

        <Divider />

        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="2">
          <Link 
            to="/calendar/view-list"
            useAhref={false}
            className={s.dropdownItemText}
          >View List</Link>
        </MenuItem>
      </div>
    </IconMenu>
  )
}

function OrganizeDropdown(props) {
  return (
    <IconMenu
      iconButtonElement={
        <IconButton 
          iconStyle={iconButtonStyle}
          iconClassName='material-icons'
          className={s.iconButton}
        >work</IconButton>}
    >
      <div className={s.dropdownContainer}>
        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="1">
          <Link 
            to="/organize/view-all"
            useAhref={false}
            className={s.dropdownItemText}
          >View All</Link>
        </MenuItem>

        <Divider />

        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="2">
          <Link 
            to="/organize/create-campaign"
            useAhref={false}
            className={s.dropdownItemText}
          >Create Campaign</Link>
        </MenuItem>
      </div>
    </IconMenu>
  )
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

        <CommunicationDropdown />

        <CalendarDropdown />

        <OrganizeDropdown />

      </div>
    )
  } else {
    return null;
  }
}

function showOpportunity(opportunity) {
  if (typeof opportunity === 'object' &&
      typeof opportunity.title === 'string') {

    return opportunity.title;
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
  }

  render() {
    return (
      <AppBar
        iconElementLeft={
          <Link useAhref={true} to='/'>
            <img 
              src={upriseLogo}
              className={s.upriseLogo}
            />
          </Link>
        }
        iconStyleRight={{
          marginTop: '0px'
        }}
        iconElementRight={
          <div className={s.flexContainer}>
            <div>{showOpportunity(this.props.opportunity)}</div>
            <AuthenticatedIcons 
              loggedIn={this.props.loggedIn}
            />
            <LoginButton 
              loggedIn={this.props.loggedIn}
              logout={this.props.clickedLogout}
              userObject={this.props.userObject}/>
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
