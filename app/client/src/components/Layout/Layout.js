
import React, { PropTypes } from 'react';
import HeaderContainer from 'containers/HeaderContainer';
import NavDrawer from 'components/NavDrawer';

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

  logoutHandler = (event) => {
    console.log('Logging out from navdrawer');
  }

  render() {
    return (
      <div>

        <HeaderContainer handleDrawerToggle={this.handleDrawerToggle}/>

        <NavDrawer 
          open={this.state.drawerOpen}
          handleToggle={this.handleDrawerToggle}
          onRequestChange={this.handleDrawerRequestChange}
          logout={this.logoutHandler}
        />

        {this.props.children}
      </div>
    );
  }
}

export default Layout;
