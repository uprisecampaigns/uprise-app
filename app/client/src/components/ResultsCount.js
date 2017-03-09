
import React, { Component, PropTypes } from 'react';
const isEqual = require('lodash.isequal');


class ResultsCount extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
    graphqlLoading: PropTypes.bool.isRequired
  }
 
  shouldComponentUpdate(nextProps) {
    return !(nextProps.graphqlLoading ||
             isEqual(this.props.items, nextProps.items))
  }

  render() {
    const resultsCount = this.props.items.length;
    return (
      <span>
        {resultsCount} results
      </span>
    );
  }
}

export default ResultsCount;
