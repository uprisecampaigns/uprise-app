import React, { Component, PropTypes } from 'react';

import Link from 'components/Link';

import s from 'styles/Page.scss';


class Privacy extends Component {
  render() {
    const { title, html } = this.props.content;

    return (
      <div className={s.root}>
        <div className={s.privacyContainer}>
          {title && <h1>{title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    );
  }
}

export default Privacy;
