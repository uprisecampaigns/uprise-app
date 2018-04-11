import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';


class TogglesList extends Component {
  static propTypes = {
    collectionName: PropTypes.string.isRequired,
    keyPropName: PropTypes.string.isRequired,
    displayPropName: PropTypes.string.isRequired,
    secondaryDisplayPropName: PropTypes.string,
    handleToggle: PropTypes.func.isRequired,
    collection: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedCollection: PropTypes.arrayOf(PropTypes.object).isRequired,
    containerClassName: PropTypes.string,
    itemClassName: PropTypes.string,
  }

  static defaultProps = {
    containerClassName: '',
    itemClassName: '',
    secondaryDisplayPropName: null,
  }

  render() {
    const {
      collectionName, displayPropName, keyPropName,
      collection, selectedCollection, handleToggle,
      containerClassName, itemClassName,
      secondaryDisplayPropName,
    } = this.props;

    const toggles = collection.map((item, index) => {
      const selected = (selectedCollection.includes(item[keyPropName]));
      return (
        <div className={itemClassName}>
          <ListItem
            leftCheckbox={
              <Checkbox
                onCheck={(event, on) => { handleToggle(collectionName, on, item[keyPropName]); }}
                checked={selected}
              />
            }
            key={item.id || index}
            checked={selected}
            primaryText={item[displayPropName]}
            secondaryText={secondaryDisplayPropName && item[secondaryDisplayPropName]}
          />
        </div>
      );
    });

    return (
      <div className={containerClassName}>
        {toggles}
      </div>
    );
  }
}

export default TogglesList;
