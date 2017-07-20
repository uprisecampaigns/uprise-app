import React, { PureComponent, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';

import ControlledListItem from 'components/ControlledListItem';


class TogglesList extends PureComponent {
  static propTypes = {
    listTitle: PropTypes.string.isRequired,
    collectionName: PropTypes.string.isRequired,
    keyPropName: PropTypes.string.isRequired,
    displayPropName: PropTypes.string.isRequired,
    collection: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedCollection: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleToggle: PropTypes.func.isRequired,
    containerClassName: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
  }

  render() {
    const {
      collectionName, displayPropName, keyPropName,
      collection, selectedCollection, handleToggle,
      containerClassName, className,
    } = this.props;

    const toggles = collection.map((item, index) => {
      const selected = (selectedCollection.includes(item[keyPropName]));
      return (
        <ListItem
          leftCheckbox={
            <Checkbox
              onCheck={(event, on) => { handleToggle(collectionName, on, item[keyPropName]); }}
              checked={selected}
            />
          }
          className={containerClassName}
          key={item.id || index}
          checked={selected}
          primaryText={item[displayPropName]}
        />
      );
    });

    return (
      <div className={className}>
        <ControlledListItem
          primaryText={this.props.listTitle}
          nestedItems={toggles}
        />
      </div>
    );
  }
}

export default TogglesList;
