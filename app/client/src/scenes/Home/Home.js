import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

import Link from 'components/Link';

import s from 'styles/Page.scss';


class Home extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div
          className={s.homeContentSection1}
        >
          <div className={s.fullContainer}>
            <div className={s.contentTitle}>Take Action</div>
            <div className={s.contentText}>
              UpRise is reforming our political campaign process by putting you back in the drivers' seat. Sign up now to find volunteering opportunities or create a page so volunteers can find you.
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
                useAhref={true}
                to="uprisecampaigns.org/home/volunteers"
                external={true}
                sameTab={true}
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
                useAhref={true}
                to="uprisecampaigns.org/home/campaigns"
                external={true}
                sameTab={true}
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
                  to="https://visitor.r20.constantcontact.com/manage/optin?v=001JE9EC3X285G_kaoRYfdmPxrbPdK8Ik4IArYNTm0iIH3MA1SEi58mP0Vvd-YxNqQBkj26WEtaDdwzXBQBcNia0-B8HO9tGvB0QOwviAD0KA0%3D"
                  external={true}
                  sameTab={true}
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
                  to="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CAMCB5VPGDAEQ"
                  external={true}
                  sameTab={true}
                >
                  <FlatButton
                    className={s.homeButton}
                    label="Join Today"
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
}

export default Home;
