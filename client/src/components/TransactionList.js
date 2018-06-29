import React, { Component } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import Moment from 'moment';

import store from '../store.js';
import * as Actions from '../actions';
import * as Selectors from '../selectors';

const TransactionFilter = {
  MY_TRANSACTIONS: 'MY_TRANSACTIONS',
  ENTERED_BY_ME: 'ENTERED_BY_ME',
  ALL: 'ALL',
};

class TransactionList extends Component {

  setTransactionListFilter(filter) {
    store.dispatch(Actions.setTransactionListFilter(filter));
  }

  renderTransactionRow(t) {
    return (
      <tr key={t.id} className="MoneyIO-table-row-as-link" onClick={() => this.props.history.push("/transactions/" + t.id)}>
        <td>{Moment(t.time).format('YYYY-MM-DD h:mm a')}</td>
        <td>{t.title}</td>
        {this.props.transactionListFilter !== "ENTERED_BY_ME" &&
          <td>
            {this.props.buddies[t.enteredBy].name}
          </td>
        }
        <td>
          {Object.keys(t.participants)
            .map(id => this.props.buddies[id].name).join(', ')}
        </td>
        {this.props.transactionListFilter !== "ALL" &&
          <td>
            {t.participants[this.props.currentUser.uid]}
          </td>
        }
      </tr>
    );
  }

  renderAmendedTransactionRow(t) {
    return (
      <tr key={'amendment-' + t.id} className="table-sm small MoneyIO-table-row-as-link MoneyIO-table-row-indent" onClick={() => this.props.history.push("/transactions/" + t.id)}>
        <td>{t.amendmentOn ? 'amendment' : 'original'}: {Moment(t.time).format('YYYY-MM-DD h:mm a')}</td>
        <td>{t.title}</td>
        {this.props.transactionListFilter !== "ENTERED_BY_ME" &&
          <td>
            {this.props.buddies[t.enteredBy].name}
          </td>
        }
        <td>
          {Object.keys(t.participants)
            .map(id => this.props.buddies[id].name).join(', ')}
        </td>
        {this.props.transactionListFilter !== "ALL" &&
          <td>
            {t.participants[this.props.currentUser.uid]}
          </td>
        }
      </tr>
    );
  }

  render() {
    let filteredTransactionList;
    if (this.props.transactionListFilter === TransactionFilter.ENTERED_BY_ME) {
      filteredTransactionList = this.props.myEnteredTransactionList;
    } else if (this.props.transactionListFilter === TransactionFilter.MY_TRANSACTIONS) {
      filteredTransactionList = this.props.myTransactionList;
    } else if (this.props.transactionListFilter === TransactionFilter.ALL) {
      filteredTransactionList = this.props.transactionList;
    } else {
      filteredTransactionList = [];
    }

    const flattenList = filteredTransactionList.reduce((agg, filteredTransactionList) => {
      agg.push(filteredTransactionList);
      if (filteredTransactionList.amendmentChain) {
        filteredTransactionList.amendmentChain.forEach((amendment) => {
          agg.push(Object.assign({}, amendment, { isAmendment: true }));
        });
      }
      return agg;
    }, []);

    return (
      <div>
        <div className="MoneyIO-Nav-container">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active={this.props.transactionListFilter === TransactionFilter.MY_TRANSACTIONS} onClick={() => this.setTransactionListFilter(TransactionFilter.MY_TRANSACTIONS)}>My transactions</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.transactionListFilter === TransactionFilter.ENTERED_BY_ME} onClick={() => this.setTransactionListFilter(TransactionFilter.ENTERED_BY_ME)}>Entered by me</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.transactionListFilter === TransactionFilter.ALL} onClick={() => this.setTransactionListFilter(TransactionFilter.ALL)}>All</NavLink>
            </NavItem>
          </Nav>
        </div>
        <table className="table table-hover table-responsive-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              {this.props.transactionListFilter !== "ENTERED_BY_ME" && <th>Entered by</th>}
              <th>Involved</th>
              {this.props.transactionListFilter !== "ALL" && <th>Amount</th>}
            </tr>
          </thead>
          <tbody>
            { flattenList.map(t => t.isAmendment ? this.renderAmendedTransactionRow(t) : this.renderTransactionRow(t)) }
          </tbody>
        </table>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  transactionList: Selectors.getAggregatedTransactionList(state),
  myTransactionList: Selectors.getMyTransactionList(state),
  myEnteredTransactionList: Selectors.getMyEnteredTransactionList(state),
  buddies: state.buddies,
  currentUser: state.currentUser,
  transactionListFilter: state.transactionListFilter
});

export default connect(mapStateToProps)(TransactionList);
