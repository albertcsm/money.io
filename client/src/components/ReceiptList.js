import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';

class ReceiptList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subList: 'paidByMe'
    }
  }

  setSubList(subListName) {
    this.setState({ subList: subListName });
  }

  render() {
    let rows = this.props.receipts.map((receipt, index) => (
      <tr key={index}>
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
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

}

function getReceiptList(groupTransactions, transactions, users) {
  return Object.keys(groupTransactions)
    .filter(transactionId => transactions[transactionId])
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

const mapStateToProps = state => ({
  receipts : getReceiptList(state.groupTransactions, state.transactions, state.users)
});

export default connect(mapStateToProps)(ReceiptList);
