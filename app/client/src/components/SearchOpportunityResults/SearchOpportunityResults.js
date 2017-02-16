
import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';

import Link from 'components/Link';

const SearchOpportunityResults = (props) => {
  console.log(props);
  const opportunities = props.opportunities.map( (opportunity, index) => {
    return (
      <li key={index}>
        Title: {opportunity.title} Start Time: {opportunity.start_time}
      </li>
    );
  });

  return (
    <ul>
      { opportunities }
    </ul>
  );
}

SearchOpportunityResults.propTypes = {
  opportunities: PropTypes.array.isRequired
};

export default SearchOpportunityResults;
