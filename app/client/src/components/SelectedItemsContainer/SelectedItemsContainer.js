
import React, { PureComponent, PropTypes } from 'react';
import Chip from 'material-ui/Chip';

import s from './SelectedItemsContainer.scss';

const SelectedItemsContainer = (props) => {
  const { collectionName, items, removeItem } = props;

  const selectedItemsContainer = items.map((item, index) => {
    const renderedLabel = (typeof props.renderLabel === 'function') ? props.renderLabel(item) : item;

    const handleClicked = (event) => {
      event.stopPropagation();
      event.preventDefault();
      removeItem(collectionName, item);
    };

    return (
      <div
        className={s.searchChip}
        key={index}
        onTouchTap={handleClicked}
      >
        <Chip
          onRequestDelete={handleClicked}
        >
          {renderedLabel}
        </Chip>
      </div>
    );
  });

  return items.length ? (
    <div className={s.searchByContainer}>
      <div className={s.searchChips}>
        {selectedItemsContainer}
      </div>
    </div>
  ) : null;
};

SelectedItemsContainer.PropTypes = {
  collectionName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired,
  renderLabel: PropTypes.func,
};

export default SelectedItemsContainer;
