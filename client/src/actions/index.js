import { database } from '../firebaseApp.js';

export function setAuthenticated(currentUser) {
  return { type: 'AUTHENTICATED', payload: currentUser }
};

export function setUnauthenticated() {
  return { type: 'UNAUTHENTICATED', payload: null }
};

export function initializeForUser(user) {
  return dispatch => {
    database.ref('users/' + user.uid).on('value', snapshot => {
      const privateUserData = snapshot.val();
      dispatch({ type: 'FETCH_USER_PRIVATE_DATA_SUCCEEDED', payload: privateUserData });

      const groupIds = Object.keys(privateUserData.groups);
      if (groupIds.length > 0) {
        const defaultGroup = groupIds[0];
        dispatch(fetchGroupUsers(defaultGroup));
        dispatch(fetchTransactions(defaultGroup));
      }
    });
  };
};

export function fetchGroupUsers(groupId = 'default') {
  return dispatch => {
    database.ref('groups/' + groupId + '/users').on('value', snapshot => {
      dispatch({ type: 'FETCH_GROUP_USERS_SUCCEEDED', payload: snapshot.val() });
    });
  };
};

export function fetchUserPrivateData(userId) {
  return dispatch => {
    database.ref('users/' + userId).on('value', snapshot => {
      dispatch({ type: 'FETCH_USER_PRIVATE_DATA_SUCCEEDED', payload: snapshot.val() });
    });
  };
};

export function fetchTransactions(groupId = 'default') {
  return dispatch => {
    database.ref('groups/' + groupId + '/transactions').on('value', snapshot => {
      dispatch({ type: 'FETCH_TRANSACTIONS_SUCCEEDED', payload: snapshot.val() });
    });
  };
};

export function initializeReceipt() {
  return dispatch => {
    dispatch({ type: 'INITIALIZE_RECEIPT', payload: { 
      transactionId: database.ref().child('transactions').push().key,
      time: Date.now(),
      restaurant: '',
      items: [
        {
          buddyUserId: '',
          buddyUserName: '',
          amount: null
        }
      ]
    }});
  }
}

export function publishTransaction(transaction, groupId = 'default') {
  return dispatch => {
    dispatch({ type: 'PUBLISH_TRANSACTION_START', payload: null });

    var transactionWithoutId = { ...transaction };
    delete transactionWithoutId.id;

    database.ref('/groups/' + groupId + '/transactions/' + transaction.id).set(transactionWithoutId).then(() => {
      dispatch({ type: 'PUBLISH_TRANSACTION_SUCCEEDED', payload: null });
    });
  };
};

export function setBuddyListFilter(filter) {
  return { type: 'SET_BUDDY_LIST_FILTER', payload: filter };
};

export function setReceiptListFilter(filter) {
  return { type: 'SET_RECEIPT_LIST_FILTER', payload: filter };
};

export function setReceiptForNewEntry(receipt) {
  return { type: 'SET_RECEIPT_FOR_NEW_ENTRY', payload: receipt };
}