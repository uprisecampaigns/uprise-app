import PropTypes from 'prop-types';
import React from 'react';
import Popover from 'material-ui/Popover';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import Link from 'components/Link';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import RegisterLogin from './components/RegisterLogin';

import s from './SignupRegisterLogin.scss';


class SignupRegisterLogin extends React.Component {
  static propTypes = {
    userObject: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { userObject, loggedIn, ...props } = this.props;

    return (
      <div
        {...props}
      >
        { loggedIn ? (
          <div>Volunteer for this</div>
        ) : (
          <div className={s.header}>
            Register or login to volunteer for this
            <RegisterLogin />
          </div>
        )}
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
});

export default compose(
  connect(mapStateToProps),
  withMeQuery,
)(SignupRegisterLogin);
