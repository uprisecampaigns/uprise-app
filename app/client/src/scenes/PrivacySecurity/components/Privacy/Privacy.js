/* eslint-disable react/no-danger */
import React, { PureComponent, PropTypes } from 'react';

import s from 'styles/Page.scss';


class Privacy extends PureComponent {
  static propTypes = {
    content: PropTypes.shape({
      title: PropTypes.string,
      html: PropTypes.string,
    }).isRequired,
  }

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
