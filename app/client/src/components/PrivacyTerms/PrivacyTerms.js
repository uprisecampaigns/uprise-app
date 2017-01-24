import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import loginStyle from '../LoginForm/LoginForm.scss';
import termsStyle from './PrivacyTerms.scss';


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
      <div className={loginStyle.outerContainer}>
        <div className={loginStyle.innerContainer}>
          <Paper zDepth={2}>
            <div className={termsStyle.termsContainer}>
              <h1 className={termsStyle.header}>Privacy and Terms</h1>
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
              onTouchTap={cancel} 
              label="Cancel" 
              className={termsStyle.button}
            />
            <RaisedButton 
              onTouchTap={agreeToTerms} 
              primary={true} 
              label="Agree" 
              className={termsStyle.button}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default PrivacyTerms;
