import { database } from '../firebaseApp.js';

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const SET_UNAUTHENTICATED = 'SET_UNAUTHENTICATED';
export const FETCH_USER_PRIVATE_DATA_SUCCEEDED = 'FETCH_USER_PRIVATE_DATA_SUCCEEDED';
export const FETCH_BUDDIES_SUCCEEDED = 'FETCH_GROUP_MEMBERS_SUCCEEDED';
export const FETCH_TRANSACTIONS_SUCCEEDED = 'FETCH_TRANSACTIONS_SUCCEEDED';
export const UPDATE_NEW_ENTRY_FORM = 'UPDATE_NEW_ENTRY_FORM';
export const UPDATE_AMENDMENT_FORM = 'UPDATE_AMENDMENT_FORM';
export const PUBLISH_TRANSACTION_START = 'PUBLISH_TRANSACTION_START';
export const PUBLISH_TRANSACTION_SUCCEEDED = 'PUBLISH_TRANSACTION_SUCCEEDED';
export const SET_BUDDY_LIST_FILTER = 'SET_BUDDY_LIST_FILTER';
export const SET_TRANSACTION_LIST_FILTER = 'SET_TRANSACTION_LIST_FILTER';

export function setAuthenticated(currentUser) {
  return { type: SET_AUTHENTICATED, payload: currentUser }
};

export function setUnauthenticated() {
  return { type: SET_UNAUTHENTICATED, payload: null }
};

export function initializeForUser(user) {
  return dispatch => {
    database.ref('users/' + user.uid).on('value', snapshot => {
      const privateUserData = snapshot.val();
      dispatch({ type: FETCH_USER_PRIVATE_DATA_SUCCEEDED, payload: privateUserData });

      const groupIds = Object.keys(privateUserData.groups);
      if (groupIds.length > 0) {
        const defaultGroup = groupIds[0];
        dispatch(fetchBuddies(defaultGroup));
        dispatch(fetchTransactions(defaultGroup));
      }
    });
  };
};

export function fetchBuddies(groupId = 'default') {
  return dispatch => {
    database.ref('groups/' + groupId + '/users').on('value', snapshot => {
      dispatch({ type: FETCH_BUDDIES_SUCCEEDED, payload: snapshot.val() });
    });
  };
};

export function fetchTransactions(groupId = 'default') {
  return dispatch => {
    database.ref('groups/' + groupId + '/transactions').on('value', snapshot => {
      dispatch({ type: FETCH_TRANSACTIONS_SUCCEEDED, payload: snapshot.val() });
    });
  };
};

export function initializeNewEntryForm() {
  return dispatch => {
    dispatch({ type: UPDATE_NEW_ENTRY_FORM, payload: { 
      transactionId: database.ref().child('transactions').push().key,
      time: Date.now(),
      title: '',
      items: [
        {
          buddyUserId: '',
          buddyUserName: '',
          amount: ''
        }
      ]
    }});
  }
};

export function updateNewEntryForm(formData) {
  return { type: UPDATE_NEW_ENTRY_FORM, payload: formData };
}

export function initializeAmendmentForm(transactionId, groupId = 'default') {
  return dispatch => {
    database.ref('/groups/' + groupId + '/transactions/' + transactionId).once('value').then(snapshot => {
      const existingTransaction = snapshot.val();
      const amendmentForm = { 
        transactionId: database.ref().child('transactions').push().key,
        existingTransaction,
        time: existingTransaction.time,
        title: existingTransaction.title,
        items: Object.entries(existingTransaction.participants)
          .filter(e => e[1] < 0)
          .map(e => ({
            buddyUserId: e[0],
            buddyUserName: 'unknown',
            amount: -e[1]
          }))
      };
      dispatch({ type: UPDATE_AMENDMENT_FORM, payload: amendmentForm });
    });
  }
};

export function updateAmendmentForm(formData) {
  return { type: UPDATE_AMENDMENT_FORM, payload: formData };
}

export function publishTransaction(transaction, groupId = 'default') {
  return dispatch => {
    dispatch({ type: PUBLISH_TRANSACTION_START, payload: null });

    var transactionWithoutId = { ...transaction };
    delete transactionWithoutId.id;

    database.ref('/groups/' + groupId + '/transactions/' + transaction.id).set(transactionWithoutId).then(() => {
      dispatch({ type: PUBLISH_TRANSACTION_SUCCEEDED, payload: null });
    });
  };
};

export function setBuddyListFilter(filter) {
  return { type: SET_BUDDY_LIST_FILTER, payload: filter };
};

export function setTransactionListFilter(filter) {
  return { type: SET_TRANSACTION_LIST_FILTER, payload: filter };
};