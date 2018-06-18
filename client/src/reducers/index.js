import * as Actions from '../actions';

const INITIAL_STATE = {
  authenticating: true,
  currentUser: null,
  userPrivateData: {},
  buddies: {},
  transactions: {},
  transactionAmendments: {},
  buddyList: [],
  transactionList: [],
  newEntryForm: {
    title: '',
    items: []
  },
  amendmentForm: {
    title: '',
    items: []
  },
  buddyListFilter: 'CLOSE_BUDDIES',
  transactionListFilter: 'PAID_BY_ME',
  publishingTransaction: false
};

export default function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Actions.SET_AUTHENTICATED:
      return {
        ...state,
        authenticating: false,
        currentUser: action.payload
      };
    case Actions.SET_UNAUTHENTICATED:
      return {
        ...INITIAL_STATE,
        authenticating: false
      };
    case Actions.FETCH_USER_PRIVATE_DATA_SUCCEEDED:
      return {
        ...state,
        userPrivateData: action.payload
      };
    case Actions.FETCH_BUDDIES_SUCCEEDED:
      return {
        ...state,
        buddies: action.payload
      };
    case Actions.FETCH_TRANSACTIONS_SUCCEEDED:
      return {
        ...state,
        transactions: action.payload
      };
    case Actions.FETCH_TRANSACTION_AMENDMENTS_SUCCEEDED:
      return {
        ...state,
        transactionAmendments: action.payload
      };
    case Actions.UPDATE_NEW_ENTRY_FORM:
      return {
        ...state,
        newEntryForm: action.payload
      };
    case Actions.UPDATE_AMENDMENT_FORM:
      return {
        ...state,
        amendmentForm: action.payload
      };
    case Actions.PUBLISH_TRANSACTION_START:
      return {
        ...state,
        publishingTransaction: true
      };
    case Actions.PUBLISH_TRANSACTION_SUCCEEDED:
      return {
        ...state,
        publishingTransaction: false
      };
    case Actions.SET_BUDDY_LIST_FILTER:
      return {
        ...state,
        buddyListFilter: action.payload
      };
    case Actions.SET_TRANSACTION_LIST_FILTER:
      return {
        ...state,
        transactionListFilter: action.payload
      };
    default:
      return state;
  }
};