import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import ChangePasswordFormContainer from 'containers/ChangePasswordFormContainer';


class ChangePassword extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <ChangePasswordFormContainer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
  };
}

export default connect(mapStateToProps)(ChangePassword);
