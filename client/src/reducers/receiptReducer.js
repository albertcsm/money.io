const initialState = {
  items: [],
  subList: 'paidByMe'
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_RECEIPTS':
      return {
        ...state,
        items: action.data
      };
    case 'SET_SUB_LIST':
      return {
        ...state,
        subList: action.data
      };
    default:
      return state;
  }
};