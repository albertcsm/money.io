import React, { Component } from 'react';

import { connect } from 'react-redux';

import { formProviders } from '../configs';
import store from '../store.js';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import FormTypeSelector from '../components/FormTypeSelector';

class NewEntryContainer extends Component {

  componentWillMount() {
    if (!this.props.formData.transactionId) {
      store.dispatch(Actions.initializeNewEntryForm("RECEIPT"));
    }
  }

  updateForm(formData) {
    store.dispatch(Actions.updateNewEntryForm(formData));
  }

  publishTransaction(formData) {
    const transaction = {
      "title": formData.title,
      'type': formData.type,
      "participants": {},
      "enteredBy": this.props.currentUser.uid
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
    const MatchedForm = (formProviders.find(p => p.key === this.props.formData.type) || formProviders[0]).form;
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center mb-4">
            <FormTypeSelector selectedType={this.props.formData.type} onChange={(formType) => store.dispatch(Actions.initializeNewEntryForm(formType))}/>
          </div>
          <MatchedForm formData={this.props.formData}
            buddyList={this.props.buddyList}
            onUpdate={formData => this.updateForm(formData)}
            onPublish={formData => this.publishTransaction(formData)}/>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  formData: state.newEntryForm,
  buddyList: Selectors.getBuddyList(state),
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(NewEntryContainer);
