import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/Link';

import s from 'styles/Footer.scss';

function Footer(props) {
  return (
    <div className={s.outerFooterContainer}>
      <div className={s.footer}>
        <div className={s.footerColumn}>
          <div className={s.section}>
            <div className={s.sectionHeader}>
              Community
            </div>
            <div className={s.sectionContent}>
              <div>Get updates on the UpRise community.</div>
              <Link useAhref>Subscribe to our newsletter</Link>
            </div>
          </div>
          <div className={s.section}>
            <div className={s.sectionHeader}>
              Support
            </div>
            <div className={s.sectionContent}>
              <div>Become a supporting member of UpRise</div>
              <Link useAhref>Contribute today</Link>
            </div>
          </div>
        </div>
        <div className={s.footerColumn}>
          <div className={s.section}>
            <div className={s.sectionHeader}>
              Contact Us
            </div>
            <div className={[s.sectionContent, s.addressesList].join(' ')}>
              <div>Email: staff@uprise.org</div>
              <div>3600 Monument Ave #12</div>
              <div>Richmond, VA 23230</div>
              <div>1442A Walnut St #149</div>
              <div>Berkeley, CA 94709</div>
            </div>
          </div>
        </div>
        <div className={s.footerColumn}>
          <div className={s.section}>
            <div className={s.sectionHeader}>
              Campaign Coordinator
            </div>
            <div className={s.sectionContent}>
              <div>Create, manage, and run campaigns.</div>
            </div>
          </div>
          <div className={s.section}>
            <div className={s.sectionHeader}>
              Share UpRise
            </div>
            <div className={s.sectionContent}>
              <div>Facebook link, twitter, etc</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
