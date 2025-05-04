import { useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';
import { Tag } from '../types/tag';
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  batchAddTagsToTransactions,
  batchRemoveTagsFromTransactions,
  batchSetCategoryForTransactions,
  isValidTransaction
} from '../services/transactionService';

const useTransactionTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortBy, setSortBy] = useState<keyof Transaction | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentlyEditingId, setCurrentlyEditingId] = useState<number | null>(null);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [search, setSearch] = useState('');

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
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedIds.size} transaction(s)?`);
      if (confirmed) handleConfirmDelete();
      setConfirmDeleteOpen(false);
    }
  }, [confirmDeleteOpen]);

  const filteredTransactions = transactions.filter(tx =>
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

  /* Add New */
  const handleAddClick = () => setIsAdding(true);
  const handleCancelNew = () => setIsAdding(false);

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

  /* Edit */
  const handleEdit = (tx: Transaction) => {
    setCurrentlyEditingId(tx.id!);
    setEditTransaction({ ...tx });
  };

  const handleCancelEdit = () => {
    setCurrentlyEditingId(null);
    setEditTransaction(null);
  };

  const handleSaveEdit = async (tx: Transaction) => {
    if (!editTransaction || !isValidTransaction(tx)) return;
    const updated = await updateTransaction(tx.id!, tx);
    setTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    setCurrentlyEditingId(null);
    setEditTransaction(null);
  };

  /* Delete */
  const handleConfirmDelete = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteTransaction(id)));
      setTransactions(prev => prev.filter(tx => !selectedIds.has(tx.id!)));
      setSelectedIds(new Set());
    } catch (err) {
      alert("Failed to delete transaction(s).");
      console.error(err);
    }
  };

  /* Mass Set */

  const handleAddTagsToSelected = async (tags: Tag[]) => {
    try {
      await batchAddTagsToTransactions(Array.from(selectedIds), tags.map(tag => tag.id!));
      await loadTransactions();
    } catch (err) {
      alert("Failed to add tags.");
      console.error(err);
    }
  };

  const handleRemoveTagsFromSelected = async (tags: Tag[]) => {
    try {
      await batchRemoveTagsFromTransactions(Array.from(selectedIds), tags.map(tag => tag.id!));
      await loadTransactions();
    } catch (err) {
      alert("Failed to remove tags.");
      console.error(err);
    }
  };

  const handleMassSetCategory = async (categoryId?: number | null) => {
    try {
      await batchSetCategoryForTransactions(Array.from(selectedIds), categoryId);
      await loadTransactions();
    } catch (err) {
      alert("Failed to set category.");
      console.error(err);
    }
  };

  return {
    state: {
      transactions,
      sortBy,
      sortAsc,
      loading,
      error,
      isAdding,
      currentlyEditingId,
      editTransaction,
      selectedIds,
      confirmDeleteOpen,
      search,
    },
    sortedTransactions,
    actions: {
      setSortBy,
      setSortAsc,
      setSearch,
      setConfirmDeleteOpen,
      setSelectedIds,
      handleAddClick,
      handleCancelNew,
      handleSaveNew,
      handleEdit,
      handleCancelEdit,
      handleSaveEdit,
      handleAddTagsToSelected,
      handleRemoveTagsFromSelected,
      handleMassSetCategory,
    },
  };
};

export default useTransactionTable;
