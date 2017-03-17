
import React, { Component, PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';


import s from 'styles/Search.scss';


class SearchSort extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    selected: PropTypes.string.isRequired,
    descending: PropTypes.bool.isRequired,
  };

  render() {

    const { onSelect, items, selected, descending } = this.props;

    const sortItems = items.map( (item, index) => {
      const isSelected = item.prop === selected;
      const arrow = (descending ? <ArrowDownward/> : <ArrowUpward/>);

      return isSelected ? (
        <ListItem 
          key={item.prop}
          primaryText={item.label}
          className={s.sortSelected}
          rightIcon={arrow}
          onTouchTap={ (event) => onSelect(item.prop) }
        />
      ) : (
        <ListItem 
          key={item.prop}
          primaryText={item.label}
          onTouchTap={ (event) => onSelect(item.prop) }
        />
      );
    });

    return (
      <List>
        {sortItems} 
      </List>
    );
  }
};

export default SearchSort;
