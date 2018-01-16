import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { List, ListItem } from 'material-ui/List';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';

import s from 'styles/Search.scss';


class SearchSort extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.node).isRequired,
    selected: PropTypes.string.isRequired,
    descending: PropTypes.bool.isRequired,
  };

  render() {
    const { onSelect, items, selected, descending } = this.props;

    const sortItems = items.map((item, index) => {
      const isSelected = item.prop === selected;
      const arrow = (descending ? <ArrowDownward /> : <ArrowUpward />);

      return isSelected ? (
        <ListItem
          key={item.prop}
          primaryText={item.label}
          className={s.sortSelected}
          rightIcon={arrow}
          onClick={event => onSelect(item.prop, event)}
        />
      ) : (
        <ListItem
          key={item.prop}
          primaryText={item.label}
          onClick={event => onSelect(item.prop, event)}
        />
      );
    });

    return (
      <List>
        {sortItems}
      </List>
    );
  }
}

export default SearchSort;
