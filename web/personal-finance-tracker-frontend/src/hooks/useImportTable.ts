import { useState } from 'react';
import { importCSVPreview, importCSVConfirm } from '../services/transactionService';
import { Transaction } from '../types/transaction';

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

      const importedTransactions: Transaction[] = res.map((imported: { amount: any; date: any; description: any; categoryName: any; }) => ({
        amount: imported.amount,
        date: imported.date,
        description: imported.description,
        category: {
          name: imported.categoryName
        }
      }));
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

  return {
    state: {
      file,
      previewData,
      transactionsToImport,
      loading,
      imported,
      error,
      selectedIds
    },
    handlers: {
      handleFileChange,
      handleClickPreview,
      handleClickImport,
      setSelectedIds
    }
  };
};

export default useImportTable;