import React from 'react';
import { connect } from 'react-redux';

import Home from 'scenes/Home';
import Page from 'components/Page';


class HomeWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { fetchingUpdate, loggedIn, ...props } = this.props;

    if (!fetchingUpdate && loggedIn) {
      return (
        <Page {...props} />
      );
    }
    return (
      <Home {...props} />
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingUpdate: state.userAuthSession.fetchingAuthUpdate,
});

export default connect(mapStateToProps)(HomeWrapper);
