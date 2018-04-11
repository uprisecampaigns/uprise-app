import React from 'react';

import BrowseHeader from 'components/BrowseHeader';
import SearchActions from 'components/SearchActions';

import s from 'styles/Volunteer.scss';


function BrowseRoles(props) {
  return (
    <div className={s.outerContainer}>

      <BrowseHeader />

      <div className={s.headerTitle}>
        Sign up for a Role
      </div>
      <div className={s.subHeader}>
        120 Volunteer Roles
      </div>
      <div className={s.subHeader}>
        Learn more &gt;
      </div>

      <hr />

      <div className={s.searchContainer}>
        <SearchActions />
      </div>

    </div>
  );
}

export default BrowseRoles;
