
import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';

import Link from 'components/Link';


class SearchOpportunities extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
  }

  render() {
    return (
      <div>title: {this.props.title}</div>
    );
  }
}

export default SearchOpportunities;
