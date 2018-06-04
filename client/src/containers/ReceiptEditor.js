import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../store.js';
import * as Actions from '../actions';
import EntryForm from '../components/EntryForm'

class ReceiptEditor extends Component {

  componentWillMount() {
    store.dispatch(Actions.initializeReceipt());
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
      onReceiptUpdate={(receipt) => this.updateReceipt(receipt)}
      onReceiptPublish={(receipt) => this.publishReceipt(receipt)}/>);
  }

}

const mapStateToProps = state => ({
  receipt: state.receiptForNewEntry,
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(ReceiptEditor);
