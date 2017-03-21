
import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar';
import HeaderContainer from './components/HeaderContainer';
import NavDrawerContainer from './components/NavDrawerContainer';

import s from './Layout.scss';

import { 
  clear
} from 'actions/NotificationsActions';


export class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    notificationMessage: PropTypes.string.isRequired,
    displayNotification: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    }
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

        <Snackbar
          open={this.props.displayNotification}
          message={this.props.notificationMessage}
          autoHideDuration={4000}
          onRequestClose={ (reason) => this.props.dispatch(clear()) }
        />
      </div>
    );
  }
}

export default connect((state) => ({ 
  notificationMessage: state.notifications.message,
  displayNotification: state.notifications.display
}))(Layout)
