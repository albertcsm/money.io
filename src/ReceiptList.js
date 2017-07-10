import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';

class ReceiptList extends Component {

  constructor() {
    super();
    this.state = {
      subList: 'paidByMe'
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
              <NavLink href="#" active={this.state.subList === 'paidByMe'} onClick={() => this.setSubList('paidByMe')}>Paid by me</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'involved'} onClick={() => this.setSubList('involved')}>I was involved</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'all'} onClick={() => this.setSubList('all')}>All</NavLink>
            </NavItem>
          </Nav>
        </div>
        <table className="table">
          <thead className="thead-default">
            <tr>
              <th>Date</th>
              <th>Restaurant</th>
              <th>Paid by</th>
              <th>Involved</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2017/01/01</td>
              <td>Maxim</td>
              <td>Me</td>
              <td>Someone</td>
              <td>689.4</td>
            </tr>
            <tr>
              <td>2017/01/01</td>
              <td>Cafe de Coral</td>
              <td>Someone</td>
              <td>Someone</td>
              <td>777.4</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

export default ReceiptList;