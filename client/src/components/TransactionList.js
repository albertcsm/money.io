import React, { Component } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';

import store from '../store.js';
import * as Actions from '../actions';
import * as Selectors from '../selectors';

const TransactionFilter = {
  PAID_BY_ME: 'PAID_BY_ME',
  INVOLVED: 'INVOLVED',
  ALL: 'ALL',
};

class TransactionList extends Component {

  setTransactionListFilter(filter) {
    store.dispatch(Actions.setTransactionListFilter(filter));
  }

  renderTransactionRow(t) {
    return (
      <tr key={t.id} className="MoneyIO-table-row-as-link" onClick={() => this.props.history.push("/transactions/" + t.id)}>
        <td>{new Date(t.time).toLocaleString()}</td>
        <td>{t.title}</td>
        <td>
          {Object.entries(t.participants)
            .filter(e => e[1] > 0)
            .map(e => this.props.buddies[e[0]].name).join(', ')}
        </td>
        <td>
          {Object.entries(t.participants)
            .filter(e => e[1] <= 0)
            .map(e => this.props.buddies[e[0]].name).join(', ')}
        </td>
        <td>
          {Object.entries(t.participants)
            .filter(e => e[1] > 0)
            .map(e => e[1])
            .reduce((a, b) => a + b, 0)}
        </td>
      </tr>
    );
  }

  renderAmendedTransactionRow(t) {
    return (
      <tr key={'amendment-' + t.id} className="table-sm small MoneyIO-table-row-as-link MoneyIO-table-row-indent" onClick={() => this.props.history.push("/transactions/" + t.id)}>
        <td>revision: {new Date(t.time).toLocaleString()}</td>
        <td>{t.title}</td>
        <td>
          {Object.entries(t.participants)
            .filter(e => e[1] > 0)
            .map(e => this.props.buddies[e[0]].name).join(', ')}
        </td>
        <td>
          {Object.entries(t.participants)
            .filter(e => e[1] <= 0)
            .map(e => this.props.buddies[e[0]].name).join(', ')}
        </td>
        <td></td>
      </tr>
    );
  }

  render() {
    let filteredTransactionList;
    if (this.props.transactionListFilter === TransactionFilter.PAID_BY_ME) {
      filteredTransactionList = this.props.myPaidTransactionList;
    } else if (this.props.transactionListFilter === TransactionFilter.INVOLVED) {
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
              <NavLink href="#" active={this.props.transactionListFilter === TransactionFilter.PAID_BY_ME} onClick={() => this.setTransactionListFilter(TransactionFilter.PAID_BY_ME)}>Paid by me</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.transactionListFilter === TransactionFilter.INVOLVED} onClick={() => this.setTransactionListFilter(TransactionFilter.INVOLVED)}>I was involved</NavLink>
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
              <th>Paid by</th>
              <th>Involved</th>
              <th>Total</th>
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
  myPaidTransactionList: Selectors.getMyPaidTransactionList(state),
  buddies: state.buddies,
  transactionListFilter: state.transactionListFilter
});

export default connect(mapStateToProps)(TransactionList);
