import React, { useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';
import { Tag } from '../types/tag';
import { fetchTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  addTagsToTransactions,
  setCategoryForTransactions } from '../services/transactionService';
import CategorySelector from './Category/CategorySelector';
import TagSelector from './Tag/TagSelector';
import TagChipList from './Tag/TagChipList';
import '../css/transaction-table.css'
import { Category } from '../types/category';

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortBy, setSortBy] = useState<keyof Transaction | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [massEditTags, setMassEditTags] = useState<Tag[]>([]);
  const [massEditCategoryId, setMassEditCategoryId] = useState<number | null>(null);
  const [massEditAction, setMassEditAction] = useState<string>('');

  
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

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (confirmDeleteOpen) {
      const proceed = window.confirm(
        `Are you sure you want to delete ${selectedIds.size} transaction(s)? This action cannot be undone.`
      );
      if (proceed) {
        handleConfirmDelete();
      }
      setConfirmDeleteOpen(false);
    }
  }, [confirmDeleteOpen]);

  /* Sorting Functions */
  
  const handleSort = (field: keyof Transaction) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc); // toggle direction
    } else {
      setSortBy(field);
      setSortAsc(true); // default to ascending on first click
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.description?.toLowerCase().includes(search.toLowerCase())
  );
  

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortBy) return 0;
  
    const valA = a[sortBy];
    const valB = b[sortBy];
  
    if (valA == null) return 1;
    if (valB == null) return -1;
  
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
  
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
  
  /* Add New Functions */
  
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

  const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseCurrency(value) || 0 : value,
    }));
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

  /* Edit Functions */
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

  /* Helper Functions */
  
  const isValidTransaction = (tx: Transaction): boolean => {
    return tx.amount > 0 && tx.date.trim() !== '';
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

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => deleteTransaction(id))
      );
      setTransactions(prev => prev.filter(tx => !selectedIds.has(tx.id!)));
      setSelectedIds(new Set());
    } catch (err) {
      alert("Failed to delete one or more transactions.");
      console.error(err);
    }
  };


  /* Mass Edit Functions */
  const handleAddTagsToSelected = async (tags: Tag[]) => {
    try {
      await addTagsToTransactions(Array.from(selectedIds), tags.map(tag => tag.id!));
      // optionally: reload transactions or update local state
      alert('Tags added!');
    } catch (err) {
      console.error(err);
      alert('Failed to add tags.');
    }
  };
  
  
  const handleMassSetCategory = async (categoryId?: number | null) => {
    try {
      await setCategoryForTransactions(Array.from(selectedIds), categoryId);
      await loadTransactions();
      setMassEditCategoryId(null);
    } catch (err) {
      console.error(err);
    }
  };
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="table-container">
        <div className='testing'>
          <input
            type="text"
            placeholder="Search by description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
          />
          {selectedIds.size > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
              <p>{selectedIds.size} transaction(s) selected</p>

              <select
                name="massEditAction"
                id="massEditActionSelect"
                value={massEditAction}
                onChange={(e) => setMassEditAction(e.target.value)}
              >
                <option value="" disabled hidden>Choose here</option>
                <option value="add-tag">Add Tag(s)</option>
                <option value="remove-tag">Remove Tag(s)</option>
                <option value="category">Set Category</option>
                <option value="delete">Delete Transaction(s)</option>
              </select>

              {massEditAction === 'add-tag' && (
                <>
                  <p>Add Tag(s):</p>
                  <TagSelector value={massEditTags} onChange={(tags) => setMassEditTags(tags)} />
                  <button onClick={() => handleAddTagsToSelected(massEditTags)}>Apply</button>
                </>
              )}

              {/* {massEditAction === 'remove-tag' && (
                <>
                  <p>Remove Tag(s):</p>
                  <TagSelector value={massEditTags} onChange={massEditTags} />
                  <button onClick={() => handleRemoveTagsFromSelected(massEditTags)}>Apply</button>
                </>
              )} */}

              {massEditAction === 'category' && (
                <>
                  <p>Set Category:</p>
                  <CategorySelector value={massEditCategoryId} onChange={setMassEditCategoryId} />
                  <button onClick={() => handleMassSetCategory(massEditCategoryId)}>Apply</button>
                </>
              )}

              {/* {massEditAction === 'delete' && (
                <>
                  <p>Are you sure you want to delete {selectedIds.length} transaction(s)?</p>
                  <button onClick={handleDeleteSelected} style={{ color: 'red' }}>
                    Confirm Delete
                  </button>
                </>
              )} */}

            </div>
          )}

        </div>
        
        <table className="transaction-table">
          <thead className='transaction-header-sticky'>
            <tr>
            <th onClick={() => handleSort('date')}>Date {sortBy === 'date' && (sortAsc ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('amount')}>Amount {sortBy === 'amount' && (sortAsc ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('description')}>Description {sortBy === 'description' && (sortAsc ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('categoryId')}>Category {sortBy === 'categoryId' && (sortAsc ? '↑' : '↓')}</th>
            <th>Tags</th>
            <th>Actions</th>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.size === transactions.length && transactions.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(sortedTransactions.map(tx => tx.id!)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(tx =>
              currentlyEditingId === tx.id ? (
                <tr key={tx.id}>
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
                      type="text"
                      name="description"
                      value={editTransaction!.description || ''}
                      onChange={handleEditInputChange}
                    />
                  </td>
                  <td>
                    <CategorySelector
                      value={editTransaction?.categoryId ?? null}
                      onChange={(id) =>
                        setEditTransaction(prev => {
                          if (!prev) return prev;
                          return { ...prev, categoryId: id };
                        })
                      }
                    />
                  </td>
                  <td>
                    <TagSelector
                      value={editTransaction?.tags ?? []}
                      onChange={(tags) =>
                        setEditTransaction(prev => {
                          if (!prev) return prev;
                          return { ...prev, tags};
                        })
                      }
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
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                  <td>{tx.description || '-'}</td>
                  <td>{tx.category?.name || '-'}</td>
                  <td>
                    <TagChipList tags={tx.tags} />
                  </td>
                  <td>
                    <button onClick={() => handleEdit(tx)}>Edit</button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tx.id!)}
                      onChange={() => {
                        setSelectedIds(prev => {
                          const next = new Set(prev);
                          if (next.has(tx.id!)) next.delete(tx.id!);
                          else next.add(tx.id!);
                          return next;
                        });
                      }}
                    />
                  </td>

                </tr>
              )
            )}

            {isAdding && (
              <tr>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={newTransaction.date}
                    onChange={handleNewInputChange}
                    required
                  />
                </td>
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
                    type="text"
                    name="description"
                    value={newTransaction.description}
                    onChange={handleNewInputChange}
                  />
                </td>
                <td>
                  <CategorySelector
                    value={newTransaction.categoryId ?? null}
                    onChange={(id) => setNewTransaction(prev => ({ ...prev, categoryId: id }))}
                  />
                </td>
                <td>
                  <TagSelector
                    value={newTransaction?.tags ?? []}
                    onChange={(tags) =>
                      setNewTransaction(prev => {
                        if (!prev) return prev;
                        return { ...prev, tags};
                      })
                    }
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

        {selectedIds.size > 0 && (
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            style={{ marginTop: '1rem', background: 'red', color: 'white' }}
          >
            Delete Selected ({selectedIds.size})
          </button>
        )}

      </div>
    </div>
  );
};

export default TransactionTable;
