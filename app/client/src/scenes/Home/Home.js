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
    user: PropTypes.object,
  }

  static defaultProps = {
    page: 'action',
    user: undefined,
  }

  handleChange = (value) => {
    this.props.dispatch(setPage('home', value));
  };

  render() {
    const { user } = this.props;
    const activeTab = this.props.page;

    const hasCampaigns = typeof user === 'object' && Array.isArray(user.campaigns) && user.campaigns.length;

    // Too difficult to override in css :/
    const inkBarStyle = {
      backgroundColor: '#333',
      width: hasCampaigns ? '25%' : '35%',
      height: '3px',
      marginLeft: hasCampaigns ? '4%' : '7.5%',
      marginBottom: '0px',
    };

    return (
      <div className={s.outerContainer}>
        <div className={s.tabsOuterContainer}>
          <div className={s.tabsInnerContainer}>
            <Tabs
              className={s.tabs}
              contentContainerClassName={s.tabsContentContainer}
              onChange={this.handleChange}
              value={activeTab}
              inkBarStyle={inkBarStyle}
            >
              <Tab
                label="Opportunities"
                className={activeTab === 'action' ? s.activeTab : s.tab}
                value="action"
              />

              <Tab
                label="Campaigns"
                className={activeTab === 'campaigns' ? s.activeTab : s.tab}
                value="campaign"
              />

              { hasCampaigns && (
                <Tab
                  label="Volunteers"
                  className={activeTab === 'users' ? s.activeTab : s.tab}
                  value="user"
                />
              )}
            </Tabs>
          </div>
        </div>

        <div>
          { (activeTab === 'action') && (
            <div className={s.searchContainer}>
              <SearchActions />
            </div>
          )}

          { (activeTab === 'campaign') && (
            <div className={s.searchContainer}>
              <SearchCampaigns />
            </div>
          )}

          { (activeTab === 'user') && (
            <div className={s.searchContainer}>
              <SearchUsers />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  page: state.homePageNav.page,
});

export default compose(
  connect(mapStateToProps),
  graphql(MeQuery, {
    options: ownProps => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      user: data.me,
    }),
  }),
)(Home);
