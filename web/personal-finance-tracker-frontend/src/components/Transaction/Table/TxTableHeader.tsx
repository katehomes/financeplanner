import React from 'react';
import { Transaction } from '../../../types/transaction';

type Props = {
  sortBy: keyof Transaction | null;
  sortAsc: boolean;
  setSortBy: (field: keyof Transaction) => void;
  setSortAsc: (asc: boolean) => void;
  transactions: Transaction[];
  sortedTransactions: Transaction[];
  selectedIds: Set<number>;
  setSelectedIds: (ids: Set<number>) => void;
};

const TxTableHeader: React.FC<Props> = ({
  sortBy,
  sortAsc,
  setSortBy,
  setSortAsc,
  transactions,
  sortedTransactions,
  selectedIds,
  setSelectedIds,
}) => {
  const handleSort = (field: keyof Transaction) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <thead className='transaction-header-sticky'>
      <tr>
        <th onClick={() => handleSort('date')}>
          Date {sortBy === 'date' && (sortAsc ? '↑' : '↓')}
        </th>
        <th onClick={() => handleSort('amount')}>
          Amount {sortBy === 'amount' && (sortAsc ? '↑' : '↓')}
        </th>
        <th onClick={() => handleSort('description')}>
          Description {sortBy === 'description' && (sortAsc ? '↑' : '↓')}
        </th>
        <th onClick={() => handleSort('categoryId')}>
          Category {sortBy === 'categoryId' && (sortAsc ? '↑' : '↓')}
        </th>
        <th>Tags</th>
        <th>Actions</th>
        <th>
          <input
            type="checkbox"
            checked={
              selectedIds.size === transactions.length && transactions.length > 0
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedIds(new Set(sortedTransactions.map((tx) => tx.id!)));
              } else {
                setSelectedIds(new Set());
              }
            }}
          />
        </th>
      </tr>
    </thead>
  );
};

export default TxTableHeader;
