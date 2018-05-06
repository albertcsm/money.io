import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchReceipts, setSubList } from '../actions/receiptActions';

class ReceiptList extends Component {

  componentWillMount() {
    this.props.fetchReceipts();
  }

  render() {
    let rows = this.props.receipts.map((receipt, index) => (
      <tr key={index}>
        <td>{receipt.time}</td>
        <td>{receipt.restaurant}</td>
        <td>{receipt.paidBy}</td>
        <td>Someone...</td>
        <td>689.4</td>
      </tr>
    ));
    return (
      <div>
        <div className="MoneyIO-Nav-container">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active={this.props.subList === 'paidByMe'} onClick={() => this.props.setSubList('paidByMe')}>Paid by me</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.subList === 'involved'} onClick={() => this.props.setSubList('involved')}>I was involved</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.props.subList === 'all'} onClick={() => this.props.setSubList('all')}>All</NavLink>
            </NavItem>
          </Nav>
        </div>
        <table className="table">
          <thead className="thead-default">
            <tr>
              <th>Date</th>
              <th>Restaurant</th>
              <th>Paid by</th>
              <th>Involved</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  receipts : state.receipts.items,
  subList: state.receipts.subList
});

const mapDispatcherToProps = dispatch => ({
  fetchReceipts : () => dispatch(fetchReceipts()),
  setSubList: (subList) => dispatch(setSubList(subList))
});

export default connect(mapStateToProps, mapDispatcherToProps)(ReceiptList);
