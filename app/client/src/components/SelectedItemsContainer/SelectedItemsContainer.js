import PropTypes from 'prop-types';
import React from 'react';
import Chip from 'material-ui/Chip';

import s from './SelectedItemsContainer.scss';

function SelectedItemsContainer(props) {
  const {
    collectionName, items, removeItem, className,
  } = props;

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
        key={JSON.stringify(item)}
        onClick={handleClicked}
        onKeyPress={handleClicked}
        role="button"
        tabIndex="0"
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
    <div className={[s.searchByContainer, className].join(' ')}>
      <div className={s.searchChips}>
        {selectedItemsContainer}
      </div>
    </div>
  ) : null;
}

SelectedItemsContainer.propTypes = {
  collectionName: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeItem: PropTypes.func.isRequired,
  renderLabel: PropTypes.func,
  className: PropTypes.string,
};

SelectedItemsContainer.defaultProps = {
  renderLabel: undefined,
  className: '',
};

export default SelectedItemsContainer;
