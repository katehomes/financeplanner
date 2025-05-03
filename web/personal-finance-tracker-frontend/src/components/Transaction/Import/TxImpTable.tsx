import React from 'react';
import { Transaction } from '../../../types/transaction';
import TagChipList from '../../Tag/TagChipList';

interface Props {
  transactions: Transaction[];
  selectedIds: Set<number>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const TxImpTable: React.FC<Props> = ({ transactions, selectedIds, setSelectedIds }) => {
  return (
    <table className="transaction-table">
      <thead className="transaction-header-sticky">
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Category</th>
          <th>Tags</th>
          <th>Actions</th>
          <th>
            <input
              type="checkbox"
              checked={selectedIds.size === transactions.length && transactions.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(new Set(transactions.map((tx, idx) => idx)));
                } else {
                  setSelectedIds(new Set());
                }
              }}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{new Date(tx.date).toLocaleDateString()}</td>
            <td>${tx.amount.toFixed(2)}</td>
            <td>{tx.description || '-'}</td>
            <td>{tx.category?.name || '-'}</td>
            <td><TagChipList tags={tx.tags} /></td>
            <td><button disabled>Edit</button></td>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.has(idx)}
                onChange={() => {
                  setSelectedIds((prev) => {
                    const copy = new Set(prev);
                    copy.has(idx) ? copy.delete(idx) : copy.add(idx);
                    return copy;
                  });
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TxImpTable;
