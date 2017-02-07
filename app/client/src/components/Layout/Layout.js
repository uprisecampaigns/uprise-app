
import React, { PropTypes } from 'react';
import HeaderContainer from 'containers/HeaderContainer';
import NavDrawerContainer from 'containers/NavDrawerContainer';

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

        <NavDrawerContainer 
          open={this.state.drawerOpen}
          handleToggle={this.handleDrawerToggle}
          onRequestChange={this.handleDrawerRequestChange}
        />

        {this.props.children}
      </div>
    );
  }
}

export default Layout;
