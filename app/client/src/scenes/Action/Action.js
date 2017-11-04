import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import ActionProfile from 'components/ActionProfile';


import {
  promptLogin, notify,
} from 'actions/NotificationsActions';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';

import ActionSignupMutation from 'schemas/mutations/ActionSignupMutation.graphql';
import CancelActionSignupMutation from 'schemas/mutations/CancelActionSignupMutation.graphql';

import s from 'styles/Profile.scss';


class Action extends Component {
  static propTypes = {
    action: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired,
    cancelSignup: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionSlug: PropTypes.string.isRequired,
  };

  static defaultProps = {
    action: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      modalOpen: false,
    };
  }

  signup = () => {
    if (this.props.loggedIn) {
      this.setState({ modalOpen: true });
    } else {
      this.props.dispatch(promptLogin({ exitable: true, title: 'Please login to sign up for this action.' }));
    }
  }

  confirmSignup = async () => {
    this.setState({ saving: true, modalOpen: false });
    try {
      await this.props.signup({
        variables: {
          actionId: this.props.action.id,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionCommitmentsQuery', 'SignedUpVolunteersQuery', 'ActionQuery'],
      });

      this.props.dispatch(notify('Signed up!'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      this.setState({ saving: false });
    }
  }

  cancelSignup = async () => {
    this.setState({ saving: true });
    try {
      await this.props.cancelSignup({
        variables: {
          actionId: this.props.action.id,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionCommitmentsQuery', 'SignedUpVolunteersQuery', 'ActionQuery'],
      });

      this.props.dispatch(notify('Signup canceled'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
      this.props.dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      this.setState({ saving: false });
    }
  }

  render() {
    if (this.props.action) {
      const { action } = this.props;
      const { modalOpen, saving } = this.state;
      const { signup, confirmSignup, cancelSignup } = this;

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={(event) => { event.preventDefault(); this.setState({ modalOpen: false }); }}
        />,
        <RaisedButton
          label="Confirm"
          primary
          onTouchTap={(event) => { event.preventDefault(); confirmSignup(); }}
          className={s.primaryButton}
        />,
      ];

      return (
        <div>

          <ActionProfile
            signup={signup}
            cancelSignup={cancelSignup}
            action={action}
            saving={saving}
          />

          {modalOpen && (
            <Dialog
              title="Permission to Share?"
              modal
              actions={modalActions}
              actionsContainerClassName={s.modalActionsContainer}
              open={modalOpen}
              autoScrollBodyContent
            >
              <p>
                May we have your permission to share your email address  and phone number
                with the coordinator for the purpose of contacting you about this opportunity?
              </p>
            </Dialog>
          )}

        </div>
      );
    }
    return null;
  }
}

const withActionQuery = graphql(ActionQuery, {
  options: ownProps => ({
    variables: {
      search: {
        slug: ownProps.actionSlug,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    action: data.action,
  }),
});

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
});

export default compose(
  connect(mapStateToProps),
  withActionQuery,
  graphql(ActionSignupMutation, { name: 'signup' }),
  graphql(CancelActionSignupMutation, { name: 'cancelSignup' }),
)(Action);
