
import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import Link from 'components/Link';

const SearchOpportunityInputs = ({ data, addTag, removeTag, handleInputChange }) => {

  const tags = data.tags.map( (tag, index) => {
    return (
      <li 
        key={index}
        onClick={ (event) => { removeTag(tag) }}
      >
        {tag}
      </li>
    );
  });

  return (
    <div>
      <TextField
        floatingLabelText="New Tag"
        value={data.tag}
        onChange={ (event) => { handleInputChange(event, 'tag', event.target.value) } }
      />
      <RaisedButton 
        onTouchTap={addTag} 
        primary={false} 
        label="Add Tag" 
      />
      <div>
        Tags:
        <ul>{ tags }</ul>
      </div>
    </div>
  );
};


SearchOpportunityInputs.propTypes = {
  data: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired
};

export default SearchOpportunityInputs;
