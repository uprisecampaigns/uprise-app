import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';

import { setPage } from 'actions/PageNavActions';

import SearchActions from 'components/SearchActions';
import SearchCampaigns from 'components/SearchCampaigns';

import s from 'styles/Home.scss';

// Too difficult to override in css :/
const inkBarStyle = {
  backgroundColor: '#333',
  width: '35%',
  height: '3px',
  marginLeft: '7.5%',
  marginBottom: '0px',
};

class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.string,
  }

  static defaultProps = {
    page: 'action',
  }

  handleChange = (value) => {
    this.props.dispatch(setPage('home', value));
  };

  render() {
    const activeTab = this.props.page;

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
            </Tabs>
          </div>
        </div>

        { (activeTab === 'action') ? (
          <div className={s.searchContainer}>
            <SearchActions />
          </div>
        ) : (
          <div className={s.searchContainer}>
            <SearchCampaigns />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  page: state.homePageNav.page,
});

export default connect(mapStateToProps)(Home);
