
import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

import Link from 'components/Link';
import s from './NavDrawer.scss';


function UserMenuItem (props) {

  const iconButtonStyle = {
    fontSize: '3rem'
  }

  const { itemClicked, user } = props;

  return (
    <div className={s.userContainer}>

      <div className={s.userIconContainer}>
        <IconButton 
          iconStyle={iconButtonStyle}
          iconClassName={[s.materialIcons, 'material-icons'].join(' ')}
          className={s.userIcon}
          onTouchTap={itemClicked}
        >account_box</IconButton>
      </div>

      <div className={s.accountInfoContainer}>
        <div className={s.nameContainer}>
          {user.first_name} {user.last_name}
        </div>
        <div className={s.emailContainer}>
          {user.email}
        </div>
      </div>

    </div>
  );
}

class NavDrawer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleToggle: PropTypes.func.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    userObject: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired
  }

  itemClicked = (event) => {
    this.props.onRequestChange(false);
  }

  menuItems = [
    { path: '/search', title: 'Search' },
    { path: '/volunteer', title: 'Volunteer' },
    { path: '/organize', title: 'Organize' },
    { path: '/settings', title: 'Settings' },
  ]

  accountMenuItems = [
    // { path: '/account/profile', title: 'Profile' },
    // { path: '/account/preferences', title: 'Preferences' },
    // { path: '/account/settings', title: 'Settings' },
  ]

  bottomMenuItems = [
    // { path: '/account/help', title: 'Help' },
    { path: '#', title: 'Logout', action: this.props.logout }
  ]

  renderNavItems = (item, index) => {

    const itemClicked = (event) => {
      if (typeof item.action === 'function') {
        item.action(event);
      }

      this.itemClicked(event);
    }

    return (
      <div key={index}>
        <Link 
          to={item.path}
          useAhref={false}
          onClick={itemClicked}
        >
          <MenuItem 
            className={s.navMenuItem}
            primaryText={item.title}
          />
        </Link>
      </div>
    );
  }

  render() {
    const navItems = this.menuItems.map(this.renderNavItems);
    const accountNavItems = this.accountMenuItems.map(this.renderNavItems);
    const bottomNavItems = this.bottomMenuItems.map(this.renderNavItems);

    if (this.props.loggedIn) {
      return (
        <Drawer
          open={this.props.open}
          onRequestChange={this.props.onRequestChange}
          className={s.drawer}
          docked={false}
        >
          <MenuItem
            primaryText={
              <UserMenuItem 
                itemClicked={this.itemClicked}
                user={this.props.userObject} 
              />
            }
            className={s.userMenuItem}
          />

          {navItems}
{/*
          <Divider className={s.divider}/>

          <Subheader className={s.subheader}>Account</Subheader>

          {accountNavItems}

*/}
          <div className={s.bottomNavContainer}>
            {bottomNavItems}
          </div>

        </Drawer>
      );
    } else {
      return (
        <Drawer
          open={this.props.open}
          onRequestChange={this.props.onRequestChange}
          className={s.drawer}
          docked={false}
        >
          <Link 
            to="/login"
            useAhref={false}
            onClick={this.itemClicked}
          >
            <MenuItem 
              className={s.navMenuItem}
              primaryText="Login"
            />
          </Link>

        </Drawer>
      );
    }
  }
}

export default NavDrawer;
