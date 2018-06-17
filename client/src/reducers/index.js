import * as Actions from '../actions';

const INITIAL_STATE = {
  authenticating: true,
  currentUser: null,
  userPrivateData: {},
  groupUsers: [],
  transactions: [],
  receiptForNewEntry: {
    restaurant: '',
    items: []
  },
  receiptForExistingEntry: {
    restaurant: '',
    items: []
  },
  buddyListFilter: 'CLOSE_BUDDIES',
  receiptListFilter: 'PAID_BY_ME',
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
        ...state,
        authenticating: false,
        currentUser: action.payload,
        groupUsers: [],
        users: [],
        groupTransactions: [],
        transactions: []
      };
    case Actions.FETCH_USER_PRIVATE_DATA_SUCCEEDED:
      return {
        ...state,
        userPrivateData: action.payload
      };
    case Actions.FETCH_GROUP_MEMBERS_SUCCEEDED:
      return {
        ...state,
        groupUsers: action.payload
      };
    case Actions.FETCH_TRANSACTIONS_SUCCEEDED:
      return {
        ...state,
        transactions: action.payload
      };
    case Actions.UPDATE_NEW_ENTRY_FORM:
      return {
        ...state,
        receiptForNewEntry: action.payload
      };
    case Actions.UPDATE_AMENDMENT_FORM:
      return {
        ...state,
        receiptForExistingEntry: action.payload
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
        receiptListFilter: action.payload
      };
    default:
      return state;
  }
};