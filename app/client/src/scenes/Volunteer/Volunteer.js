import React from 'react';

import Commitments from '../ActionCommitments';
import Subscriptions from '../CampaignSubscriptions';

import s from 'styles/Volunteer.scss';

function Volunteer(props) {
  return (
    <div className={s.outerContainer}>
      <div className={s.innerContainer}>
        <div className={s.sectionHeaderContainer}>
          <div className={s.pageHeader}>Volunteer</div>
        </div>

        <div className={s.sectionsContainer}>
          <div className={s.section}>
            <Commitments />
            <Subscriptions />
          </div>
        </div>
      </div>
    </div>
  );
}


export default Volunteer;
