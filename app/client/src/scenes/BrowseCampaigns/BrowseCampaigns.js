import React from 'react';

import SearchCampaigns from 'components/SearchCampaigns';

import s from 'styles/Volunteer.scss';

function BrowseCampaigns(props) {
  return (
    <div className={s.outerContainer}>

      <div className={s.headerTitle}>
        Follow Campaigns
      </div>
      <div className={s.subHeader}>
        Get updates about volunteer opportunities
      </div>

      <hr />

      <div className={s.searchContainer}>
        <SearchCampaigns />
      </div>

    </div>
  );
}

export default BrowseCampaigns;
