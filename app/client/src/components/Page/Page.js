/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';

import React, { PureComponent } from 'react';
import s from 'styles/Page.scss';

class Page extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    html: PropTypes.string.isRequired,
  };

  static defaultProps = {
    title: undefined,
  }

  render() {
    const { title, html } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          {title && <h1>{title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    );
  }
}

export default Page;
