
import React, { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import HeaderContainer from 'containers/HeaderContainer';

import s from './Layout.scss';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    drawerOpen: false
  }

  handleDrawerToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});

  handleDrawerRequestChange = (open, reason) => {
    this.setState({
      drawerOpen: open
    });
  }

  render() {
    return (
      <div>
        <HeaderContainer handleDrawerToggle={this.handleDrawerToggle}/>
        <Drawer
          open={this.state.drawerOpen}
          onRequestChange={this.handleDrawerRequestChange}
          className={s.drawer}
          docked={false}
        >
          <MenuItem>Menu item 1</MenuItem>
          <MenuItem>Menu item 2</MenuItem>
        </Drawer>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
