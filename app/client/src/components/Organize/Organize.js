
import React, { Component, PropTypes } from 'react';
import ContentNavigation from 'components/ContentNavigation';

const selections = [
  { title: 'view all', path: 'view-all' },
  { title: 'create campaign', path: 'create-campaign' }
];

const baseUrl = '/organize';

class Organize extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    selected: PropTypes.string.isRequired
  };

  render() {
    const selected = selections.findIndex( (i) => {
      return i.path === this.props.selected;
    });

    return (
      <div>
        <ContentNavigation
          baseUrl={baseUrl}
          selections={selections}
          selected={selected}
        />
        {this.props.children}
      </div>
    );
  }
}

export default Organize;
