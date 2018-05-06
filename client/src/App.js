import React, { Component } from 'react';
import { Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { HashRouter, Route, Redirect, Link, Switch } from 'react-router-dom';
import './App.css';
import EntryForm from './components/EntryForm';
import ReceiptList from './components/ReceiptList';
import BuddyList from './components/BuddyList';

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
      <HashRouter>
        <div className="MoneyIO-App">
          <Navbar color="primary" inverse toggleable>
            <NavbarToggler right onClick={this.toggleNav} />
            <NavbarBrand href="/">
              <span className="fa fa-credit-card"/> <span id="MoneyIO-App-Title">money.io</span>
            </NavbarBrand>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink tag={Link} to="/form">Form</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/receipts">Receipts</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/buddies">Buddies</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          <div className="MoneyIO-App-content">
            <div className="container">
              <Switch>
                <Route path="/form" component={EntryForm}/>
                <Route path="/receipts" component={ReceiptList}/>
                <Route path="/buddies" component={BuddyList}/>
                <Redirect from="/" to="/form" />
              </Switch>
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }

}

export default App;
