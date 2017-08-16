import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';

import Login from 'components/Login';
import Signup from 'components/Signup';

import layoutStyles from 'styles/Layout.scss';
import formStyles from 'styles/Form.scss';


class LoginModalPrompt extends Component {
  static propTypes = {
    displayLoginModal: PropTypes.bool.isRequired,
  }

  static defaultProps = {
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
        modal
        actionsContainerClassName={layoutStyles.modalActionsContainer}
        open={this.props.displayLoginModal}
      >
        { this.state.currentPage === 'login' ? (
          <div className={formStyles.loginContainer}>
            <p>
              Please sign up or log in to view this content.
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
  displayLoginModal: state.notifications.displayLoginModal,
}))(LoginModalPrompt);
