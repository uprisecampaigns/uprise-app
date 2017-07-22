import React, { PureComponent, PropTypes } from 'react';


class NotFound extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <div>
          <h1>{this.props.title}</h1>
          <p>Sorry, the page you were trying to view does not exist.</p>
        </div>
      </div>
    );
  }
}

export default NotFound;
