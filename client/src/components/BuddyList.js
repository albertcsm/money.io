import React, { Component } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux'

import store from '../store.js';
import * as Actions from '../actions'

class BuddyList extends Component {

  setBuddyListFilter(filter) {
    store.dispatch(Actions.setBuddyListFilter(filter));
  }

  render() {
    return (
      <div>
        <div className="MoneyIO-Nav-container">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active={this.props.buddyListFilter === 'CLOSE_BUDDIES'} onClick={() => this.setBuddyListFilter('CLOSE_BUDDIES')}>Close buddies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.buddyListFilter === 'TOP_DEBTORS'} onClick={() => this.setBuddyListFilter('TOP_DEBTORS')}>Top debtors</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.buddyListFilter === 'TOP_CREDITORS'} onClick={() => this.setBuddyListFilter('TOP_CREDITORS')}>Top creditors</NavLink>
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

function getBuddyList(groupUsers, users) {
  return Object.keys(groupUsers)
    .map(userId => ({ id: userId, ...users[userId], ...groupUsers[userId] }));
}

function getTopDebtors(groupUsers, users, transactions, currentUser) {
  const myTransactions = Object.keys(transactions)
    .map(transactionId => transactions[transactionId])
    .filter(transaction => transaction.participants[currentUser.uid]);
  
  const closeBuddies = new Set(myTransactions.flatMap(transaction => Object.keys(transaction.participants)));

  return getBuddyList(groupUsers, users).filter(buddy => closeBuddies.has(buddy.id));
}

function getFilteredBuddyList(filter, originalBuddyList, transactions, currentUser) {
  if (filter == 'CLOSE_BUDDIES') {
    const myTransactions = Object.keys(transactions)
      .map(transactionId => transactions[transactionId])
      .filter(transaction => transaction.participants[currentUser.uid]);
    
    const closeBuddies = new Set(myTransactions.flatMap(transaction => Object.keys(transaction.participants)));

    return originalBuddyList.filter(buddy => closeBuddies.has(buddy.id));
  } else if (filter == 'TOP_DEBTORS') {
    return originalBuddyList.sort((a,b) => a.balance > b.balance).slice(0, 10);
  } else if (filter == 'TOP_CREDITORS') {
    return originalBuddyList.sort((a,b) => a.balance < b.balance).slice(0, 10);
  } else {
    return [];
  }
}

const mapStateToProps = state => ({
  buddies: getFilteredBuddyList(state.buddyListFilter,
    getBuddyList(state.groupUsers, state.users),
    state.transactions,
    state.currentUser),
  buddyListFilter: state.buddyListFilter
})

export default connect(mapStateToProps)(BuddyList);