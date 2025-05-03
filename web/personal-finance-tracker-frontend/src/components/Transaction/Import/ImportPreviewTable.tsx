import React from 'react';
import { Transaction } from '../../../types/transaction';
import TxTableHeader from '../Table/TxTableHeader';
import TxTableRow from '../Table/TxTableRow';

type Props = {
  previewTransactions: Transaction[];
};

const ImportPreviewTable: React.FC<Props> = ({ previewTransactions }) => {
  return (
    <div className="table-container">
      <h3>Preview Import</h3>
      <table className="transaction-table">
        <TxTableHeader
          sortBy={null}
          sortAsc={true}
          setSortBy={() => {}}
          setSortAsc={() => {}}
          transactions={previewTransactions}
          sortedTransactions={previewTransactions}
          selectedIds={new Set()}
          setSelectedIds={() => {}}
        />
        <tbody>
          {previewTransactions.map((tx, idx) => (
            <TxTableRow
              key={tx.id || idx}
              index={idx + 1}
              transaction={tx}
              isSelected={false}
              onSelect={() => {}}
              onEdit={() => {}}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportPreviewTable;
