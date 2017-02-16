
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
  activities, 
  addKeyword, 
  removeKeyword, 
  toggleActivity,
  handleInputChange 
}) => {

  const activityToggles = activities.map( (activity, index) => {
    return (
      <Toggle 
        className={s.toggle}
        key={index}
        label={activity.title}
        onToggle={ (event, on) => { toggleActivity(on, activity.title) }}
      />
    );
  });

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

      <h1>Activities</h1>
      <div className={s.toggleContainer}>
        { activityToggles }
      </div>
    </div>
  );
};


SearchOpportunityInputs.propTypes = {
  data: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  keywords: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addKeyword: PropTypes.func.isRequired,
  removeKeyword: PropTypes.func.isRequired,
  toggleActivity: PropTypes.func.isRequired,
};

export default SearchOpportunityInputs;
