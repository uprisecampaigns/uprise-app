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
  padding: '0 1rem',
};

class TypeSearch extends PureComponent {
  static propTypes = {
    addItem: PropTypes.func.isRequired,
    showEvents: PropTypes.bool,
    showRoles: PropTypes.bool,
    submitOnChange: PropTypes.bool,
  };

  static defaultProps = {
    showEvents: true,
    showRoles: true,
    submitOnChange: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      events: true,
      roles: true,
    };
  }

  handleInputChange = (event, type, value) => {
    let valid = false;

    const { events, roles } = this.state;

    if (typeof type === 'string') {
      if ((type === 'events' && typeof value === 'boolean') || (type === 'roles' && typeof value === 'boolean')) {
        valid = true;
      }
    }

    if (valid) {
      if (type === 'events' && !roles) {
        this.setState({ roles: true });
      } else if (type === 'roles' && !events) {
        this.setState({ events: true });
      }
      this.setState((prevState) => Object.assign({}, prevState, { [type]: value }));

      if (this.props.submitOnChange) {
        if (typeof this.submitTimer !== 'undefined') {
          window.clearTimeout(this.submitTimer);
        }

        this.submitTimer = window.setTimeout(() => {
          this.addItem();
        }, 1000);
      }
    }
  };

  addItem = (event) => {
    const { events, roles } = this.state;

    const searchItem = {
      events,
      roles,
    };

    this.props.addItem('roles', searchItem.roles);
    this.props.addItem('events', searchItem.events);

    // this.setState((prevState) =>
    //   Object.assign({}, prevState, {
    //     events: this.props.showEvents ? false : undefined,
    //     roles: this.props.showRoles ? false : undefined,
    //   }),
    // );
  };

  render() {
    const { showEvents, showRoles, submitOnChange } = this.props;
    const { events, roles } = this.state;
    const { addItem, handleInputChange } = this;

    return (
      <form onSubmit={addItem}>
        <Checkbox
          label="Show Ongoing Roles"
          checked={roles}
          onCheck={(event, isChecked) => {
            handleInputChange(event, 'roles', isChecked);
          }}
          className={s.checkboxContainer}
        />
        <Checkbox
          label="Show Upcoming Events"
          checked={events}
          onCheck={(event, isChecked) => {
            handleInputChange(event, 'events', isChecked);
          }}
          className={s.checkboxContainer}
        />
      </form>
    );
  }
}

export default TypeSearch;
