import { database } from '../firebaseApp.js';

export function fetchGroupUsers(groupId = 'default') {
  console.log('fetch group users');
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
  console.log('fetch group transactions');
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

export function setSubList(subList) {
  return {
    type: 'SET_SUB_LIST',
    data: subList
  };
};
