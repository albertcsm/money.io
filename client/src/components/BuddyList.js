import React, { Component } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux'

import { fetchBuddies } from '../actions/buddyActions.js'

class BuddyList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subList: 'closeBuddies'
    }
  }

  componentDidMount() {
    this.props.fetchBuddies();
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
            {this.props.buddies.map(buddy =>
              <tr key={buddy.id}>
                <td>{buddy.name}</td>
                <td>{buddy.balance}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  buddies: state.buddies.items
})

const mapDispatcherToProps = dispatch => ({
  fetchBuddies : () => dispatch(fetchBuddies()),
});

export default connect(mapStateToProps, mapDispatcherToProps)(BuddyList);
