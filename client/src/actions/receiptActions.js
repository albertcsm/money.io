import { database } from '../firebaseApp.js';

export function fetchReceipts() {
  return dispatch => {
    var transactionsRef = database.ref('transactions');
    database.ref('groups/default/transactions').once('value')
      .then(snap => snap.val())
      .then(transactionsObject => Object.keys(transactionsObject).map(transactionId => 
        Object.assign(transactionsObject[transactionId], { id: transactionId })))
      .then(transactions => {
        const promises = [];
        transactions.forEach(transaction => promises.push(transactionsRef.child(transaction.id).once('value')));
        return Promise.all(promises).then(transactionsRef => {
          for (let i = 0; i < transactions.length; i++) {
            Object.assign(transactions[i], transactionsRef[i].val());
          }
          return transactions;
        });
      })
      .then(transactions => transactions.map(transaction => {
        const participants = Object.keys(transaction.participants).map(userId => ({
          userId: userId,
          name: userId,
          paidAmount: transaction.participants[userId]
        }));

        Object.keys(transaction.participants)
        return {
          time: transaction.time,
          restaurant: transaction.title,
          participants: participants
        };
      }))
      .then(r => {console.log(r); return r})
      .then(receipts => dispatch({ type: 'FETCH_RECEIPTS', data: receipts }));
  };
};

export function setSubList(subList) {
  return {
    type: 'SET_SUB_LIST',
    data: subList
  };
};
