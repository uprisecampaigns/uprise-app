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
  };

  render() {
    const { title, html } = this.props;
    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          {title && (
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{title}</div>
            </div>
          )}

          <div className={s.sectionsContainer}>
            <div className={s.section}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
