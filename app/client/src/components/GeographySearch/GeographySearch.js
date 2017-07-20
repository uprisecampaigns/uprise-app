import React, { PureComponent, PropTypes } from 'react';
import isNumeric from 'validator/lib/isNumeric';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import s from 'styles/Search.scss';


const textFieldStyle = {
  display: 'inline-block',
  width: '4rem',
  padding: '0 1rem',
};

class GeographySearch extends PureComponent {
  static propTypes = {
    addItem: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      distance: '10',
      zipcode: '',
      virtual: false,
    };
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

    valid && this.setState(prevState => (Object.assign({},
      prevState,
      { [type]: value },
    )));
  }

  addItem = (event) => {
    const { distance, zipcode, virtual } = this.state;

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const searchItem = this.state.virtual ? {
      virtual,
    } : {
      distance,
      zipcode,
    };

    if (searchItem.virtual ||
        (isNumeric(searchItem.distance) && isNumeric(searchItem.zipcode) &&
         parseInt(searchItem.distance, 10) > 0 && searchItem.zipcode.length === 5)) {
      this.props.addItem('geographies', searchItem);

      this.setState(prevState => (Object.assign({},
        prevState,
        {
          distance: '10',
          zipcode: '',
          virtual: false,
        },
      )));
    }
  }

  render() {
    const { distance, zipcode, virtual } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <form
        onSubmit={addItem}
      >

        <Checkbox
          label="Virtual (anywhere)"
          checked={virtual}
          onCheck={(event, isChecked) => { handleInputChange(event, 'virtual', isChecked); }}
          className={s.checkboxContainer}
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
              onChange={(event) => { handleInputChange(event, 'distance', event.target.value); }}
            />
            of
            <TextField
              floatingLabelText="Zipcode"
              type="text"
              pattern="[0-9]{5}"
              value={zipcode}
              style={textFieldStyle}
              underlineShow={false}
              onChange={(event) => { handleInputChange(event, 'zipcode', event.target.value); }}
            />
          </div>
        )}
        <div className={s.addToSearchButton}>
          <RaisedButton
            className={s.primaryButton}
            onTouchTap={addItem}
            type="submit"
            primary
            label="Add to Search"
          />
        </div>
      </form>
    );
  }
}

export default GeographySearch;
