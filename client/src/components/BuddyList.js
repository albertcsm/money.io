import React, { Component } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux'

import store from '../store.js';
import * as Actions from '../actions';
import * as Selectors from '../selectors';

const BuddyFilter = {
  CLOSE_BUDDIES: 'CLOSE_BUDDIES',
  TOP_DEBTORS: 'TOP_DEBTORS',
  TOP_CREDITORS: 'TOP_CREDITORS',
}

class BuddyList extends Component {

  setBuddyListFilter(filter) {
    store.dispatch(Actions.setBuddyListFilter(filter));
  }

  render() {
    let filteredAndSortedBuddyList;
    if (this.props.buddyListFilter === BuddyFilter.CLOSE_BUDDIES) {
      filteredAndSortedBuddyList = this.props.closeBuddyList.slice(0, 10);
    } else if (this.props.buddyListFilter === BuddyFilter.TOP_DEBTORS) {
      filteredAndSortedBuddyList = this.props.buddyList.sort((a,b) => a.balance > b.balance).slice(0, 10);
    } else if (this.props.buddyListFilter === BuddyFilter.TOP_CREDITORS) {
      filteredAndSortedBuddyList = this.props.buddyList.sort((a,b) => a.balance < b.balance).slice(0, 10);
    }
    return (
      <div>
        <div className="MoneyIO-Nav-container">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active={this.props.buddyListFilter === BuddyFilter.CLOSE_BUDDIES} onClick={() => this.setBuddyListFilter('CLOSE_BUDDIES')}>Close buddies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.buddyListFilter === BuddyFilter.TOP_DEBTORS} onClick={() => this.setBuddyListFilter('TOP_DEBTORS')}>Top debtors</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.buddyListFilter === BuddyFilter.TOP_CREDITORS} onClick={() => this.setBuddyListFilter('TOP_CREDITORS')}>Top creditors</NavLink>
            </NavItem>
          </Nav>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              { this.props.buddyListFilter === BuddyFilter.CLOSE_BUDDIES && <th>Closeness</th> }
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedBuddyList.map(buddy =>
              <tr key={buddy.id}>
                <td>{buddy.name}</td>
                { this.props.buddyListFilter === BuddyFilter.CLOSE_BUDDIES && <td>{buddy.closeness}</td> }
                <td>{buddy.balance}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  buddyList: Selectors.getBuddyList(state),
  closeBuddyList: Selectors.getCloseBuddyList(state),
  buddyListFilter: state.buddyListFilter
})

export default connect(mapStateToProps)(BuddyList);