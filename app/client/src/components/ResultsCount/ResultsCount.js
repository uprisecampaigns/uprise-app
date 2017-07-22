import React, { PureComponent, PropTypes } from 'react';


class ResultsCount extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    items: PropTypes.array,
    total: PropTypes.number,
    graphqlLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    items: [],
    total: 0,
  }

  shouldComponentUpdate(nextProps) {
    return (!nextProps.graphqlLoading && typeof nextProps.items === 'object');
  }

  render() {
    const resultsCount = this.props.total || (this.props.items ? this.props.items.length : 0);
    return (
      <span>
        {resultsCount} results
      </span>
    );
  }
}

export default ResultsCount;
