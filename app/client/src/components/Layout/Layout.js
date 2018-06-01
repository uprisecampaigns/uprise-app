import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import withAuthentication from 'lib/withAuthentication';

import LoginModalPrompt from 'components/LoginModalPrompt';

import s from 'styles/Layout.scss';

import { clear, cancelNavFromDirtyForm, confirmNavFromDirtyForm } from 'actions/NotificationsActions';

import HeaderContainer from './components/HeaderContainer';
import NavDrawerContainer from './components/NavDrawerContainer';
import Footer from './components/Footer';


export class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    notificationMessage: PropTypes.string.isRequired,
    displayNotification: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    displayFormNavWarning: PropTypes.bool.isRequired,
    pageLoading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  handleDrawerToggle = (event) => {
    typeof event.preventDefault === 'function' && event.preventDefault();
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  handleDrawerRequestChange = (open, reason) => {
    this.setState({
      drawerOpen: open,
    });
  };

  render() {
    return (
      <div className={s.layoutOuterContainer}>
        {this.props.pageLoading && (
          <div className={s.pageLoadingContainer}>
            <LinearProgress mode="indeterminate" />
          </div>
        )}

        <HeaderContainer handleDrawerToggle={this.handleDrawerToggle} />

        <NavDrawerContainer
          open={this.state.drawerOpen}
          handleToggle={this.handleDrawerToggle}
          onRequestChange={this.handleDrawerRequestChange}
        />

        <div
          className={ClassNames({
            [s.contentContainer]: true,
            [s.fillPage]: !this.props.fetchingUpdate && !this.props.loggedIn,
          })}
        >
          {this.props.children}
        </div>

        <Footer />

        <Snackbar
          className={s.snackbar}
          open={this.props.displayNotification}
          message={this.props.notificationMessage}
          autoHideDuration={0}
          onRequestClose={(reason) => this.props.dispatch(clear())}
        />

        <LoginModalPrompt />

        <Dialog
          title="Are you sure?"
          modal
          actionsContainerClassName={s.modalActionsContainer}
          actions={[
            <RaisedButton
              label="Leave"
              primary={false}
              className={s.secondaryButton}
              onClick={(event) => {
                event.preventDefault();
                this.props.dispatch(confirmNavFromDirtyForm());
              }}
            />,
            <RaisedButton
              label="Keep Editing"
              primary
              className={s.primaryButton}
              onClick={(event) => {
                event.preventDefault();
                this.props.dispatch(cancelNavFromDirtyForm());
              }}
            />,
          ]}
          open={this.props.displayFormNavWarning}
        >
          <p>You have unsaved changes. Are you sure you want to leave this page?</p>
        </Dialog>
      </div>
    );
  }
}

export default withAuthentication(
  connect((state) => ({
    pageLoading: state.notifications.pageLoading,
    notificationMessage: state.notifications.message,
    displayFormNavWarning: state.notifications.displayFormNavWarning,
    displayNotification: state.notifications.display,
  }))(Layout),
);
