import React from 'react';

import Link from 'components/Link';

import upriseLogo from 'img/uprise-logo.png';

import s from 'styles/Footer.scss';

function Footer(props) {
  return (
    <div className={s.outerFooterContainer}>
      <div className={s.footer}>
        <div className={s.footerRow}>
          <div className={s.footerColumn}>
            <div className={s.section}>
              <div className={s.sectionHeader}>Community</div>
              <div className={s.sectionContent}>
                <div>Get updates on the UpRise community.</div>
                <Link useAhref external to="https://act.myngp.com/Forms/-8815703986835813888">
                  Subscribe to our newsletter
                </Link>
              </div>
            </div>
            <div className={s.section}>
              <div className={s.sectionHeader}>Support</div>
              <div className={s.sectionContent}>
                <div>Become a supporting member of UpRise</div>
                <Link useAhref external to="https://uprisecampaigns.org/donate/">
                  Contribute today
                </Link>
              </div>
            </div>
          </div>
          <div className={s.footerColumn}>
            <div className={s.section}>
              <div className={s.sectionHeader}>Contact Us</div>
              <div className={[s.sectionContent, s.addressesList].join(' ')}>
                <div>
                  Email:{' '}
                  <Link to="mailto:help@uprise.org" useAhref mailTo external>
                    help@uprise.org
                  </Link>
                </div>
                <div>21001 N Tatum Blvd STE 1630 #618</div>
                <div>Phoenix, AZ 85050-4242</div>
              </div>
            </div>
          </div>
          <div className={s.footerColumn}>
            <div className={s.section}>
              <div className={s.sectionHeader}>More Info</div>
              <div className={[s.sectionContent, s.linkList].join(' ')}>
                <ul>
                  <li>
                    <Link useAhref external to="https://uprisecampaigns.org/">
                      About Uprise
                    </Link>
                  </li>
                  <li>
                    <Link useAhref external to="https://uprisecampaigns.org/people/">
                      Meet the team
                    </Link>
                  </li>
                  <li>
                    <Link useAhref external to="https://uprisecampaigns.org/campaignreform/">
                      Campaign reform
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={s.section}>
              <div className={s.sectionHeader}>Share UpRise</div>
              <div className={s.sectionContent}>
                <div>
                  <Link
                    to="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fuprise.org%2F"
                    className={s.shareBtnLink}
                    external
                  >
                    <div className={[s.shareBtn, s.shareFacebook].join(' ')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    to="https://twitter.com/intent/tweet/?text=Fixing%20our%20broken%20political%20system%20through%20volunteer%20empowerment.&amp;url=https%3A%2F%2Fuprise.org%2F"
                    className={s.shareBtnLink}
                    external
                  >
                    <div className={[s.shareBtn, s.shareTwitter].join(' ')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    to="https://plus.google.com/share?url=https%3A%2F%2Fuprise.org%2F"
                    className={s.shareBtnLink}
                    external
                  >
                    <div className={[s.shareBtn, s.shareGoogle].join(' ')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M11.37 12.93c-.73-.52-1.4-1.27-1.4-1.5 0-.43.03-.63.98-1.37 1.23-.97 1.9-2.23 1.9-3.57 0-1.22-.36-2.3-1-3.05h.5c.1 0 .2-.04.28-.1l1.36-.98c.16-.12.23-.34.17-.54-.07-.2-.25-.33-.46-.33H7.6c-.66 0-1.34.12-2 .35-2.23.76-3.78 2.66-3.78 4.6 0 2.76 2.13 4.85 5 4.9-.07.23-.1.45-.1.66 0 .43.1.83.33 1.22h-.08c-2.72 0-5.17 1.34-6.1 3.32-.25.52-.37 1.04-.37 1.56 0 .5.13.98.38 1.44.6 1.04 1.84 1.86 3.55 2.28.87.23 1.82.34 2.8.34.88 0 1.7-.1 2.5-.34 2.4-.7 3.97-2.48 3.97-4.54 0-1.97-.63-3.15-2.33-4.35zm-7.7 4.5c0-1.42 1.8-2.68 3.9-2.68h.05c.45 0 .9.07 1.3.2l.42.28c.96.66 1.6 1.1 1.77 1.8.05.16.07.33.07.5 0 1.8-1.33 2.7-3.96 2.7-1.98 0-3.54-1.23-3.54-2.8zM5.54 3.9c.33-.38.75-.58 1.23-.58h.05c1.35.05 2.64 1.55 2.88 3.35.14 1.02-.08 1.97-.6 2.55-.32.37-.74.56-1.23.56h-.03c-1.32-.04-2.63-1.6-2.87-3.4-.13-1 .08-1.92.58-2.5zM23.5 9.5h-3v-3h-2v3h-3v2h3v3h2v-3h3" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    to="https://www.linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2Fuprise.org%2F&amp;title=Fixing%20our%20broken%20political%20system%20through%20volunteer%20empowerment.&amp;summary=Fixing%20our%20broken%20political%20system%20through%20volunteer%20empowerment.&amp;source=https%3A%2F%2Fuprise.org%2F"
                    className={s.shareBtnLink}
                    external
                  >
                    <div className={[s.shareBtn, s.shareLinkedin].join(' ')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className={s.footerRow}>
          <div className={s.footerColumn}>
            <div className={[s.section, s.logoText].join(' ')}>UpRise</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
