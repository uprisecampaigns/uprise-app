
import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

import Link from 'components/Link';
import s from './NavDrawer.scss';


function UserMenuItem(props) {
  const iconButtonStyle = {
    fontSize: '3rem',
  };

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

UserMenuItem.propTypes = {
  itemClicked: PropTypes.func.isRequired,
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

class NavDrawer extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    userObject: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
    }),
    loggedIn: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
  }

  static defaultProps = {
    userObject: null,
  }

  itemClicked = (event) => {
    this.props.onRequestChange(false);
  }

  menuItems = [
    { path: '/volunteer', title: 'My Profile' },
    { path: '/organize', title: 'Manage Opportunities' },
    { path: '/settings', title: 'Settings' },
  ]

  bottomMenuItems = [
    // { path: '/account/help', title: 'Help' },
    { path: '#', title: 'Logout', action: this.props.logout },
  ]

  renderNavItems = (item, index) => {
    const itemClicked = (event) => {
      if (typeof item.action === 'function') {
        item.action(event);
      }

      this.itemClicked(event);
    };

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

          <div className={s.bottomNavContainer}>
            {bottomNavItems}
          </div>

        </Drawer>
      );
    }
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

        <Link
          to="/signup"
          useAhref={false}
          onClick={this.itemClicked}
        >
          <MenuItem
            className={s.navMenuItem}
            primaryText="Sign Up"
          />
        </Link>

        <Link
          to="https://uprisecampaigns.org/about/"
          useAhref={false}
          sameTab
          external
          onClick={this.itemClicked}
        >
          <MenuItem
            className={s.navMenuItem}
            primaryText="Learn More"
          />
        </Link>

        <Link
          to="uprisecampaigns.org/donate"
          useAhref={false}
          onClick={this.itemClicked}
          external
        >
          <MenuItem
            className={s.navMenuItem}
            primaryText="Donate"
          />
        </Link>
      </Drawer>
    );
  }
}

export default NavDrawer;
