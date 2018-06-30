import * as Actions from '../actions';
import {formProviders} from '../configs';

const INITIAL_STATE = {
  authenticating: true,
  currentUser: null,
  userPrivateData: {},
  buddies: {},
  transactions: {},
  buddyList: [],
  transactionList: [],
  newEntryForm: {
    title: '',
    type: formProviders[0].key,
    items: []
  },
  amendmentForm: {},
  buddyListFilter: 'CLOSE_BUDDIES',
  transactionListFilter: 'MY_TRANSACTIONS',
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