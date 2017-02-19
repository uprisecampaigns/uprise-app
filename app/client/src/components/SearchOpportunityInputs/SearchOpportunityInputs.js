
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import { 
  OpportunitiesQuery, 
  ActivitiesQuery,
  TypesQuery,
  LevelsQuery,
} from 'schemas/queries';

import { 
  addSearchItem, removeSearchItem,
} from 'actions/SearchOpportunitiesActions';


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

const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      collection: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.types }))
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.levels }))
)(TogglesList);

const ActivitiesTogglesList = compose(
  graphql(ActivitiesQuery, graphqlOptions('activities')),
  connect((state) => ({ selectedCollection: state.opportunitiesSearch.activities }))
)(TogglesList);

const SelectedKeywordsContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.keywords };
})(SelectedItemsContainer);

const SelectedActivitiesContainer = connect((state) => { 
  return { items: state.opportunitiesSearch.activities };
})(SelectedItemsContainer);

class SearchOpportunityInputs extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    addSelectedItem: PropTypes.func.isRequired,
    removeSelectedItem: PropTypes.func.isRequired,
    handleToggle: PropTypes.func.isRequired,
  };

  removeSelectedItem = (collectionName, item) => {
    this.props.handleToggle(collectionName, false, item);
  }

  render() {

    const { 
      handleToggle,
      addSelectedItem,
      removeSelectedItem,
    } = this.props;

    return (
      <div>
        <div>
          Keywords:
          <SelectedKeywordsContainer
            collectionName="keywords"
            removeItem={removeSelectedItem}
          />
        </div>
        <div>
          Activities:
          <SelectedActivitiesContainer
            collectionName="activities"
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
          <TypesTogglesList 
            collectionName="types" 
            displayPropName="title"
            keyPropName="title"
            handleToggle={handleToggle}
          />
        </div>

        <h1>Level</h1>
        <div className={s.toggleContainer}>
          <LevelsTogglesList 
            collectionName="levels" 
            displayPropName="title"
            keyPropName="title"
            handleToggle={handleToggle}
          />
        </div>

        <h1>Activities</h1>
        <div className={s.toggleContainer}>
          <ActivitiesTogglesList 
            collectionName="activities" 
            displayPropName="description"
            keyPropName="title"
            handleToggle={handleToggle}
          />
        </div>
      </div>
    );
  }
};

export default SearchOpportunityInputs;
