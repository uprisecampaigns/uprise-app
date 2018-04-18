import React from 'react';

import BrowseHeader from 'components/BrowseHeader';
import SearchActions from 'components/SearchActions';

import s from 'styles/Volunteer.scss';


function BrowseEvents(props) {
  return (
    <div className={s.outerContainer}>

      <BrowseHeader />

      <hr />

      <div className={s.searchContainer}>
        <SearchActions showRoles={false} />
      </div>

    </div>
  );
}

export default BrowseEvents;
