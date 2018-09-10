import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import isNumeric from 'validator/lib/isNumeric';
import TextField from 'material-ui/TextField';

import s from 'styles/Search.scss';

const textFieldStyle = {
  display: 'inline-block',
  width: '4rem',
  padding: '0',
  margin: '0.5rem',
};

class ZipcodeSearch extends PureComponent {
  static propTypes = {
    addItem: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      distance: '10',
      zipcode: '',
    };
  }

  handleInputChange = (event, type, value) => {
    let valid = false;
    if (typeof type === 'string') {
      if (
        (type === 'zipcode' && value.length < 6 && (isNumeric(value) || value === '')) ||
        (type === 'distance' && ((isNumeric(value) && parseInt(value, 10) > 0) || value === ''))
      ) {
        valid = true;
      }
    }

    valid && this.setState((prevState) => Object.assign({}, prevState, { [type]: value }));
  };

  addItem = (event) => {
    const { distance, zipcode } = this.state;

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const searchItem = {
      distance,
      zipcode,
    };

    if (
      isNumeric(searchItem.distance) &&
      isNumeric(searchItem.zipcode) &&
      parseInt(searchItem.distance, 10) > 0 &&
      searchItem.zipcode.length === 5
    ) {
      this.props.addItem('geographies', searchItem);

      this.setState((prevState) =>
        Object.assign({}, prevState, {
          distance: '10',
          zipcode: '',
        }),
      );
    }
  };

  render() {
    const { distance, zipcode } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <form onSubmit={addItem}>
        <div>
          Within
          <TextField
            type="number"
            min="1"
            value={distance}
            style={textFieldStyle}
            className={s.textField}
            underlineShow={true}
            onChange={(event) => {
              handleInputChange(event, 'distance', event.target.value);
            }}
          />
          miles of
          <TextField
            floatingLabelText="Zipcode"
            type="text"
            pattern="[0-9]{5}"
            value={zipcode}
            style={textFieldStyle}
            className={s.textField}
            underlineShow={true}
            onChange={(event) => {
              handleInputChange(event, 'zipcode', event.target.value);
            }}
          />
        </div>
        <div className={s.rightButton}>
          <div
            className={[s.addToSearchButton, s.secondaryButton].join(' ')}
            onClick={addItem}
            onKeyPress={addItem}
            role="button"
            tabIndex="0"
          >
            Add to Search
          </div>
        </div>
      </form>
    );
  }
}

export default ZipcodeSearch;
