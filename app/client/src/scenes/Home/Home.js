import React from 'react';
import FlatButton from 'material-ui/FlatButton';

import Link from 'components/Link';

import s from 'styles/Page.scss';


function Home(props) {
  return (
    <div className={s.root}>
      <div
        className={s.homeContentSection1}
      >
        <div className={s.fullContainer}>
          <div className={s.contentTitle}>Take Action</div>
          <div className={s.contentText}>
            UpRise is reforming our political campaign process by putting you back in the drivers&apos; seat.
            Sign up now to find volunteering opportunities or create a page so volunteers can find you.
          </div>
          <div className={s.homeButtonContainer}>
            <Link
              useAhref={false}
              to="/signup"
            >
              <FlatButton
                className={s.homeButton}
                label="Sign up now"
              />
            </Link>
          </div>
        </div>
      </div>

      <div
        className={s.homeContentSection2}
      >
        <div className={s.fullContainer}>
          <div className={s.contentTitle}>Volunteers</div>
          <div className={s.contentText}>
            UpRise is a social network platform you can use to organize your political life: to find, sign up for and create real-world actions.
          </div>
          <div className={s.linkContainer}>
            <Link
              useAhref
              to="uprisecampaigns.org/home/volunteers"
              external
              sameTab
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div
        className={s.homeContentSection3}
      >
        <div className={s.fullContainer}>
          <div className={s.contentTitle}>Campaigns</div>
          <div className={s.contentText}>
            UpRise will connect you with new volunteers and provide the tools you need to create effective volunteer-powered campaigns.
          </div>
          <div className={s.linkContainer}>
            <Link
              useAhref
              to="uprisecampaigns.org/home/campaigns"
              external
              sameTab
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div
        className={s.homeContentSection4}
      >
        <div className={s.fullContainer}>
          <div className={s.halfContainer}>
            <div className={s.contentTitle}>Subscribe</div>
            <div className={s.contentText}>
              Subscribe today and join the UpRise community.
            </div>
            <div className={s.homeButtonContainer}>
              <Link
                useAhref={false}
                to="https://act.myngp.com/Forms/-8815703986835813888"
                external
                sameTab
              >
                <FlatButton
                  className={s.homeButton}
                  label="Get the Newsletter"
                />
              </Link>
            </div>
          </div>

          <div className={s.halfContainer}>
            <div className={s.contentTitle}>Support</div>
            <div className={s.contentText}>
              Become a supporting member of UpRise.
            </div>
            <div className={s.homeButtonContainer}>
              <Link
                useAhref={false}
                to="https://act.myngp.com/Forms/-8527473610684102144"
                external
                sameTab
              >
                <FlatButton
                  className={s.homeButton}
                  label="Contribute Today"
                />
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div
        className={s.homeContentSection5}
      >
        <div className={s.fullContainer}>
          <div className={s.contentTitle}>Contact Us</div>
          <div className={s.contentText}>
            Email: staff@uprise.org
          </div>
          <div className={s.contentText}>
            1442A Walnut St #149 | Berkeley | CA | 94709
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
