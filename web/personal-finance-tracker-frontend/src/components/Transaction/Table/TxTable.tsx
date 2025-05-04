// TransactionTable.tsx
import React from 'react';
import { Transaction } from '../../../types/transaction';
import { Tag } from '../../../types/tag';
import TxTableHeader from './TxTableHeader';
import TxTableRow from './TxTableRow';
import TxTableEditRow from './TxTableEditRow';
import TxTableAddRow from './TxTableAddRow';

type Props = {
  transactions: Transaction[];
  sortedTransactions: Transaction[];
  sortBy: keyof Transaction | null;
  sortAsc: boolean;
  setSortBy: (field: keyof Transaction) => void;
  setSortAsc: (asc: boolean) => void;
  selectedIds: Set<number>;
  setSelectedIds: (ids: Set<number>) => void;
  isAdding: boolean;
  handleCancelNew: () => void;
  handleSaveNew: (tx: Transaction) => void;
  currentlyEditingId: number | null;
  handleEdit: (tx: Transaction) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: (tx: Transaction) => void;
  handleAddClick: () => void; 
  setConfirmDeleteOpen: (bool: boolean) => void; 
};

const TransactionTable: React.FC<Props> = ({
  transactions,
  sortedTransactions,
  sortBy,
  sortAsc,
  setSortBy,
  setSortAsc,
  selectedIds,
  setSelectedIds,
  isAdding,
  handleCancelNew,
  handleSaveNew,
  currentlyEditingId,
  handleEdit,
  handleCancelEdit,
  handleSaveEdit,
  handleAddClick,
  setConfirmDeleteOpen,
}) => {
  return (
    <>
    <table className="transaction-table">
      <TxTableHeader
        sortBy={sortBy}
        sortAsc={sortAsc}
        setSortBy={setSortBy}
        setSortAsc={setSortAsc}
        transactions={transactions}
        sortedTransactions={sortedTransactions}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
      <tbody>
        {sortedTransactions.map((tx, idx) =>
          currentlyEditingId === tx.id ? (
            <TxTableEditRow
              index={idx + 1}
              key={'edit-${tx.id}'}
              transaction={tx}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <TxTableRow
              key={'row-${tx.id}'}
              index={idx + 1}
              transaction={tx}
              isSelected={selectedIds.has(tx.id!)}
              onSelect={() => {
                const next = new Set(selectedIds);
                next.has(tx.id!) ? next.delete(tx.id!) : next.add(tx.id!);
                setSelectedIds(next);
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
    </>
  );
};

export default TransactionTable;
