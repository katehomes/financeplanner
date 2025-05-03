import '../../../css/transaction-table.css';
import React, { useEffect, useState } from 'react';
import { Transaction } from '../../../types/transaction';
import { Tag } from '../../../types/tag';
import { fetchTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  batchAddTagsToTransactions,
  batchRemoveTagsFromTransactions,
  batchSetCategoryForTransactions, isValidTransaction } from '../../../services/transactionService';
import CategorySelector from '../../Category/CategorySelector';
import TagSelector from '../../Tag/TagSelector';
import TagChipList from '../../Tag/TagChipList';
import {formatDateForInput, formatCurrency, parseCurrency} from "../../../services/helperClass";

import TransactionRow from './TxTableRow';
import TransactionEditRow from './TxTableEditRow';
import TxTableAddRow from './TxTableAddRow';

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
  };

  const handleCancelNew = () => {
    setIsAdding(false);
  };

  const handleSaveNew = async (tx: Transaction) => {
    if (!isValidTransaction(tx)) return;

    try {
      const saved = await addTransaction(tx);
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

  const handleSaveEdit = async (tx: Transaction) => {

    console.log("editTransaction", tx);
    if (!editTransaction || !isValidTransaction(tx)) return;

    const updated = await updateTransaction(tx.id!, tx);
    setTransactions(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    );

    setCurrentlyEditingId(null);
    setEditTransaction(null);
  };

  /* Helper Functions */

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
      await batchAddTagsToTransactions(Array.from(selectedIds), tags.map(tag => tag.id!));
      await loadTransactions();
      setMassEditTags([]);
    } catch (err) {
      console.error(err);
      alert('Failed to add tags.');
    }
  };

  const handleRemoveTagsFromSelected = async (tags: Tag[]) => {
    try {
      await batchRemoveTagsFromTransactions(Array.from(selectedIds), tags.map(tag => tag.id!));
      await loadTransactions();
      setMassEditTags([]);
    } catch (err) {
      console.error(err);
      alert('Failed to remove tags.');
    }
  };
  
  const handleMassSetCategory = async (categoryId?: number | null) => {
    try {
      await batchSetCategoryForTransactions(Array.from(selectedIds), categoryId);
      await loadTransactions();
      setMassEditCategoryId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to set category.');
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

              {massEditAction === 'remove-tag' && (
                <>
                  <p>Remove Tag(s):</p>
                  <TagSelector value={massEditTags} onChange={(tags) => setMassEditTags(tags)} />
                  <button onClick={() => handleRemoveTagsFromSelected(massEditTags)}>Apply</button>
                </>
              )}

              {massEditAction === 'category' && (
                <>
                  <p>Set Category:</p>
                  <CategorySelector value={massEditCategoryId} onChange={setMassEditCategoryId} />
                  <button onClick={() => handleMassSetCategory(massEditCategoryId)}>Apply</button>
                </>
              )}

              {massEditAction === 'delete' && (
                <>
                  <br/>
                  <button
                    onClick={() => setConfirmDeleteOpen(true)}
                    style={{ marginTop: '1rem', background: 'red', color: 'white' }}
                  >
                    Delete Selected ({selectedIds.size})
                  </button>
                </>
              )}

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
                <TransactionEditRow 
                  transaction = {tx}
                  onSave = {handleSaveEdit}
                  onCancel = {handleCancelEdit}
                />
              ) : (
                <TransactionRow 
                    transaction = {tx}
                    isSelected = {selectedIds.has(tx.id!)}
                    onSelect = {() => {
                      setSelectedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(tx.id!)) next.delete(tx.id!);
                        else next.add(tx.id!);
                        return next;
                      });
                    }}
                    onEdit={() => handleEdit(tx)}
                />
              )
            )}

            {isAdding && (
              <TxTableAddRow 
                onCancel={handleCancelNew}
                onSave={handleSaveNew}
              />
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
