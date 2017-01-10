import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';


class Header extends Component {
  constructor (props) {
    super (props);
    console.log(props);
    this.state = {
      name: props.name
    };

    // this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler = (event) => {
    console.log(event);
    console.log(this.state);
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render () {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">React-Bootstrap</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="#">Link1</NavItem>
          <NavItem eventKey={2} href="#">Link2</NavItem>
          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action!</MenuItem>
            <MenuItem eventKey={3.3} onClick={this.clickHandler}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>Separated link</MenuItem>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">Link Right there</NavItem>
          <NavItem eventKey={2} href="#">Hello there, {this.state.name}</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
