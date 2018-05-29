import { database } from '../firebaseApp.js';

export function setAuthenticated(currentUser) {
  return { type: 'AUTHENTICATED', payload: currentUser }
};

export function setUnauthenticated() {
  return { type: 'UNAUTHENTICATED', payload: null }
};

export function fetchGroupUsers(groupId = 'default') {
  return dispatch => {
    database.ref('groups/' + groupId + '/users').on('value', snapshot => {
      dispatch({ type: 'FETCH_GROUP_USERS_SUCCEEDED', payload: snapshot.val() });
    });
  };
};

export function fetchUsers() {
  return dispatch => {
    database.ref('users').on('value', snapshot => {
      dispatch({ type: 'FETCH_USERS_SUCCEEDED', payload: snapshot.val() });
    });
  };
};

export function fetchGroupTransactions(groupId = 'default') {
  return dispatch => {
    database.ref('groups/' + groupId + '/transactions').on('value', snapshot => {
      dispatch({ type: 'FETCH_GROUP_TRANSACTIONS_SUCCEEDED', payload: snapshot.val() });
    });
  };
};

export function fetchTransactions() {
  return dispatch => {
    database.ref('transactions').on('value', snapshot => {
      dispatch({ type: 'FETCH_TRANSACTIONS_SUCCEEDED', payload: snapshot.val() });
    });
  };
};

export function setBuddyListFilter(filter) {
  return { type: 'SET_BUDDY_LIST_FILTER', payload: filter };
};

export function setReceiptListFilter(filter) {
  return { type: 'SET_RECEIPT_LIST_FILTER', payload: filter };
};