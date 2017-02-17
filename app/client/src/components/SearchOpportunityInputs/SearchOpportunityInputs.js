
import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import Link from 'components/Link';
import TogglesList from 'components/TogglesList';

import s from './SearchOpportunityInputs.scss';


class InputWithButton extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  static propTypes = {
    collectionName: PropTypes.string.isRequired,
    addItem: PropTypes.func.isRequired,
    inputLabel: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
  }

  handleInputChange = (value) => {
    this.setState(Object.assign({},
      this.state,
      { value }
    ));
  }

  addItem = () => {
    this.props.addItem(this.props.collectionName, this.state.value);

    this.setState(Object.assign({},
      this.state,
      { value: '' }
    ));
  }

  render() {
    return (
      <div>
        <TextField
          floatingLabelText={this.props.inputLabel}
          value={this.state.value}
          onChange={ (event) => { this.handleInputChange(event.target.value) } }
        />
        <RaisedButton 
          onTouchTap={this.addItem} 
          primary={false} 
          label={this.props.buttonLabel} 
        />
      </div>
    )
  }
}

const SelectedItemsContainer = (props) => {

  const { collectionName, items, removeItem } = props;

  const selectedItemsContainer = items.map( (item, index) => {
    return (
      <li 
        key={index}
        onClick={ (event) => { removeItem(collectionName, item) }}
      >
        {item}
      </li>
    );
  });

  return (
    <ul>{selectedItemsContainer}</ul>
  );
}

SelectedItemsContainer.PropTypes = {
  collectionName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired
}

class SearchOpportunityInputs extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    activities: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    levels: PropTypes.array.isRequired,
    selectedKeywords: PropTypes.array.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    selectedTypes: PropTypes.array.isRequired,
    selectedLevels: PropTypes.array.isRequired,
    addSelectedItem: PropTypes.func.isRequired,
    removeSelectedItem: PropTypes.func.isRequired,
    handleToggle: PropTypes.func.isRequired,
  };


  removeSelectedItem = (collectionName, item) => {
    this.props.handleToggle(collectionName, false, item);
  }

  render() {

    const { 
      activities, 
      levels, 
      types, 
      selectedKeywords,
      selectedActivities,
      selectedTypes,
      selectedLevels,
      handleToggle,
      addSelectedItem,
      removeSelectedItem,
    } = this.props;

    return (
      <div>
        <div>
          Keywords:
          <SelectedItemsContainer
            collectionName="keywords"
            items={selectedKeywords}
            removeItem={removeSelectedItem}
          />
        </div>
        <div>
          Activities:
          <SelectedItemsContainer
            collectionName="activities"
            items={selectedActivities}
            removeItem={removeSelectedItem}
          />
        </div>

        <InputWithButton
          collectionName="keywords"
          inputLabel="keywords"
          buttonLabel="Add to Search >> "
          addItem={addSelectedItem}
        />

        <h1>Campaign Type</h1>
        <div className={s.toggleContainer}>
          <TogglesList 
            collectionName="types" 
            collection={types}
            selectedCollection={selectedTypes}
            handleToggle={handleToggle}
          />
        </div>

        <h1>Level</h1>
        <div className={s.toggleContainer}>
          <TogglesList 
            collectionName="levels" 
            collection={levels}
            selectedCollection={selectedLevels}
            handleToggle={handleToggle}
          />
        </div>


        <h1>Activities</h1>
        <div className={s.toggleContainer}>
          <TogglesList 
            collectionName="activities" 
            collection={activities}
            selectedCollection={selectedActivities}
            handleToggle={handleToggle}
          />
        </div>
      </div>
    );
  }
};


export default SearchOpportunityInputs;
