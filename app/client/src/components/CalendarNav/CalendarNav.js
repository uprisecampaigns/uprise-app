
import React, { Component, PropTypes } from 'react';
import ContentNavigation from 'components/ContentNavigation';

const selections = [
  { title: 'view calendar', path: 'view-calendar'},
  { title: 'view list', path: 'view-list'}
];

const baseUrl = '/calendar';

class Calendar extends Component {
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

export default Calendar;
