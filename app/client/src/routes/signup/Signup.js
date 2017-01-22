import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import SignupFormContainer from 'containers/SignupFormContainer';


class Signup extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <SignupFormContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
  };
}

export default connect(mapStateToProps)(Signup);
