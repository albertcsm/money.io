import React, { Component } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux'

class BuddyList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subList: 'closeBuddies'
    }
  }

  setSubList(subListName) {
    this.setState({ subList: subListName });
  }

  render() {
    return (
      <div>
        <div className="MoneyIO-Nav-container">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'closeBuddies'} onClick={() => this.setSubList('closeBuddies')}>Close buddies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'topDebtors'} onClick={() => this.setSubList('topDebtors')}>Top debtors</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={this.state.subList === 'topCreditors'} onClick={() => this.setSubList('topCreditors')}>Top creditors</NavLink>
            </NavItem>
          </Nav>
        </div>
        <table className="table">
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {this.props.buddies.map(buddy =>
              <tr key={buddy.id}>
                <td>{buddy.name}</td>
                <td>{buddy.balance}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

function getBuddyList(groupUsers, users) {
  return Object.keys(groupUsers)
    .map(userId => ({ id: userId, ...users[userId], ...groupUsers[userId] }));
}

const mapStateToProps = state => ({
  buddies: getBuddyList(state.groupUsers, state.users)
})

export default connect(mapStateToProps)(BuddyList);