
import React, { Component, PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';

import s from './SearchOpportunity.scss';


class SearchOpportunitySort extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  render() {

    const { 
      onSelect
    } = this.props;

    return (
      <List>
        <ListItem 
          primaryText="Distance"
          onTouchTap={ (event) => onSelect('distance') }
        />
        <ListItem 
          primaryText="Date"
          onTouchTap={ (event) => onSelect('date') }
        />
        <ListItem 
          primaryText="Relevance"
          onTouchTap={ (event) => onSelect('relevance') }
        />
        <ListItem 
          primaryText="Campaign Name"
          onTouchTap={ (event) => onSelect('campaignName') }
        />
      </List>
    );
  }
};

export default SearchOpportunitySort;
