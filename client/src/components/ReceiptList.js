import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';

import store from '../store.js';
import * as Actions from '../actions';

class ReceiptList extends Component {

  setReceiptListFilter(filter) {
    store.dispatch(Actions.setReceiptListFilter(filter));
  }

  render() {
    let rows = this.props.receipts.map((receipt, index) => (
      <tr key={index} className="MoneyIO-table-row-as-link" onClick={() => this.props.history.push("/receipts/" + receipt.id)}>
        <td>{new Date(receipt.time * 1000).toLocaleString()}</td>
        <td>{receipt.restaurant}</td>
        <td>{receipt.participants.filter(p => p.paidAmount > 0).map(p => p.name).join(', ')}</td>
        <td>{receipt.participants.filter(p => p.paidAmount <= 0).map(p => p.name).join(', ')}</td>
        <td>{receipt.participants.filter(p => p.paidAmount > 0).map(p => p.paidAmount).reduce((a,b)=>a+b)}</td>
      </tr>
    ));
    return (
      <div>
        <div className="MoneyIO-Nav-container">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active={this.props.receiptListFilter === 'PAID_BY_ME'} onClick={() => this.setReceiptListFilter('PAID_BY_ME')}>Paid by me</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.receiptListFilter === 'INVOLVED'} onClick={() => this.setReceiptListFilter('INVOLVED')}>I was involved</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.receiptListFilter === 'ALL'} onClick={() => this.setReceiptListFilter('ALL')}>All</NavLink>
            </NavItem>
          </Nav>
        </div>
        <table className="table table-hover">
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
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

}

function getReceiptList(transactions, users) {
  return Object.keys(transactions)
    .map(transactionId => ({ 
      id: transactionId,
      time: transactions[transactionId].time,
      restaurant: transactions[transactionId].title,
      participants: Object.keys(transactions[transactionId].participants)
        .map(userId => ({
          userId: userId,
          name: (users[userId] ? users[userId].name : ''),
          paidAmount: transactions[transactionId].participants[userId]
        }))
    }));
}

function getFilteredReceiptList(filter, originalReceiptList, transactions, currentUser) {
  let filtered = [];
  if (filter == 'PAID_BY_ME') {
    filtered = originalReceiptList.filter(r => transactions[r.id].participants[currentUser.uid] > 0);
  } else if (filter == 'INVOLVED') {
    filtered = originalReceiptList.filter(r => transactions[r.id].participants[currentUser.uid])
  } else {
    filtered = originalReceiptList;
  }
  return filtered.sort((r1,r2) => r1.time < r2.time).slice(0, 50);
}

const mapStateToProps = state => ({
  receipts : getFilteredReceiptList(state.receiptListFilter,
    getReceiptList(state.transactions, state.groupUsers),
    state.transactions,
    state.currentUser),
  receiptListFilter: state.receiptListFilter
});

export default connect(mapStateToProps)(ReceiptList);
