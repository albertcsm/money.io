import RestaurantBillEntryForm from '../components/RestaurantBillEntryForm';
import RawTransactionEntryForm from '../components/RawTransactionEntryForm';

export const formProviders = [
  {
    key: 'RECEIPT',
    name: 'Restaurant bill',
    form: RestaurantBillEntryForm
  },
  {
    key: 'TRANSACTION',
    name: 'Transaction',
    form: RawTransactionEntryForm
  }
];