import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Link from 'components/Link';

import { pressedSignup } from 'actions/ActionSignupActions';

import s from 'styles/SignupRegisterLogin.scss';

import ConnectedRegisterLogin from './components/RegisterLogin';
import ConnectedActionSignupModal from './components/ActionSignupModal';

class SignupRegisterLogin extends React.PureComponent {
  static propTypes = {
    action: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    signupModalOpen: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { action, loggedIn, signupModalOpen, dispatch, ...props } = this.props;

    return (
      <div {...props}>
        {loggedIn ? (
          <div className={s.container}>
            {action.attending ? (
              <div>
                <div className={s.header}>You've signed up to volunteer for this event!</div>
                <div className={s.content}>
                  We understand things come up and you may need to make changes to your schedule.
                </div>
                {action.ongoing ? (
                  <div
                    className={s.darkButton}
                    onClick={(event) => dispatch(pressedSignup(action))}
                    onKeyPress={(event) => dispatch(pressedSignup(action))}
                    role="button"
                    tabIndex="0">
                    Cancel my commitment
                  </div>
                ) : (
                  <div
                    className={s.darkButton}
                    onClick={(event) => dispatch(pressedSignup(action))}
                    onKeyPress={(event) => dispatch(pressedSignup(action))}
                    role="button"
                    tabIndex="0">
                    Edit my Shifts
                  </div>
                )}
              </div>
            ) : (
              <div>
                {action.ongoing ? (
                  <div>
                    <div className={s.header}>Sign up for this Role</div>
                    <div
                      className={s.darkButton}
                      onClick={(event) => dispatch(pressedSignup(action))}
                      onKeyPress={(event) => dispatch(pressedSignup(action))}
                      role="button"
                      tabIndex="0">
                      Sign up
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={s.header}>Volunteer for this Event</div>
                    <div
                      className={s.darkButton}
                      onClick={(event) => dispatch(pressedSignup(action))}
                      onKeyPress={(event) => dispatch(pressedSignlup(action))}
                      role="button"
                      tabIndex="0">
                      Select shift(s)
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className={s.header}>
              Please create an account before taking action
              {/*
              <ConnectedRegisterLogin />
            */}
            </div>
            <div className={s.centerFlexButtons}>
              <Link to="/signup" className={s.darkButton}>
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingAuthUpdate: state.userAuthSession.fetchingAuthUpdate,
  signupModalOpen: state.actionSignup.modalOpen,
});

export default connect(mapStateToProps)(SignupRegisterLogin);
