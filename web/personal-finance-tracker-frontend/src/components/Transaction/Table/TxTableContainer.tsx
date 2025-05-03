import '../../../css/transaction-table.css';
import React from 'react';
import useTransactionTable from '../../../hooks/useTransactionTable';

import TxTableHeader from './TxTableHeader';
import TxTableRow from './TxTableRow';
import TxTableEditRow from './TxTableEditRow';
import TxTableAddRow from './TxTableAddRow';
import TxTableControls from './TxTableControls';
import TxTable from "./TxTable"

const TxTableContainer: React.FC = () => {
  const {
    state: {
      transactions,
      sortBy,
      sortAsc,
      loading,
      error,
      isAdding,
      currentlyEditingId,
      selectedIds,
      search,
      confirmDeleteOpen,
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
  } = useTransactionTable();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
        <div className="table-container">
            <TxTableControls
                resultSize={sortedTransactions.length}
                search={search}
                setSearch={setSearch}
                selectedIds={selectedIds}
                handleAddTagsToSelected={handleAddTagsToSelected}
                handleRemoveTagsFromSelected={handleRemoveTagsFromSelected}
                handleMassSetCategory={handleMassSetCategory}
                setConfirmDeleteOpen={setConfirmDeleteOpen}
            />

            <TxTable
                transactions={transactions}
                sortedTransactions={sortedTransactions}
                sortBy={sortBy}
                sortAsc={sortAsc}
                setSortBy={setSortBy}
                setSortAsc={setSortAsc}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                isAdding={isAdding}
                handleCancelNew={handleCancelNew}
                handleSaveNew={handleSaveNew}
                currentlyEditingId={currentlyEditingId}
                handleEdit={handleEdit}
                handleCancelEdit={handleCancelEdit}
                handleSaveEdit={handleSaveEdit}
                handleAddClick={handleAddClick}
                setConfirmDeleteOpen={setConfirmDeleteOpen}
            />

        </div>
    </div>
  );
};

export default TxTableContainer;
