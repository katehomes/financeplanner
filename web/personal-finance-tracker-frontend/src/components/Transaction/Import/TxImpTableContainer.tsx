import '../../../css/import-table.css'
import React from 'react';
import useImportTable from '../../../hooks/useImportTable';
import TxImpTable from './TxImpTable';
import TxImpTableControls from './TxImpTableControls';

const TransactionImportContainer: React.FC = () => {
  const {
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
      categories,
      newImportedCategories
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
  } = useImportTable();

  return (
    <div>
      <div className='import-state'>
        <div className='import-instruct'>
          <h2>Import Transactions</h2>
          <br />
          <p>Select a .csv file.</p>
          <p>Preview the imported transactions and make any edits.</p>
          <p>Confirm and import transactions.</p>
          <br/>
          <div className='controls'>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
            />
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
        </div>
        <div className='import-property'>
          <span className='header'>New Categories ({newImportedCategories.length}):</span>
          <ul>
            {newImportedCategories.map((cg, idx) => (
              <li key={idx}>{cg.name}</li>
            ))}
          </ul>
          <span className='header'>New Tags (#{/*newImportedCategories.length*/}):</span>
          <ul>
            {/* {newImportedCategories.map((cg, idx) => (
              <li key={idx}>{cg.name}</li>
            ))} */}
          </ul>
        </div>

      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imported && <p style={{ color: 'green' }}>Transactions imported successfully!</p>}

      {transactionsToImport.length > 0 && (
        <div>
          <div className="table-container">
            <TxImpTableControls
              resultSize={sortedTransactions.length}
              totalResultSize={transactionsToImport.length}
              search={search}
              setSearch={setSearch}
              selectedIds={selectedIds}
              handleAddTagsToSelected={handleAddTagsToSelected}
              handleRemoveTagsFromSelected={handleRemoveTagsFromSelected}
              handleMassSetCategory={handleMassSetCategory}
              setConfirmDeleteOpen={setConfirmDeleteOpen}
            />
            <TxImpTable
              transactions={sortedTransactions}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              currentlyEditingId={currentlyEditingId}
              handleEdit={handleEdit}
              handleCancelEdit={handleCancelEdit}
              handleSaveEdit={handleSaveEdit}
              handleCreateCategory={handleCreateCategory}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionImportContainer;
