import { createSelector } from "reselect";

const getCurrentUserId = state => state.currentUser.uid;
const getBuddies = state => state.buddies;
const getTransactions = state => state.transactions;

export const getBuddyList = createSelector([getBuddies, getTransactions], (buddies, transactions) => {
  return Object.keys(buddies).map(id => ({
    ...buddies[id],
    id,
    balance: Object.values(transactions)
      .filter(t => t.participants.hasOwnProperty(id))
      .map(t => t.participants[id])
      .reduce((a, b) => a + b, 0)
  }));
});

export const getRawTransactionList = createSelector([getTransactions], transactions => {
  return Object.keys(transactions)
    .map(id => ({
      ...transactions[id],
      id
    }))
    .sort((a,b) => a.time < b.time);
});

export const getAggregatedTransactionList = createSelector([getRawTransactionList], (transactionList) => {
  return transactionList.map(t => ({
    ...t,
    summarizedTransactions: []
  }));
});

export const getMyTransactionList = createSelector([getCurrentUserId, getAggregatedTransactionList], (currentUserId, aggregatedTransactionList) => {
  return aggregatedTransactionList.filter(t => t.participants.hasOwnProperty(currentUserId));
});

export const getMyPaidTransactionList = createSelector([getCurrentUserId, getMyTransactionList], (currentUserId, myTransactionList) => {
  return myTransactionList.filter(t => t.participants[currentUserId] > 0);
});

export const getCloseBuddyList = createSelector([getCurrentUserId, getMyTransactionList, getBuddyList], (currentUserId, myTransactionList, buddyList) => {
  const buddyScores = {};
  myTransactionList.forEach(t => {
    Object.keys(t.participants).forEach(u => {
      if (!buddyScores.hasOwnProperty(u)) {
        buddyScores[u] = 0;
      }
      buddyScores[u] += 1;
    });
  });
  const myOwnScore = buddyScores[currentUserId];
  return buddyList.filter(u => u.id !== currentUserId && buddyScores.hasOwnProperty(u.id))
    .map(u => ({
      ...u,
      closeness: buddyScores[u.id] / myOwnScore
    }))
    .sort((a,b) => a.closeness < b.closeness);
});