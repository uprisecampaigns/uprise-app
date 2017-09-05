import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import SearchActions from 'components/SearchActions';
import SearchCampaigns from 'components/SearchCampaigns';

import s from 'styles/Home.scss';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      activeTab: value,
    });
  };

  render() {
    const { activeTab } = this.state;

    return (
      <div className={s.outerContainer}>
        <Tabs
          className={s.tabs}
          contentContainerClassName={s.tabsContentContainer}
          onChange={this.handleChange}
          value={this.state.slideIndex}
          inkBarStyle={{ backgroundColor: '#333' }}
        >

          <Tab
            label="Opportunities"
            className={activeTab === 0 ? s.activeTab : s.tab}
            value={0}
          >
            <SearchActions />
          </Tab>

          <Tab
            label="Campaigns"
            className={activeTab === 1 ? s.activeTab : s.tab}
            value={1}
          >
            <SearchCampaigns />
          </Tab>

        </Tabs>
      </div>
    );
  }
}

export default Home;
