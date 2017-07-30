import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';

class BuddyList extends Component {

  constructor() {
    super();
    this.state = {
      buddies: [],
      subList: 'closeBuddies'
    }
  }

  componentDidMount() {
    fetch('/api/buddies')
      .then(res => res.json())
      .then(response => this.setState({ buddies : response._embedded.buddies }));
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
            {this.state.buddies.map(buddy =>
              <tr key={buddy.id}>
                <td>{buddy.name}</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

export default BuddyList;