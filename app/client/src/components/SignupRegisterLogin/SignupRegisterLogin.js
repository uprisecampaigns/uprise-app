import PropTypes from 'prop-types';
import React from 'react';
import Popover from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import FlatButton from 'material-ui/FlatButton';

import Link from 'components/Link';

import { pressedSignup, closedModal } from 'actions/ActionSignupActions';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import RegisterLogin from './components/RegisterLogin';
import ActionSignupModal from './components/ActionSignupModal';

import s from './SignupRegisterLogin.scss';


class SignupRegisterLogin extends React.Component {
  static propTypes = {
    action: PropTypes.object.isRequired,
    userObject: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    signupModalOpen: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      action,
      userObject,
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
            <RegisterLogin />
          </div>
        )}

        { signupModalOpen &&
          <Dialog
            modal={false}
            open={signupModalOpen}
            onRequestClose={() => dispatch(closedModal())}
          >
            <ActionSignupModal />
          </Dialog>
        }

      </div>
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : {
      email: '',
    },
  }),
  skip: ownProps => !ownProps.loggedIn && !ownProps.fetchingAuthUpdate,
});

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingAuthUpdate: state.userAuthSession.fetchingAuthUpdate,
  signupModalOpen: state.actionSignup.modalOpen,
});

export default compose(
  connect(mapStateToProps),
  withMeQuery,
)(SignupRegisterLogin);
