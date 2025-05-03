import '../../css/transaction-table.css';
import React, { useState } from 'react';
import axios from 'axios';
import { importCSVPreview, importCSVConfirm } from "../../services/transactionService"
import { Transaction } from '../../types/transaction';


import TagChipList from '../Tag/TagChipList';
type PreviewTransaction = {
  date: string;
  amount: number;
  categoryName: string;
  description: string;
};

const TransactionImport: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<PreviewTransaction[]>([]);
    const [transactionsToImport, setTransactionsToImport] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [imported, setImported] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

        const importedTransactions : Transaction[] = previewData.map( imported =>  {
            return {
                amount: imported.amount,
                date: imported.date,
                description: imported.description,
                category: {
                    name: imported.categoryName
                }
            };
        });
        console.log("prev", previewData);
        console.log("imported trans", importedTransactions);
        setTransactionsToImport(importedTransactions);
    } catch (err: any) {
        setError(err.response?.data || 'Failed to preview file.');
    } finally {
        setLoading(false);
    }
};

  const handleClickImport = async () => {
    if (previewData.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      importCSVConfirm(transactionsToImport);
      setImported(true);
      setPreviewData([]);
      setTransactionsToImport([]);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to import transactions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Import Transactions</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleClickPreview} disabled={!file || loading}>
          Preview
        </button>
        <button onClick={handleClickImport} disabled={previewData.length === 0 || loading}>
          Import
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imported && <p style={{ color: 'green' }}>Transactions imported successfully!</p>}

      {transactionsToImport.length > 0 && (

        <table className="transaction-table">
          <thead className='transaction-header-sticky'>
            <tr>
                <th></th>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Actions</th>
                <th>
                    <input
                    type="checkbox"
                    checked={selectedIds.size === transactionsToImport.length && transactionsToImport.length > 0}
                    onChange={(e) => {
                        if (e.target.checked) {
                        setSelectedIds(new Set(transactionsToImport.map(tx => tx.id!)));
                        } else {
                        setSelectedIds(new Set());
                        }
                    }}
                    />
                </th>
            </tr>
          </thead>
          <tbody>
            {transactionsToImport.map((tx, idx) => (
              <tr key={tx.id}>
                <th>{idx}</th>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>${tx.amount.toFixed(2)}</td>
                <td>{tx.description || '-'}</td>
                <td>{tx.category?.name || '-'}</td>
                <td>
                    <TagChipList tags={tx.tags} />
                </td>
                <td>
                    <button /*onClick={() => handleEdit(tx)}*/>Edit</button>
                </td>
                <td>
                    <input
                    type="checkbox"
                    checked={selectedIds.has(tx.id!)}
                    onChange={() => {/*
                        setSelectedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(tx.id!)) next.delete(tx.id!);
                        else next.add(tx.id!);
                        return next;
                        });*/
                    }}
                    />
                </td>

                </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionImport;
