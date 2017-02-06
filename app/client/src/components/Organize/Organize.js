
import React, { Component, PropTypes } from 'react';
import ContentNavigation from 'components/ContentNavigation';

const selections = ['view-all', 'create-campaign'];
const baseUrl = '/organize';

class Organize extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    selected: PropTypes.string.isRequired
  };

  render() {
    const selected = selections.indexOf(this.props.selected);

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
