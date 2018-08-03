import React from 'react';
import Link from 'components/Link';

import s from 'styles/Page.scss';

const Welcome = () => (
  <div className={s.outerContainer}>
    <div className={s.innerContainer}>
      <div className={s.sectionHeaderContainer}>
        <div className={s.pageHeader}>Email confirmed!</div>
      </div>
      <div className={s.sectionsContainer}>
        <div className={s.section}>
          <div className={[s.centerButtons, s.panel].join(' ')}>
            <p>Want to volunteer?</p>
            <Link to="/settings/edit-profile" className={s.primaryButton}>
              Update your profile
            </Link>
          </div>
        </div>
        <div className={s.section}>
          <div className={[s.centerButtons, s.panel].join(' ')}>
            <p>Want to recriuit volunteers?</p>
            <Link to="/organize/create-campaign" className={s.primaryButton}>
              Create a campaign
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Welcome;
