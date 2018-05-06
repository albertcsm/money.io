export function fetchReceipts() {
  const receipts = [
    {
      time: '2018-05-06T15:14:00+08:00',
      restaurant: 'Maxim',
      paidBy: 'alice',
      items: [
        {
          name: "Noodle",
          price: 36.7,
          buddy: "bob"
        }
      ]
    }
  ];
  return {
        type: 'FETCH_RECEIPTS',
        data: receipts
  };
};

export function setSubList(subList) {
  return {
    type: 'SET_SUB_LIST',
    data: subList
  };
};
