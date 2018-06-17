import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../store.js';
import * as Actions from '../actions';
import EntryForm from '../components/EntryForm'

class ExistingReceiptEditor extends Component {

  componentWillMount() {
    const parentTransactionId = this.props.match.params.transactionId;
    if (this.props.receipt.parent !== parentTransactionId) {
      store.dispatch(Actions.initializeAmendmentForm(parentTransactionId));
    }
  }

  updateFormData(receipt) {
    store.dispatch(Actions.updateAmendmentForm(receipt));
  }

  publishAmendment(receipt) {
    const transaction = {
      "id": receipt.transactionId,
      "time": receipt.time / 1000,
      "parent": receipt.parent,
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
      onReceiptUpdate={(receipt) => this.updateFormData(receipt)}
      onReceiptPublish={(receipt) => this.publishReceipt(receipt)}/>);
  }

}

function getUserList(users) {
  return Object.keys(users).map(key => ({ ...users[key], id: key }));
}

const mapStateToProps = state => ({
  receipt: state.receiptForExistingEntry,
  users: getUserList(state.groupUsers),
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(ExistingReceiptEditor);
