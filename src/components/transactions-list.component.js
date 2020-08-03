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

  transactionList() {
    console.log(this.props,"propssss")

    console.log(this.props.location,"location")

    return this.props && this.props.location && this.props.location.state && this.props.location.state.allTransactions.map(transaction => {
      console.log(transaction,"transaction")
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