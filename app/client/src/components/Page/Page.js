
import React, { PropTypes } from 'react';
import s from 'styles/Page.scss';

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    html: PropTypes.string.isRequired,
  };


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
