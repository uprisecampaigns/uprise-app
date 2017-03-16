
import React, { Component, PropTypes } from 'react';
import ContentNavigation from 'components/ContentNavigation';

const selections = [
  { title: 'opportunities', path: 'search-opportunities'},
  { title: 'campaigns', path: 'search-campaigns'},
  { title: 'people', path: 'search-campaigns'},
];

const baseUrl = '/search';

class SearchNav extends Component {
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

export default SearchNav;
