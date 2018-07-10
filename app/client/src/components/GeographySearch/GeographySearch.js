import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import isNumeric from 'validator/lib/isNumeric';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import s from 'styles/Search.scss';

const textFieldStyle = {
  display: 'inline-block',
  width: '4rem',
  padding: '0',
  margin: '0.5rem',
};

class GeographySearch extends PureComponent {
  static propTypes = {
    addItem: PropTypes.func.isRequired,
    showVirtual: PropTypes.bool,
  };

  static defaultProps = {
    showVirtual: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      distance: '10',
      zipcode: '',
    };

    if (props.showVirtual) {
      this.state.virtual = false;
    }
  }

  handleInputChange = (event, type, value) => {
    let valid = false;
    if (typeof type === 'string') {
      if (
        (type === 'zipcode' && value.length < 6 && (isNumeric(value) || value === '')) ||
        (type === 'distance' && ((isNumeric(value) && parseInt(value, 10) > 0) || value === '')) ||
        (type === 'virtual' && typeof value === 'boolean')
      ) {
        valid = true;
      }
    }

    valid && this.setState((prevState) => Object.assign({}, prevState, { [type]: value }));
  };

  addItem = (event) => {
    const { distance, zipcode, virtual } = this.state;

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const searchItem = this.state.virtual
      ? {
          virtual,
        }
      : {
          distance,
          zipcode,
        };

    if (
      searchItem.virtual ||
      (isNumeric(searchItem.distance) &&
        isNumeric(searchItem.zipcode) &&
        parseInt(searchItem.distance, 10) > 0 &&
        searchItem.zipcode.length === 5)
    ) {
      this.props.addItem('geographies', searchItem);

      this.setState((prevState) =>
        Object.assign({}, prevState, {
          distance: '10',
          zipcode: '',
          virtual: this.props.showVirtual ? false : undefined,
        }),
      );
    }
  };

  render() {
    const { showVirtual } = this.props;
    const { distance, zipcode, virtual } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <form onSubmit={addItem}>
        {showVirtual && (
          <Checkbox
            label="Virtual (anywhere)"
            checked={virtual}
            onCheck={(event, isChecked) => {
              handleInputChange(event, 'virtual', isChecked);
            }}
            className={s.checkboxContainer}
          />
        )}

        {!virtual && (
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
        )}
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

export default GeographySearch;
