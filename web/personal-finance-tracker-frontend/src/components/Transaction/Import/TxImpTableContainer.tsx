import React from 'react';
import useImportTable from '../../../hooks/useImportTable';
import TxImpTable from './TxImpTable';

const TransactionImportContainer: React.FC = () => {
  const {
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
      setSelectedIds,
      handleFileChange,
      handleClickPreview,
      handleClickImport
    }
  } = useImportTable();

  return (
    <div>
      <h2>Import Transactions</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
      />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleClickPreview} disabled={!file || loading}>
          Preview
        </button>
        <button
          onClick={handleClickImport}
          disabled={previewData.length === 0 || loading}
        >
          Import
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imported && <p style={{ color: 'green' }}>Transactions imported successfully!</p>}

      {transactionsToImport.length > 0 && (
        <TxImpTable
          transactions={transactionsToImport}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}
    </div>
  );
};

export default TransactionImportContainer;
