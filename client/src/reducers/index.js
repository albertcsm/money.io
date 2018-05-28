const INITIAL_STATE = {
  authenticating: true,
  currentUser: null,
  groupUsers: [],
  users: [],
  groupTransactions: [],
  transactions: [],
  buddyListFilter: 'CLOSE_BUDDIES'
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
    case 'SET_BUDDY_LIST_FILTER':
      return {
        ...state,
        buddyListFilter: action.payload
      };
    default:
      return state;
  }
};