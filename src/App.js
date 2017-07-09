import React, { Component } from 'react';
import { Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import './App.css';
import EntryForm from './EntryForm';

class App extends Component {

  constructor() {
    super();
    this.toggleNav = this.toggleNav.bind(this);
    this.state = { isOpen: false };
  }

  toggleNav() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="MoneyIO-App">
        <Navbar color="primary" inverse toggleable>
          <NavbarToggler right onClick={this.toggleNav} />
          <NavbarBrand href="/">
            <span className="fa fa-credit-card"/> <span id="MoneyIO-App-Title">money.io</span>
          </NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="#form">Form</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#receipts">Receipts</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#buddies">Buddies</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div className="MoneyIO-App-content">
          <div className="container">
            <EntryForm />
          </div>
        </div>
      </div>
    );
  }

}

export default App;
