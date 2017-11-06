import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import { pressedSignup, closedModal } from 'actions/ActionSignupActions';

import ConnectedRegisterLogin from './components/RegisterLogin';
import ConnectedActionSignupModal from './components/ActionSignupModal';

import s from './SignupRegisterLogin.scss';


class SignupRegisterLogin extends React.PureComponent {
  static propTypes = {
    action: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    signupModalOpen: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  render() {
    const {
      action,
      loggedIn,
      signupModalOpen,
      dispatch,
      ...props
    } = this.props;

    return (
      <div
        {...props}
      >
        { loggedIn ? (
          <div>
            { action.attending ? (
              <div>Change your...</div>
            ) : (
              <div>
                { action.ongoing ? (
                  <div>
                    <FlatButton
                      label="Signup"
                      onClick={event => dispatch(pressedSignup(action))}
                    />
                  </div>
                ) : (
                  <div>
                    <FlatButton
                      label="Select shift(s)"
                      onClick={event => dispatch(pressedSignup(action))}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={s.header}>
            Register or login to volunteer for this
            <ConnectedRegisterLogin />
          </div>
        )}

        { signupModalOpen &&
          <Dialog
            modal={false}
            open={signupModalOpen}
            onRequestClose={() => dispatch(closedModal())}
          >
            <ConnectedActionSignupModal />
          </Dialog>
        }

      </div>
    );
  }
}


const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingAuthUpdate: state.userAuthSession.fetchingAuthUpdate,
  signupModalOpen: state.actionSignup.modalOpen,
});

export default connect(mapStateToProps)(SignupRegisterLogin);
