import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import isNumeric from 'validator/lib/isNumeric';
import TextField from 'material-ui/TextField';

import s from 'styles/Search.scss';

const textFieldStyle = {
  display: 'inline-block',
  width: '4rem',
  padding: '0 1rem',
};

class ZipcodeSearch extends PureComponent {
  static propTypes = {
    addItem: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      zipcode: '',
    };
  }

  handleInputChange = (event, type, value) => {
    if (typeof type === 'string' && type === 'zipcode') {
      // TODO: more canonical zipcode validation (across all site)
      if (isNumeric(value) && value.length < 6) {
        this.setState(Object.assign({}, this.state, { [type]: value }));
      }
    }
  };

  addItem = (event) => {
    const { zipcode } = this.state;

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    this.props.addItem('geographies', { zipcode });

    this.setState(Object.assign({}, this.state, { zipcode: '' }));
  };

  render() {
    const { zipcode } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <form onSubmit={addItem}>
        Active in zipcode:
        <TextField
          floatingLabelText="Zipcode"
          type="text"
          pattern="[0-9]{5}"
          value={zipcode}
          style={textFieldStyle}
          underlineShow
          onChange={(event) => {
            handleInputChange(event, 'zipcode', event.target.value);
          }}
        />
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
