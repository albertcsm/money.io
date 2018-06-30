import { createSelector } from "reselect";

const getCurrentUserId = state => state.currentUser.uid;
const getBuddies = state => state.buddies;
const getTransactions = state => state.transactions;
const getRawAmendmentForm = state => state.amendmentForm;

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

export const getAggregatedTransactionList = createSelector([getTransactions], (transactions) => {
  const transactionMap = {};
  Object.entries(transactions).forEach(entry => {
    transactionMap[entry[0]] = { ...entry[1], id: entry[0] };
  });

  const amendedTransactions = {};
  Object.keys(transactionMap).forEach(id => {
    if (transactionMap[id].amendmentOn) {
      const amendedTransactionId = transactionMap[id].amendmentOn;
      transactionMap[id].amendmentTransaction = transactionMap[amendedTransactionId];
      amendedTransactions[amendedTransactionId] = true;
    }
  });

  const getAggregatedTransaction = (transaction) => {
    const amendmentChain = [];
    for (let t = transaction; !!t; t = t.amendmentTransaction) {
      amendmentChain.push(t);
    }
    
    return {
      ...transaction,
      amendmentChain: amendmentChain,
      participants: amendmentChain.reduce((map, amendment) => {
        Object.keys(amendment.participants).forEach(userId => {
          const originalValue = map[userId] || 0;
          map[userId] = originalValue + amendment.participants[userId];
        });
        return map;
      }, {})
    };
  };

  return Object.values(transactionMap)
    .filter(transaction => !amendedTransactions[transaction.id])
    .map(transaction => {
      if (transaction.amendmentOn) {
        return getAggregatedTransaction(transaction);
      } else {
        return transaction;
      }
    })
    .sort((a,b) => a.time < b.time);
});

export const getMyTransactionList = createSelector([getCurrentUserId, getAggregatedTransactionList], (currentUserId, aggregatedTransactionList) => {
  return aggregatedTransactionList.filter(t => t.participants.hasOwnProperty(currentUserId));
});

export const getMyEnteredTransactionList = createSelector([getCurrentUserId, getMyTransactionList], (currentUserId, myTransactionList) => {
  return myTransactionList.filter(t => t.enteredBy === currentUserId);
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

export const getAmendmentForm = createSelector([getRawAmendmentForm, getBuddies], (rawAmendmentForm, buddies) => {
  if (rawAmendmentForm.existingTransaction) {
    return {
      ...rawAmendmentForm,
      items: rawAmendmentForm.items.map(item => ({
        ...item,
        buddyUserName: buddies[item.buddyUserId] ? buddies[item.buddyUserId].name : item.buddyUserName
      }))
    }
  } else {
    return rawAmendmentForm;
  }
});