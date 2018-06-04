const INITIAL_STATE = {
  authenticating: true,
  currentUser: null,
  groupUsers: [],
  users: [],
  groupTransactions: [],
  transactions: [],
  receiptForNewEntry: {
    restaurant: '',
    items: []
  },
  buddyListFilter: 'CLOSE_BUDDIES',
  receiptListFilter: 'PAID_BY_ME',
  publishingTransaction: false
};

export default function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'AUTHENTICATED':
      return {
        ...state,
        authenticating: false,
        currentUser: action.payload
      };
    case 'UNAUTHENTICATED':
      return {
        ...state,
        authenticating: false,
        currentUser: action.payload,
        groupUsers: [],
        users: [],
        groupTransactions: [],
        transactions: []
      };
    case 'FETCH_GROUP_USERS_SUCCEEDED':
      return {
        ...state,
        groupUsers: action.payload
      };
    case 'FETCH_USERS_SUCCEEDED':
      return {
        ...state,
        users: action.payload
      };
    case 'FETCH_GROUP_TRANSACTIONS_SUCCEEDED':
      return {
        ...state,
        groupTransactions: action.payload
      };
    case 'FETCH_TRANSACTIONS_SUCCEEDED':
      return {
        ...state,
        transactions: action.payload
      };
    case 'INITIALIZE_RECEIPT':
      return {
        ...state,
        receiptForNewEntry: action.payload
      }
    case 'PUBLISH_TRANSACTION_START':
      return {
        ...state,
        publishingTransaction: true
      };
    case 'PUBLISH_TRANSACTION_SUCCEEDED':
      return {
        ...state,
        publishingTransaction: false
      };
    case 'SET_BUDDY_LIST_FILTER':
      return {
        ...state,
        buddyListFilter: action.payload
      };
    case 'SET_RECEIPT_LIST_FILTER':
      return {
        ...state,
        receiptListFilter: action.payload
      };
    case 'SET_RECEIPT_FOR_NEW_ENTRY':
      return {
        ...state,
        receiptForNewEntry: action.payload
      };
    default:
      return state;
  }
};