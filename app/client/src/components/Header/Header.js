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
          to={dropdown.url}
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

    let dropdownItems = this.props.dropdowns.map(this.renderDropdown);

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
          { title: 'Profile', url: '/account/profile' },
          { title: 'Preferences', url: '/account/preferences' },
          { title: 'Settings', url: '/account/settings' },
          { title: 'Help', url: '/account/help' },
          { title: 'Logout', url: '#', action: props.logout },
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
          dropdowns={[
            { title: 'Notifications', url: '/communications/notifications' },
            { title: 'Requests', url: '/communications/requests' },
            { title: 'Messages', url: '/communications/messages' },
          ]}
        />

        <ContentDropdownMenu
          titleIconName="event"
          dropdowns={[
            { title: 'View Calendar', url: '/calendar/view-calendar' },
            { title: 'View List', url: '/calendar/view-list' },
          ]}
        />

        <ContentDropdownMenu
          titleIconName="work"
          dropdowns={[
            { title: 'View All', url: '/organize/view-all' },
            { title: 'Create Campaign', url: '/organize/create-campaign' },
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
