const INITIAL_STATE = {
  groupUsers: [],
  users: [],
  groupTransactions: [],
  transactions: []
};

export default function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
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
    case 'SET_SUB_LIST':
      return {
        ...state,
        subList: action.payload
      };
    default:
      return state;
  }
};