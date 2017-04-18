
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

class ZipcodeSearch extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      zipcode: '',
    }
  }

  static propTypes = {
    addItem: PropTypes.func.isRequired,
  }

  handleInputChange = (event, type, value) => {

    if (typeof type === 'string' && type === 'zipcode') {

      // TODO: more canonical zipcode validation (across all site)
      if (isNumeric(value) && value.length < 6) {

        this.setState(Object.assign({},
          this.state,
          { [type]: value }
        ));
      }
    } 
  }

  addItem = (event) => {

    const { zipcode } = this.state;

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    this.props.addItem('geographies', { zipcode });

    this.setState(Object.assign({},
      this.state, { zipcode: '' }
    ));
  }

  render() {

    const { zipcode, ...state } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <form 
        onSubmit={addItem}
      >
        Active in areas that include zipcode:  
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

export default ZipcodeSearch;
