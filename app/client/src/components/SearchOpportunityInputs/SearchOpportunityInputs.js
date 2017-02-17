
import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import Link from 'components/Link';

import s from './SearchOpportunityInputs.scss';

const SearchOpportunityInputs = ({ 
  data, 
  keywords, 
  types, 
  activities, 
  addKeyword, 
  removeKeyword, 
  handleToggle,
  handleInputChange 
}) => {

  const toggles = (collectionName, collection) => {
    return collection.map( (item, index) => {
      return (
        <Toggle 
          className={s.toggle}
          key={index}
          label={item.title}
          onToggle={ (event, on) => { handleToggle(collectionName, on, item.title) }}
        />
      );
    });
  };

  const selectedKeywords = keywords.map( (keyword, index) => {
    return (
      <li 
        key={index}
        onClick={ (event) => { removeKeyword(keyword) }}
      >
        {keyword}
      </li>
    );
  });

  return (
    <div>
      <TextField
        floatingLabelText="New Keyword"
        value={data.keyword}
        onChange={ (event) => { handleInputChange(event, 'keyword', event.target.value) } }
      />
      <RaisedButton 
        onTouchTap={addKeyword} 
        primary={false} 
        label="Add Keyword" 
      />
      <div>
        Keywords:
        <ul>{ selectedKeywords }</ul>
      </div>

      <h1>Types</h1>
      <div className={s.toggleContainer}>
        { toggles('types', types) }
      </div>

      <h1>Activities</h1>
      <div className={s.toggleContainer}>
        { toggles('activities', activities) }
      </div>
    </div>
  );
};


SearchOpportunityInputs.propTypes = {
  data: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  keywords: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addKeyword: PropTypes.func.isRequired,
  removeKeyword: PropTypes.func.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default SearchOpportunityInputs;
