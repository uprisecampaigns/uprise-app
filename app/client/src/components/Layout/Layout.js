
import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import HeaderContainer from './components/HeaderContainer';
import NavDrawerContainer from './components/NavDrawerContainer';

import s from 'styles/Layout.scss';

import { 
  clear,
  cancelNavFromDirtyForm,
  confirmNavFromDirtyForm,
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

        { this.props.pageLoading && 
          <div className={s.pageLoadingContainer}>
            <LinearProgress mode="indeterminate" />
          </div>
        }

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

        <Dialog
          title="Are you sure?"
          modal={true}
          actionsContainerClassName={s.modalActionsContainer}
          actions={[
            <RaisedButton
              label="Ok"
              primary={true}
              className={s.primaryButton}
              onTouchTap={ (event) => { event.preventDefault(); this.props.dispatch(confirmNavFromDirtyForm()) }}
            />,
            <RaisedButton
              label="Cancel"
              primary={false}
              className={s.secondaryButton}
              onTouchTap={ (event) => { event.preventDefault(); this.props.dispatch(cancelNavFromDirtyForm()) }}
            />]}
          open={this.props.displayFormNavWarning}
        >
          <p>
            You have unsaved changes. Are you sure you want to leave this page?
          </p>
        </Dialog>
      </div>
    );
  }
}

export default connect((state) => ({ 
  pageLoading: state.notifications.pageLoading,
  notificationMessage: state.notifications.message,
  displayFormNavWarning: state.notifications.displayFormNavWarning,
  displayNotification: state.notifications.display
}))(Layout)
