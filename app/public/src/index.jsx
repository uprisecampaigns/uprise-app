import React from 'react';
import ReactDOM from 'react-dom';
import { NavItem, MenuItem, NavDropdown, Nav, Navbar } from 'react-bootstrap';

function activateLasers (event) {
  console.log(event);
}

const navbarInstance = (
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
        <MenuItem eventKey={3.3} onClick={activateLasers}>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={3.3}>Separated link</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
);

ReactDOM.render(navbarInstance, document.getElementById('app'));
