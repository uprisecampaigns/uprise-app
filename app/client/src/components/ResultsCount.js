
import React, { Component, PropTypes } from 'react';
const isEqual = require('lodash.isequal');


class ResultsCount extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    items: PropTypes.array,
    graphqlLoading: PropTypes.bool.isRequired
  }

  render() {
    const resultsCount = this.props.items ? this.props.items.length : 0;
    return (
      <span>
        {resultsCount} results
      </span>
    );
  }
}

export default ResultsCount;
