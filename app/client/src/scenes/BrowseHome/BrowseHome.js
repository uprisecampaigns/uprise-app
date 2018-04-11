import React from 'react';

import BrowseHeader from 'components/BrowseHeader';
import SearchActions from 'components/SearchActions';

import s from 'styles/Volunteer.scss';


function BrowseHome(props) {
  return (
    <div className={s.outerContainer}>

      <BrowseHeader />

      <div className={s.headerTitle}>
        Your direct connection to political campaigns
      </div>
      <div className={s.subHeader}>
        A selection of 1000+ volunteer events and roles near you.
      </div>
      <div className={s.subHeader}>
        Learn more &gt;
      </div>

      <hr />

      <SearchActions />

    </div>
  );
}

export default BrowseHome;
