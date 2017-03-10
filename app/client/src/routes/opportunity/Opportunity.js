
import React, { PropTypes } from 'react';
import OpportunityContainer from 'components/Opportunity/OpportunityContainer';


class Opportunity extends React.Component {
  static propTypes = {
    opportunity: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <OpportunityContainer opportunity={this.props.opportunity}/>
      </div>
    );
  }
}

export default Opportunity;
