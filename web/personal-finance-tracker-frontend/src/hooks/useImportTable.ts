import { useEffect, useState } from 'react';
import { 
    importCSVPreview, 
    importCSVConfirm,
    isValidTransaction
} from '../services/transactionService';
import { Transaction } from '../types/transaction';
import { Tag } from '../types/tag';
import { Category } from '../types/category';
import { TransactionImportPreview } from '../types/transactionImportPreview';

import { fetchCategorys } from '../services/categoryService';

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [newImportedCategories, setNewImportedCategories] = useState<Category[]>([]);

  /* Use Effects */

  useEffect(() => {
    if (confirmDeleteOpen) {
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedIds.size} transaction(s)?`);
      if (confirmed) handleConfirmDelete();
      setConfirmDeleteOpen(false);
    }
  }, [confirmDeleteOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategorys();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);


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
      const res : TransactionImportPreview = await importCSVPreview(formData);
      console.log(res);
      setPreviewData(res.rows);
      setNewImportedCategories(res.importedCategories);

      const importedTransactions: Transaction[] = res.rows.map((imported: PreviewTransaction, idx: number) => ({
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

const handleSaveEdit = async (tx: Transaction) => {
    if (!editTransaction || !isValidTransaction(tx)) return;

    const cat = categories.find(cg => (cg.id === tx.categoryId));

    const updated: Transaction = {...tx, category: cat};
    
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
      //alert("await Promise.all(Array.from(selectedIds).map(id => deleteTransaction(id)));");
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
      setTransactionsToImport(prev =>
        prev.map(tx =>
          selectedIds.has(tx.id!)
            ? {
                ...tx,
                tags: [...tx.tags!.filter(tag => !tags.some(t => t.id === tag.id)), ...tags]
              }
            : tx
        )
      );
    } catch (err) {
      alert("Failed to add tags.");
      console.error(err);
    }
  };
  
  const handleRemoveTagsFromSelected = async (tags: Tag[]) => {
    try {
      setTransactionsToImport(prev =>
        prev.map(tx =>
          selectedIds.has(tx.id!)
            ? {
                ...tx,
                tags: tx.tags!.filter(tag => !tags.some(t => t.id === tag.id))
              }
            : tx
        )
      );
    } catch (err) {
      alert("Failed to remove tags.");
      console.error(err);
    }
  };
  
  const handleMassSetCategory = async (categoryId?: number | null) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      console.log("cat", category);
      console.log("cats", categories);
  
  
      setTransactionsToImport(prev =>
        prev.map(tx => {
          if (!selectedIds.has(tx.id!)) return tx;
  
          return {
            ...tx,
            categoryId: categoryId ?? null,
            category: categoryId ? category ?? { id: categoryId, name: '' } : undefined
          };
        })
      );
    } catch (err) {
      alert("Failed to set category.");
      console.error(err);
    }
  };   

  /* Category creation */

  const handleCreateCategory = (trimmedName: string) => {
    const newCat: Category = { name: trimmedName, id: 999 + newImportedCategories.length };
    setNewImportedCategories(prev => [...prev, newCat]);

    return newCat;
  }

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
      newImportedCategories,
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
      handleCreateCategory,
    }
  };
};

export default useImportTable;