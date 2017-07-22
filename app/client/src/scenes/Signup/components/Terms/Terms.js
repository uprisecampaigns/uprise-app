/* eslint-disable react/no-danger */
import React, { PureComponent, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import formStyle from 'styles/Form.scss';
import pageStyle from 'styles/Page.scss';


class Terms extends PureComponent {
  static propTypes = {
    agreeToTerms: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    content: PropTypes.object.isRequired,
  }

  render() {
    const { agreeToTerms, cancel, content } = this.props;
    const { title, html } = content;

    return (
      <div>
        <div className={pageStyle.root}>
          <div className={pageStyle.termsContainer}>
            {title && <h1>{title}</h1>}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
        <div className={formStyle.outerContainer}>
          <div className={formStyle.innerContainer}>
            <RaisedButton
              onTouchTap={cancel}
              label="Cancel"
              className={formStyle.button}
            />
            <RaisedButton
              onTouchTap={agreeToTerms}
              primary
              label="I Agree"
              className={[formStyle.secondaryButton, formStyle.button].join(' ')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Terms;
