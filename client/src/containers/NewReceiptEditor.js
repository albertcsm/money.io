import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../store.js';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import EntryForm from '../components/EntryForm'

class NewReceiptEditor extends Component {

  componentWillMount() {
    if (!this.props.formData.transactionId) {
      store.dispatch(Actions.initializeNewEntryForm());
    }
  }

  updateForm(formData) {
    store.dispatch(Actions.updateNewEntryForm(formData));
  }

  publishTransaction(formData) {
    const transaction = {
      "id": formData.transactionId,
      "time": formData.time,
      "title": formData.title,
      "participants": {}
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
      onUpdate={formData => this.updateForm(formData)}
      onPublish={formData => this.publishTransaction(formData)}/>);
  }

}

const mapStateToProps = state => ({
  formData: state.newEntryForm,
  buddyList: Selectors.getBuddyList(state),
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(NewReceiptEditor);
