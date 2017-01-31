import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
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
        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="1">
          <Link 
            to="/profile"
            useAhref={false}
            className={s.fillSpaceLink}
          >Profile</Link>
        </MenuItem>
        <MenuItem value="2" primaryText={props.userObject.email} />
        <MenuItem value="3" primaryText="Preferences" />
        <MenuItem 
          innerDivStyle={dropdownMenuItemStyle}
          value="4">
          <Link 
            to="/settings"
            useAhref={false}
            className={s.fillSpaceLink}
          >Settings</Link>
        </MenuItem>
        <MenuItem value="5" primaryText="Help" />
        <MenuItem value="6" primaryText="Log out" onTouchTap={props.logout}/>
      </IconMenu>
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
        <Link useAhref={false} to='/calendar'>
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
            iconStyle={iconButtonStyle}
          >event</IconButton>
        </Link>
        <Link useAhref={false} to='/friends'>
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
            iconStyle={iconButtonStyle}
          >group</IconButton>
        </Link>
        <Link useAhref={false} to='/about'>
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
            iconStyle={iconButtonStyle}
          >work</IconButton>
        </Link>
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
