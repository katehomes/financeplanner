import React from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;


export const getTransactions = () => axios.get(`http://localhost:5108/api/transaction`);



export default class TransactionList extends React.Component {
  state = {
    transactions: []
  }

  componentDidMount() {
    axios.get(`${API_BASE}/api/transaction`)
      .then(res => {
        const transactions = res.data;
        console.log("trans", transactions);
        this.setState({ transactions });
      })
  }

  render() {
    return (
      <ul>
        {
          this.state.transactions
            .map(transaction =>
              <li key={transaction.id}>{transaction.id} - {transaction.amount} - {transaction.date}</li>
            )
        }
      </ul>
    )
  }
}