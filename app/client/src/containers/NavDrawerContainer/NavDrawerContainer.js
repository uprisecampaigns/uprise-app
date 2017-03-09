import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { attemptLogout } from 'actions/AuthActions';
import { graphql, compose } from 'react-apollo';

import { MeQuery } from 'schemas/queries';

import NavDrawer from 'components/NavDrawer';

class NavDrawerContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleToggle: PropTypes.func.isRequired,
    onRequestChange: PropTypes.func.isRequired,
  };

  clickedLogout = (event) => {
    this.props.dispatch(attemptLogout());
  }

  render() {
    return (
      <NavDrawer
        open={this.props.open}
        handleToggle={this.props.handleToggle}
        onRequestChange={this.props.onRequestChange}
        logout={this.clickedLogout}
        loggedIn={this.props.loggedIn}
        userObject={this.props.userObject}
      />
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : {
      first_name: '',
      last_name: '',
      email: '',
    }
  }),
  skip: (ownProps) => !ownProps.loggedIn,
});

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
  };
}

export default compose(
  connect(mapStateToProps),
  withMeQuery,
)(NavDrawerContainer);
