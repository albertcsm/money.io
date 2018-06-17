import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../store.js';
import * as Actions from '../actions';
import EntryForm from '../components/EntryForm'

class NewReceiptEditor extends Component {

  componentWillMount() {
    if (!this.props.receipt.transactionId) {
      store.dispatch(Actions.initializeReceipt());
    }
  }

  updateReceipt(receipt) {
    store.dispatch(Actions.setReceiptForNewEntry(receipt));
  }

  publishReceipt(receipt) {
    const transaction = {
      "id": receipt.transactionId,
      "time": receipt.time / 1000,
      "title": receipt.restaurant,
      "participants": {}
    };
    let total = 0;
    receipt.items.forEach(item => {
      const amount = Number(item.amount);
      if (amount > 0) {
        transaction.participants[item.buddyUserId] = -amount;
        total += amount;
      }
    });
    transaction.participants[this.props.currentUser.uid] = total;
    store.dispatch(Actions.publishTransaction(transaction));
  }

  render() {
    return (<EntryForm receipt={this.props.receipt}
      users={this.props.users}
      onReceiptUpdate={(receipt) => this.updateReceipt(receipt)}
      onReceiptPublish={(receipt) => this.publishReceipt(receipt)}/>);
  }

}

function getUserList(users) {
  return Object.keys(users).map(key => ({ ...users[key], id: key }));
}

const mapStateToProps = state => ({
  receipt: state.receiptForNewEntry,
  users: getUserList(state.groupUsers),
  currentUser: state.currentUser,
  transactions: state.transactions,
});

export default connect(mapStateToProps)(NewReceiptEditor);
