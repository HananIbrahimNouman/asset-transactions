import React, { Component } from 'react';

const Transaction = props => (
  <tr>
    <td>{props.transaction.hash.slice(0,10)}</td>
    <td>{props.transaction.blockNumber}</td>
    <td>{props.transaction.from.slice(0,10)}</td>
    <td>{props.transaction.to.slice(0,10)}</td>
    <td>{props.transaction.value}</td>
    <td></td>
  </tr>
)

export default class TransactionsList extends Component {

  //componentDidMount shouldve been built, to call fetch txs instead of passing them as props with a state management like rematch to populate addresses.
  //hashes should show that a user can see the long hash

  transactionList() {


    return this.props && this.props.location && this.props.location.state && this.props.location.state.allTransactions.map(transaction => {
      return <Transaction transaction={transaction}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>Logged transactions</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Hash</th>
              <th>BlockNumber</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            { this.transactionList() }
          </tbody>
        </table>
      </div>
    )
  }
}