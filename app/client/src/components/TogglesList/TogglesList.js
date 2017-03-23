
import React, { PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';

import s from './TogglesList.scss';

class TogglesList extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    listTitle: PropTypes.string.isRequired,
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

    const nestedListStyle = {
      maxHeight: '20rem',
      overflowY: 'scroll',
    };

    const toggles = collection.map( (item, index) => {
      const selected = (selectedCollection.includes(item[keyPropName]));
      return (
        <ListItem 
          leftCheckbox={
            <Checkbox 
              onCheck={ (event, on) => { handleToggle(collectionName, on, item[keyPropName]) }}
              checked={selected}
            />
          }
          key={item.id || index}
          checked={selected}
          primaryText={item[displayPropName]}
        />
      );
    });

    return (
      <div className={s.listContainer}>
        <ListItem 
          primaryText={this.props.listTitle}
          initiallyOpen={false}
          primaryTogglesNestedList={true}
          nestedListStyle={nestedListStyle}
          nestedItems={toggles}
        />
      </div>
    );
  }
}

export default TogglesList;
