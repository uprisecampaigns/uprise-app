
import React, { PureComponent, PropTypes } from 'react';
import isNumeric from 'validator/lib/isNumeric';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';


const textFieldStyle = {
  display: 'inline-block',
  width: '4rem',
  padding: '0 1rem',
};

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

    if (typeof type === 'string' && (type === 'zipcode' || type === 'distance')) {
      if (isNumeric(value) || value === '') {

        this.setState(Object.assign({},
          this.state,
          { [type]: value }
        ));
      }
    } 
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
      <form 
        onSubmit={addItem}
      >
        Within 
        <TextField
          floatingLabelText="miles"
          type="number"
          value={distance}
          style={textFieldStyle}
          underlineShow={false}
          onChange={ (event) => { handleInputChange(event, 'distance', event.target.value) } }
        />
        of 
        <TextField
          floatingLabelText="Zipcode"
          type="number"
          value={zipcode}
          style={textFieldStyle}
          underlineShow={false}
          onChange={ (event) => { handleInputChange(event, 'zipcode', event.target.value) } }
        />
        <IconButton 
          iconClassName='material-icons'
          type="submit"
        >search</IconButton>
      </form>
    )
  }
}

export default GeographySearch;
