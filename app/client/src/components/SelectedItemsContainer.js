
import React, { PureComponent, PropTypes } from 'react';
import Chip from 'material-ui/Chip';

import s from 'components/SearchOpportunityInputs/SearchOpportunityInputs.scss';

const SelectedItemsContainer = (props) => {

  const { collectionName, items, removeItem } = props;

  const selectedItemsContainer = items.map( (item, index) => {
    return (
      <div 
        className={s.searchChip}
        key={index}
      >
        <Chip 
          onRequestDelete={ (event) => { removeItem(collectionName, item) }}
        >
          {item}
        </Chip>
      </div>
    );
  });

  return items.length ? (
    <div className={s.searchByContainer}>
      <span className={s.searchByTitle}>{collectionName}:</span>
      <div className={s.searchChips}>
        {selectedItemsContainer}
      </div>
    </div>
  ) : null;
}

SelectedItemsContainer.PropTypes = {
  collectionName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired
}

export default SelectedItemsContainer;
