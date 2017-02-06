
import React, { Component, PropTypes } from 'react';
import ContentNavigation from 'components/ContentNavigation';
import s from './Communications.scss';

const selections = [
  { title: 'notifications', path: 'notifications' },
  { title: 'requests', path: 'requests' },
  { title: 'messages', path: 'messages' },
];

const baseUrl = '/communications';

class Communications extends Component {
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

export default Communications;
