import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Link, Switch } from 'react-router-dom';

import { Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';

import { auth } from './firebaseApp.js';
import store from './store.js';
import * as Actions from './actions'
import Loading from './components/Loading';
import LoginForm from './components/LoginForm';
import NewReceiptEditor from './containers/NewReceiptEditor';
import ExistingReceiptEditor from './containers/ExistingReceiptEditor';
import ReceiptList from './components/ReceiptList';
import BuddyList from './components/BuddyList';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.toggleNav = this.toggleNav.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false
    };
  }

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        store.dispatch(Actions.setAuthenticated(user));
        store.dispatch(Actions.initializeForUser(user));
      } else {
        store.dispatch(Actions.setUnauthenticated());
      }
    });
  }

  toggleNav() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout() {
    // todo
    auth.signOut();
  }

  render() {
    return (
      <HashRouter>
        { this.props.currentUser ?
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
                  <UncontrolledDropdown>
                    <DropdownToggle nav caret>
                      <img className="MoneyIO-avatar" src={this.props.currentUser.photoURL} alt={this.props.currentUser.displayName}/>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem header>{this.props.currentUser.displayName}</DropdownItem>
                      <DropdownItem divider/>
                      <DropdownItem tag="a">
                        <div onClick={this.logout}>
                          Logout
                        </div>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Collapse>
            </Navbar>
            <div className="MoneyIO-App-content">
              <div className="container">
                <Switch>
                  <Route exact path="/form" component={NewReceiptEditor}/>
                  <Route exact path="/receipts" component={ReceiptList}/>
                  <Route exact path="/receipts/:transactionId" component={ExistingReceiptEditor}/>
                  <Route exact path="/buddies" component={BuddyList}/>
                  <Redirect from="/" to="/form" />
                </Switch>
              </div>
            </div>
          </div>
          : (this.props.authenticating ? <Loading/> : <LoginForm/>)
        }
      </HashRouter>
    );
  }

}

const mapStateToProps = state => ({
  authenticating: state.authenticating,
  currentUser: state.currentUser
})

export default connect(mapStateToProps)(App);