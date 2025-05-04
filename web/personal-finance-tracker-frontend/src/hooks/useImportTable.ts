import { useEffect, useState } from 'react';
import { 
    importCSVPreview, 
    importCSVConfirm,
    isValidTransaction
} from '../services/transactionService';
import { Transaction } from '../types/transaction';
import { Tag } from '../types/tag';

export type PreviewTransaction = {
  date: string;
  amount: number;
  categoryName: string;
  description: string;
};

export const useImportTable = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewTransaction[]>([]);
  const [transactionsToImport, setTransactionsToImport] = useState<Transaction[]>([]);
 
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState(false);
  const [error, setError] = useState<string |null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');

  const [currentlyEditingId, setCurrentlyEditingId] = useState<number | null>(null);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  const [sortBy, setSortBy] = useState<keyof Transaction | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  /* Use Effects */

  useEffect(() => {
    if (confirmDeleteOpen) {
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedIds.size} transaction(s)?`);
      if (confirmed) handleConfirmDelete();
      setConfirmDeleteOpen(false);
    }
  }, [confirmDeleteOpen]);


  /* Import / Preview */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImported(false);
    setError(null);
    setFile(e.target.files?.[0] || null);
    setPreviewData([]);
  };

  const handleClickPreview = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await importCSVPreview(formData);
      setPreviewData(res);

      const importedTransactions: Transaction[] = res.map((imported: PreviewTransaction, idx: number) => ({
        id: idx + 1,
        amount: imported.amount,
        date: imported.date,
        description: imported.description,
        category: {
          name: imported.categoryName
        },
        tags: []
      }));
      

      console.log("imp", importedTransactions);
      

      setTransactionsToImport(importedTransactions);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to preview file.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickImport = async () => {
    if (transactionsToImport.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      await importCSVConfirm(transactionsToImport);
      setImported(true);
      setPreviewData([]);
      setTransactionsToImport([]);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to import transactions.');
    } finally {
      setLoading(false);
    }
  };

  /* Search */

  const filteredTransactions = transactionsToImport.filter(tx =>
    tx.description?.toLowerCase().includes(search.toLowerCase())
  );

  /* Sort */
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

  /*Edit Actions*/

  const handleEdit = (tx: Transaction) => {
    setCurrentlyEditingId(tx.id!);
    setEditTransaction({ ...tx });
  };
  
const handleCancelEdit = () => {
    setCurrentlyEditingId(null);
    setEditTransaction(null);
};

const handleSaveEdit = async (updated: Transaction) => {
    if (!editTransaction || !isValidTransaction(updated)) return;
    setTransactionsToImport(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    setCurrentlyEditingId(null);
    setEditTransaction(null);
};

/* Add New */
const handleAddClick = () => setIsAdding(true);
const handleCancelNew = () => setIsAdding(false);

const handleSaveNew = async (saved: Transaction) => {
  if (!isValidTransaction(saved)) return;
  try {
    setTransactionsToImport([...transactionsToImport, saved]);
    setIsAdding(false);
  } catch (err) {
    alert('Failed to save transaction.');
    console.error(err);
  }
};

/* Delete */
  const handleConfirmDelete = async () => {
    try {
      // await Promise.all(Array.from(selectedIds).map(id => deleteTransaction(id)));
      alert("await Promise.all(Array.from(selectedIds).map(id => deleteTransaction(id)));");
      setTransactionsToImport(prev => prev.filter(tx => !selectedIds.has(tx.id!)));
      setSelectedIds(new Set());
    } catch (err) {
      alert("Failed to delete transaction(s).");
      console.error(err);
    }
  };

  /* Mass Set */

  const handleAddTagsToSelected = async (tags: Tag[]) => {
    try {
      // await batchAddTagsToTransactions(Array.from(selectedIds), tags.map(tag => tag.id!));
      // await loadTransactions();
    } catch (err) {
      alert("Failed to add tags.");
      console.error(err);
    }
  };

  const handleRemoveTagsFromSelected = async (tags: Tag[]) => {
    try {
      // await batchRemoveTagsFromTransactions(Array.from(selectedIds), tags.map(tag => tag.id!));
      // await loadTransactions();
    } catch (err) {
      alert("Failed to remove tags.");
      console.error(err);
    }
  };

  const handleMassSetCategory = async (categoryId?: number | null) => {
    try {
      // await batchSetCategoryForTransactions(Array.from(selectedIds), categoryId);
      // await loadTransactions();
    } catch (err) {
      alert("Failed to set category.");
      console.error(err);
    }
  };

  return {
    state: {
      file,
      previewData,
      transactionsToImport,
      imported,
      sortBy,
      sortAsc,
      loading,
      error,
      isAdding,
      currentlyEditingId,
      selectedIds,
      search,
    },
    sortedTransactions,
    handlers: {
      handleFileChange,
      handleClickPreview,
      handleClickImport,
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
    }
  };
};

export default useImportTable;