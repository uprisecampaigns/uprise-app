import React, { Component, PropTypes } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import SearchActions from 'components/SearchActions';
import SearchCampaigns from 'components/SearchCampaigns';

import s from 'styles/Home.scss';


class Home extends Component {
  static propTypes = {
    startTab: PropTypes.number,
  }

  static defaultProps = {
    startTab: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.startTab,
    };
  }

  handleChange = (value) => {
    this.setState({
      activeTab: value,
    });
  };

  render() {
    const { activeTab } = this.state;

    // Too difficult to override in css :/
    const inkBarStyle = {
      backgroundColor: '#333',
      width: '35%',
      height: '3px',
      marginLeft: '7.5%',
      marginBottom: '2px',
    };

    return (
      <div className={s.outerContainer}>
        <Tabs
          className={s.tabs}
          contentContainerClassName={s.tabsContentContainer}
          onChange={this.handleChange}
          value={activeTab}
          inkBarStyle={inkBarStyle}
        >
          <Tab
            label="Opportunities"
            className={activeTab === 0 ? s.activeTab : s.tab}
            value={0}
          />

          <Tab
            label="Campaigns"
            className={activeTab === 1 ? s.activeTab : s.tab}
            value={1}
          />
        </Tabs>

        <SwipeableViews
          index={activeTab}
          onChangeIndex={this.handleChange}
        >
          <div className={s.searchContainer}>
            <SearchActions />
          </div>
          <div className={s.searchContainer}>
            <SearchCampaigns />
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default Home;
