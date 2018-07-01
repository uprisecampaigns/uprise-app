import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Tabs, Tab } from 'material-ui/Tabs';

import SearchActions from 'components/SearchActions';
import SearchCampaigns from 'components/SearchCampaigns';
import SearchUsers from 'components/SearchUsers';

import { setPage } from 'actions/PageNavActions';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import s from 'styles/Home.scss';

class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.string,
    // user: PropTypes.object,
  };

  static defaultProps = {
    page: 'action',
    // user: undefined,
  };

  handleChange = (value) => {
    this.props.dispatch(setPage('home', value));
  };

  render() {
    // const { user } = this.props;
    const activeTab = this.props.page;

    // const hasCampaigns = typeof user === 'object' && Array.isArray(user.campaigns) && user.campaigns.length;

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          {activeTab === 'action' && (
            <div className={s.searchContainer}>
              <SearchActions />
            </div>
          )}

          {activeTab === 'campaign' && (
            <div className={s.searchContainer}>
              <SearchCampaigns />
            </div>
          )}

          {activeTab === 'user' && (
            <div className={s.searchContainer}>
              <SearchUsers />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  page: state.pageNav.page,
});

export default compose(
  connect(mapStateToProps),
  graphql(MeQuery, {
    options: (ownProps) => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      user: data.me,
    }),
  }),
)(Home);
