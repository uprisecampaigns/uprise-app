import React from 'react';

import BrowseHeader from 'components/BrowseHeader';
import BrowsePresentation from 'components/BrowsePresentation';

import s from 'styles/Volunteer.scss';


function BrowseEvents(props) {
  return (
    <div className={s.outerContainer}>

      <BrowseHeader />

      <div className={s.headerTitle}>
        Sign up for an Event
      </div>
      <div className={s.subHeader}>
        568+ Volunteer Events
      </div>
      <div className={s.subHeader}>
        Learn more &gt;
      </div>

      <hr />

      <BrowsePresentation
        type="event"
      />

    </div>
  );
}

export default BrowseEvents;
