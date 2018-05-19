const initialState = {
  items: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_BUDDIES':
      return {
        ...state,
        items: action.data
      };
    default:
      return state;
  }
};