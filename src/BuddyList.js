import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';

class BuddyList extends Component {

  constructor() {
    super();
    this.state = {
      subList: 'closeBuddies'
    }
  }

  setSubList(subListName) {
    this.setState({ subList: subListName });
  }

  render() {
    return (
      <div>
        <div className="MoneyIO-Nav-container">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'closeBuddies'} onClick={() => this.setSubList('closeBuddies')}>Close buddies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'topDebtors'} onClick={() => this.setSubList('topDebtors')}>Top debtors</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'topCreditors'} onClick={() => this.setSubList('topCreditors')}>Top creditors</NavLink>
            </NavItem>
          </Nav>
        </div>
        <table className="table">
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>689.4</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>777.4</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

export default BuddyList;