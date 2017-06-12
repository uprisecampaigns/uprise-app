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
          <div className={s.contentTitle}>Take Action</div>
          <div className={s.contentText}>
            UpRise is reforming our political campaign process by putting you back in the drivers' seat. Sign up now to find volunteering opportunities or create a page so volunteers can find you.
          </div>
          <div className={s.signupButtonContainer}>
            <Link
              useAhref={false}
              to="/signup"
            >
              <FlatButton
                className={s.signupButton}
                label="Sign up now"
              />
            </Link>
          </div>
        </div>
        <div
          className={s.homeContentSection2}
        >
          <div className={s.contentTitle}>Volunteers</div>
          <div className={s.contentText}>
            UpRise is a social network platform you can use to organize your political life: to find, sign up for and create real-world actions on behalf of candidates and issues.
          </div>
        </div>
        <div
          className={s.homeContentSection3}
        >
        <div className={s.contentTitle}>Campaigns</div>
          <div className={s.contentText}>
            UpRise will connect you with new volunteers and provide the tools you need to create effective volunteer-powered campaigns.
          </div>
        </div>
        <div
          className={s.homeContentSection4}
        >
        </div>
      </div>
    );
  }
}

export default Home;
