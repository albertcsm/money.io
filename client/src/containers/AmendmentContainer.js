import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../store.js';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import EntryForm from '../components/EntryForm'

class AmendmentContainer extends Component {

  componentWillMount() {
    const existingTransactionId = this.props.match.params.transactionId;
    if (!this.props.formData.existingTransaction || this.props.formData.existingTransaction.id !== existingTransactionId) {
      store.dispatch(Actions.initializeAmendmentForm(existingTransactionId));
    }
  }

  updateForm(formData) {
    store.dispatch(Actions.updateAmendmentForm(formData));
  }

  publishAmendment(formData) {
    const transaction = {
      "id": formData.transactionId,
      "type": formData.type,
      "time": formData.time,
      "title": formData.title,
      "participants": {},
      "enteredBy": this.props.currentUser.uid,
      "amendmentOn": formData.existingTransaction.transactionId
    };
    let total = 0;
    formData.items.forEach(item => {
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
    return (<EntryForm formData={this.props.formData}
      buddyList={this.props.buddyList}
      onUpdate={(formData) => this.updateForm(formData)}
      onPublish={(formData) => this.publishAmendment(formData)}/>);
  }

}

const mapStateToProps = state => ({
  formData: Selectors.getAmendmentForm(state),
  buddyList: Selectors.getBuddyList(state),
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(AmendmentContainer);
