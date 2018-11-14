import React from 'react';
import Link from 'components/Link';

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
            <div className={s.sectionSubHeader}>Find volunteer opportunities</div>
            <div className={s.sectionInnerContent}>
              <Link to="/search" className={s.flatButton}>
                Search Opportunities <span>Find something that suits you</span>
              </Link>
              <Link to="/search/search-campaigns" className={s.flatButton}>
                Search Campaigns <span>Show your support!</span>
              </Link>
            </div>

            <div className={s.sectionSubHeader}>Manage Volunteer Opportunities</div>
            <div className={s.sectionInnerContent}>
              <Link to="/volunteer/opportunity-commitments" className={s.flatButton}>
                My Opportunities <span>Opportunities you've volunteered for</span>
              </Link>
              <Link to="/volunteer/campaign-subscriptions" className={s.flatButton}>
                Followed Campaigns <span>Be ready for new opportunities!</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Volunteer;
