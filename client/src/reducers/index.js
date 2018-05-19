import { combineReducers } from 'redux';

import buddyReducer  from './buddyReducer';
import receiptReducer  from './receiptReducer';

export default combineReducers({
  buddies: buddyReducer,
  receipts: receiptReducer 
});