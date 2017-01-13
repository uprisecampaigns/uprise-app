import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import Link from '../Link';


class Header extends Component {
  constructor (props) {
    super (props);
    console.log(props);
    this.state = {
      name: props.name
    };

    // this.clickHandler = this.clickHandler.bind(this);
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    loginButtonHandler: PropTypes.func.isRequired,
  };

  render () {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Uprise Campaigns</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1}><Link to="/about">About</Link></NavItem>
          <NavItem eventKey={2} href="#"></NavItem>
          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action!</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>Separated link</MenuItem>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">Link Right there</NavItem>
          <NavItem eventKey={2} href="#">Last Right Item</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
