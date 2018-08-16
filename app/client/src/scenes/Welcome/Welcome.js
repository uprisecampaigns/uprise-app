import React from 'react';
import Link from 'components/Link';

import s from 'styles/Page.scss';

const Welcome = () => (
  <div className={s.outerContainer}>
    <div className={s.innerContainer}>
      <div className={s.sectionHeaderContainer}>
        <div className={s.pageHeader}>Welcome to UpRise!</div>
      </div>
      <div className={s.sectionSubHeader}>What would you like to do?</div>
      <div className={s.sectionsContainer}>
        <div className={s.section}>
          <div className={[s.centerButtons, s.panel].join(' ')}>
            <Link to="/settings/activities" className={s.primaryButton}>
              Volunteer
            </Link>

            <Link to="/organize" className={[s.primaryButton, s.nextButton].join(' ')}>
              Recruit Volunteers
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Welcome;
