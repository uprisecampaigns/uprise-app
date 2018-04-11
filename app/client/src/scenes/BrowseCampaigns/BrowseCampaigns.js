import React from 'react';

import BrowseHeader from 'components/BrowseHeader';
import SearchCampaigns from 'components/SearchCampaigns';

import s from 'styles/Volunteer.scss';

function BrowseCampaigns(props) {
  return (
    <div className={s.outerContainer}>

      <BrowseHeader />

      <div className={s.headerTitle}>
        Follow a Campaign
      </div>
      <div className={s.subHeader}>
        23 Campaigns
      </div>
      <div className={s.subHeader}>
        Learn more &gt;
      </div>

      <hr />

      <div className={s.searchContainer}>
        <SearchCampaigns />
      </div>

    </div>
  );
}

export default BrowseCampaigns;
