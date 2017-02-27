
import React, { PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

import s from './TogglesList.scss';

class TogglesList extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    collectionName: PropTypes.string.isRequired,
    keyPropName: PropTypes.string.isRequired,
    displayPropName: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    selectedCollection: PropTypes.array.isRequired,
    handleToggle: PropTypes.func.isRequired,
  }

  render() {

    const { 
      collectionName, displayPropName, keyPropName, 
      collection, selectedCollection, handleToggle 
    } = this.props;

    const toggles = (collectionName, collection) => {
      return collection.map( (item, index) => {
        const selected = (selectedCollection.includes(item[keyPropName]));
        return (
          <Checkbox 
            className={s.toggle}
            key={index}
            checked={selected}
            label={item[displayPropName]}
            onCheck={ (event, on) => { handleToggle(collectionName, on, item[keyPropName]) }}
          />
        );
      });
    };

    return (
      <div className={s.container}>
        {toggles(collectionName, collection)}
      </div>
    );
  }
}

export default TogglesList;
