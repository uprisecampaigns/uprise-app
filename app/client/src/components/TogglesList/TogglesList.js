
import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';

import s from './TogglesList.scss';

class TogglesList extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    collectionName: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    selectedCollection: PropTypes.array.isRequired,
    handleToggle: PropTypes.func.isRequired,
  }

  render() {

    const { collectionName, collection, selectedCollection, handleToggle } = this.props;

    const toggles = (collectionName, collection) => {
      return collection.map( (item, index) => {
        const selected = (selectedCollection.includes(item.title));
        return (
          <Toggle 
            className={s.toggle}
            key={index}
            toggled={selected}
            label={item.title}
            onToggle={ (event, on) => { handleToggle(collectionName, on, item.title) }}
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
