/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';

import React, { PureComponent } from 'react';

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
