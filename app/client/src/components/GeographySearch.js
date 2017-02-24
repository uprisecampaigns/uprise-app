
import React, { PureComponent, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class GeographySearch extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      distance: '',
      zipcode: ''
    }
  }

  static propTypes = {
    addItem: PropTypes.func.isRequired,
  }

  handleInputChange = (event, type, value) => {
    this.setState(Object.assign({},
      this.state,
      { [type]: value }
    ));
  }

  addItem = (event) => {

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    this.props.addItem('geographies', {
      distance: this.state.distance,
      zipcode: this.state.zipcode
    });

    this.setState(Object.assign({},
      this.state,
      {
        distance: '',
        zipcode: ''
      }
    ));
  }

  render() {

    const { distance, zipcode, ...state } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <div>
        <form onSubmit={addItem}>
          Within 
          <TextField
            floatingLabelText="miles"
            type="number"
            value={distance}
            onChange={ (event) => { handleInputChange(event, 'distance', event.target.value) } }
          />
          of 
          <TextField
            floatingLabelText="Zipcode"
            type="number"
            value={zipcode}
            onChange={ (event) => { handleInputChange(event, 'zipcode', event.target.value) } }
          />

          <RaisedButton 
            type="submit"
            primary={false} 
            label="Add to Search" 
          />
        </form>
      </div>
    )
  }
}

export default GeographySearch;
