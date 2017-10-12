import PropTypes from 'prop-types';
import React, { Component } from 'react';

import s from 'styles/Organize.scss';


class ReviewDetails extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

  }

  render() {
    const { action } = this.props;

    return (
      <div>
        <div>
          <div>
            Title: {action.title}
          </div>
          <div>
            Address: {action.streetAddress}
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewDetails;
