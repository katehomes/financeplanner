import React, { useEffect, useState } from 'react';
import { Transaction, NewTransaction } from '../types/transaction';
import { fetchTransactions, addTransaction } from '../services/transactionService';

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (err) {
        setError((err as Error).message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setNewTransaction({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const isValidTransaction = (tx: Transaction): boolean => {
    return tx.amount > 0 && tx.date.trim() !== '';
  };

  const handleSave = async () => {
    if (!isValidTransaction(newTransaction)) return;

    try {
      const saved = await addTransaction(newTransaction);
      setTransactions([...transactions, saved]);
      setIsAdding(false);
    } catch (err) {
      alert('Failed to save transaction.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>${tx.amount.toFixed(2)}</td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description || '-'}</td>
              <td></td>
            </tr>
          ))}

          {isAdding && (
            <tr>
              <td>
                $ <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  required
                  />
              </td>
              <td>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <button
                  onClick={handleSave}
                  disabled={!isValidTransaction(newTransaction)}
                >
                  Save
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isAdding && (
        <button style={{ marginTop: '1rem' }} onClick={handleAddClick}>
          + Add Transaction
        </button>
      )}
    </div>
  );
};

export default TransactionTable;
