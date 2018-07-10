/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';

import React, { PureComponent } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import content from 'content/terms.md';

import formStyle from 'styles/Form.scss';
import pageStyle from 'styles/Page.scss';

class Terms extends PureComponent {
  static propTypes = {
    agreeToTerms: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  };

  render() {
    const { agreeToTerms, cancel } = this.props;
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
            <div className={formStyle.button} onClick={cancel} onKeyPress={cancel} role="button" tabIndex="0">
              Cancel
            </div>
            <div
              className={formStyle.primaryButton}
              onClick={agreeToTerms}
              onKeyPress={agreeToTerms}
              role="button"
              tabIndex="0"
            >
              I Agree
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Terms;
