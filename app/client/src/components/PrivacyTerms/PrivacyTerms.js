import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import s from '../LoginForm/LoginForm.scss';


class PrivacyTerms extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    agreeToTerms: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  }

  render() {
    const { data, agreeToTerms, cancel } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.termsContainer}>
              <h1>Privacy and Terms</h1>
              <p>
                We’re going to have some pretty special terms, as we’re
                going to have some very stringent privacy policies, plus
                here’s where we’re going to need to spell out in no
                uncertain terms that this is a place for people to engage
                in positive action, not yelling or attacking etc, and we’re
                going to use this opportunity to weed out right wing nut
                jobs and so on...
              </p>
              <p>
                We may want to make people initial certain bits about
                civility, the way they do when you rent a car.
              </p>
              <p>
                place for people to engage in positive action, not yelling
                or attacking etc, and we’re going to use this opportunity
                to weed out right wing nut jobs and so on...
              </p>
              <p>
                We’re going to have some pretty special terms, as we’re
                going to have some very stringent privacy policies, plus
                here’s where we’re going to need to spell out in n
                o uncertain terms that this is a place for people to
                engage in positive action, not yelling or attacking etc, and
                we’re going to use this opportunity to weed out right
                uncertain terms that this is a place for people to engage
                in positive action, not yelling or attacking etc, and we’re
              </p>
            </div>
            <RaisedButton 
              onTouchTap={agreeToTerms} 
              primary={true} 
              label="Agree" 
            />
            <RaisedButton 
              onTouchTap={cancel} 
              label="Cancel" 
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default PrivacyTerms;
