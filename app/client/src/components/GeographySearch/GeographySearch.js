
import React, { PureComponent, PropTypes } from 'react';
import isNumeric from 'validator/lib/isNumeric';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';


const textFieldStyle = {
  display: 'inline-block',
  width: '4rem',
  padding: '0 1rem',
};

class GeographySearch extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      distance: '10',
      zipcode: '',
      virtual: false
    }
  }

  static propTypes = {
    addItem: PropTypes.func.isRequired,
  }

  handleInputChange = (event, type, value) => {

    let valid = false;
    if (typeof type === 'string') {
      
      if ((type === 'zipcode' && value.length < 6 && (isNumeric(value) || value === '')) || 
          (type === 'distance' && ((isNumeric(value) && parseInt(value, 10) > 0) || value === '')) ||
          (type === 'virtual' && typeof value === 'boolean')) {

        valid = true;
      }

    }

    valid && this.setState((prevState) => (Object.assign({},
      prevState,
      { [type]: value }
    )));
  }

  addItem = (event) => {

    const { distance, zipcode, virtual } = this.state;

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const searchItem = this.state.virtual ? {
      virtual
    } : {
      distance,
      zipcode
    };

    this.props.addItem('geographies', searchItem);

    this.setState((prevState) => (Object.assign({},
      prevState,
      {
        distance: '',
        zipcode: '',
        virtual: false
      }
    )));
  }

  render() {

    const { distance, zipcode, virtual, ...state } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <form 
        onSubmit={addItem}
      >

        <Checkbox
          label="Virtual (anywhere)"
          checked={virtual}
          onCheck={ (event, isChecked) => { handleInputChange(event, 'virtual', isChecked) } }
        />

        {!virtual && (
          <div>

            Within 
            <TextField
              floatingLabelText="miles"
              type="number"
              min="1"
              value={distance}
              style={textFieldStyle}
              underlineShow={false}
              onChange={ (event) => { handleInputChange(event, 'distance', event.target.value) } }
            />
            of 
            <TextField
              floatingLabelText="Zipcode"
              type="text"
              pattern="[0-9]{5}"
              value={zipcode}
              style={textFieldStyle}
              underlineShow={false}
              onChange={ (event) => { handleInputChange(event, 'zipcode', event.target.value) } }
            />
          </div>
        )}

        <IconButton 
          iconClassName='material-icons'
          type="submit"
        >search</IconButton>
      </form>
    )
  }
}

export default GeographySearch;
