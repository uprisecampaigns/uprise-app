
const path = require('path');
import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';
import s from './NavDrawer.scss';


class NavDrawer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleToggle: PropTypes.func.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  }

  itemClicked = (event) => {
    this.props.onRequestChange(false);
  }

  menuItems = [
    { path: '/search', title: 'Search' },
    { path: '/communications', title: 'Communications' },
    { path: '/calendar', title: 'Calendar' },
    { path: '/organize', title: 'Organize' },
    { path: '/account', title: 'Account' },
    { path: '/account/profile', title: 'Profile' },
    { path: '/account/preferences', title: 'Preferences' },
    { path: '/account/settings', title: 'Settings' },
    { path: '/account/help', title: 'Help' },
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
            className={s.menuItem}
            primaryText={item.title}
          />
        </Link>
        {(index < this.menuItems.length - 1) && <Divider/>}
      </div>
    );
  }

  render() {
    const navItems = this.menuItems.map(this.renderNavItems);

    return (
      <Drawer
        open={this.props.open}
        onRequestChange={this.props.onRequestChange}
        className={s.drawer}
        docked={false}
      >
        {navItems}
      </Drawer>
    );
  }
}

export default NavDrawer;
