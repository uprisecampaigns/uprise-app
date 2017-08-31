import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';

import Login from 'components/Login';
import Signup from 'components/Signup';

import layoutStyles from 'styles/Layout.scss';
import formStyles from 'styles/Form.scss';

import {
  hideLoginPrompt,
} from 'actions/NotificationsActions';


class LoginModalPrompt extends Component {
  static propTypes = {
    loginModal: PropTypes.shape({
      display: PropTypes.bool,
      title: PropTypes.string,
      exitable: PropTypes.bool,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'login',
    };

    require.ensure([], (require) => {
      this.setState({
        termsContent: require('content/terms.md'),
      });
    });
  }

  closeModal = () => {
    this.props.dispatch(hideLoginPrompt());
  }

  render() {
    const handleSignupClick = (event) => {
      (typeof event.preventDefault === 'function') && event.preventDefault();

      this.setState({ currentPage: 'signup' });
    };

    const handleCancel = (event) => {
      (typeof event.preventDefault === 'function') && event.preventDefault();
      this.setState({ currentPage: 'login' });
    };

    return (
      <Dialog
        modal={!this.props.loginModal.exitable}
        onRequestClose={this.closeModal}
        actionsContainerClassName={layoutStyles.modalActionsContainer}
        open={this.props.loginModal.display}
        autoScrollBodyContent
      >
        { this.state.currentPage === 'login' ? (
          <div className={formStyles.loginContainer}>
            <p>
              { this.props.loginModal.title }
            </p>
            <Login
              handleSignupClick={handleSignupClick}
            />
          </div>
        ) : (
          <Signup
            handleCancel={handleCancel}
            termsContent={this.state.termsContent}
          />
        )}
      </Dialog>
    );
  }
}


export default connect(state => ({
  loginModal: state.notifications.loginModal,
}))(LoginModalPrompt);
