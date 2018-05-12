import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Link, Switch } from 'react-router-dom';
import { Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { auth } from './firebaseApp.js';

import './App.css';
import Loading from './components/Loading';
import LoginForm from './components/LoginForm';
import EntryForm from './components/EntryForm';
import ReceiptList from './components/ReceiptList';
import BuddyList from './components/BuddyList';

const initialState = {};
const middlewares = [thunk];
const store = createStore(rootReducer , initialState, applyMiddleware(...middlewares));

class App extends Component {

  constructor() {
    super();
    this.toggleNav = this.toggleNav.bind(this);
    this.logout = this.logout.bind(this);
    this.state = { 
      user: null,
      authenticating: true,
      isOpen: false
    };
  }

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      this.setState({
        authenticating: false,
        user
      });
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
      <Provider store={store}>
        <HashRouter>
          { this.state.user ?
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
                        <img className="MoneyIO-avatar" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem header>{this.state.user.displayName}</DropdownItem>
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
                    <Route path="/form" component={EntryForm}/>
                    <Route path="/receipts" component={ReceiptList}/>
                    <Route path="/buddies" component={BuddyList}/>
                    <Redirect from="/" to="/form" />
                  </Switch>
                </div>
              </div>
            </div>
            : (this.state.authenticating ? <Loading/> : <LoginForm/>)
          }
        </HashRouter>
      </Provider>
    );
  }

}

export default App;
