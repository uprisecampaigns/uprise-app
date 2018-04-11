import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';


export default function togglesList(props) {
  const {
    collectionName, displayPropName, keyPropName,
    collection, selectedCollection, handleToggle,
    containerClassName, secondaryDisplayPropName,
  } = props;

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
        secondaryText={item[secondaryDisplayPropName] || null}
      />
    );
  });

  return toggles;
}
