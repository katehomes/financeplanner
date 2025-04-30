import React, { useEffect, useState } from 'react';
import { Transaction, NewTransaction } from '../types/transaction';
import { fetchTransactions, addTransaction, updateTransaction } from '../services/transactionService';

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
  const [currentlyEditingId, setCurrentlyEditingId] = useState<number | null>(null);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [rawEditAmount, setRawEditAmount] = useState<string | null>(null);
  const [rawNewAmount, setRawNewAmount] = useState<string | null>(null);


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

  const handleCancelNew = () => {
    setIsAdding(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseCurrency(value) || 0 : value,
    }));
  };

  const isValidTransaction = (tx: Transaction): boolean => {
    return tx.amount > 0 && tx.date.trim() !== '';
  };

  const handleSaveNew = async () => {
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

  const handleEdit = (tx: Transaction) => {
    setCurrentlyEditingId(tx.id!);
    setEditTransaction({ ...tx });
  };

  const handleCancelEdit = () => {
    setCurrentlyEditingId(null);
    setEditTransaction(null);
  };

  const handleSaveEdit = async () => {
    if (!editTransaction || !isValidTransaction(editTransaction)) return;

    const updated = await updateTransaction(editTransaction.id!, editTransaction);
    setTransactions(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    );

    setCurrentlyEditingId(null);
    setEditTransaction(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setEditTransaction(prev => {
      if (!prev) return prev;
  
      return {
        ...prev,
        [name]: name === 'amount' ? parseCurrency(value) || 0 : value,
      };
    });
  };

  const formatDateForInput = (dateStr: string) => {
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  
  const parseCurrency = (value: string): number => {
    const numeric = value.replace(/[^0-9.-]+/g, ''); // Remove $ and commas
    return parseFloat(numeric) || 0;
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
          {transactions.map(tx =>
            currentlyEditingId === tx.id ? (
              <tr key={tx.id}>
                <td>
                  <input
                    type="text"
                    name="amount"
                    value={rawEditAmount ?? formatCurrency(editTransaction!.amount)}
                    onFocus={() => setRawEditAmount(editTransaction!.amount.toString())}
                    onChange={e => {
                      setRawEditAmount(e.target.value);
                      const parsed = parseCurrency(e.target.value);
                      setEditTransaction(prev => prev ? { ...prev, amount: parsed } : prev);
                    }}
                    onBlur={() => setRawEditAmount(null)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={formatDateForInput(editTransaction!.date)}
                    onChange={handleEditInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={editTransaction!.description || ''}
                    onChange={handleEditInputChange}
                  />
                </td>
                <td>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!isValidTransaction(editTransaction!)}
                  >
                    Save
                  </button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={tx.id}>
                <td>${tx.amount.toFixed(2)}</td>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(tx)}>Edit</button>
                </td>
              </tr>
            )
          )}

          {isAdding && (
            <tr>
              <td>
                <input
                 type="text"
                 name="amount"
                 value={rawNewAmount ?? formatCurrency(newTransaction.amount)}
                 onFocus={() => setRawNewAmount(newTransaction.amount.toString())}
                 onChange={e => {
                   setRawNewAmount(e.target.value);
                   const parsed = parseCurrency(e.target.value);
                   setNewTransaction(prev => ({ ...prev, amount: parsed }));
                 }}
                 onBlur={() => setRawNewAmount(null)}
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
                  onClick={handleSaveNew}
                  disabled={!isValidTransaction(newTransaction)}
                >
                  Save
                </button>
                <button onClick={handleCancelNew}>Cancel</button>
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
