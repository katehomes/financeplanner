import React from 'react';
import { Transaction } from '../../../types/transaction';
import TagChipList from '../../Tag/TagChipList';
import TxTableRow from '../Table/TxTableRow';
import TxTableEditRow from '../Table/TxTableEditRow';
import { Category } from '../../../types/category';
import { Tag } from '../../../types/tag';

interface Props {
  transactions: Transaction[];
  selectedIds: Set<number>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  currentlyEditingId: number | null;
  handleEdit: (tx: Transaction) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: (tx: Transaction) => void;
  handleCreateCategory: (name: string) => Promise<Category>;
  categories: Category[];
  handleCreateTag: (name: string) => Promise<Tag>;
  tags: Tag[];
}

const TxImpTable: React.FC<Props> = ({ 
    transactions, selectedIds, setSelectedIds, currentlyEditingId,
    handleEdit, handleCancelEdit, handleSaveEdit, handleCreateCategory,
    categories, handleCreateTag, tags
}) => {
  return (
    <table className="import-table">
      <thead className="import-header-sticky">
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
                  setSelectedIds(new Set(transactions.map((tx, idx) => tx.id!)));
                } else {
                  setSelectedIds(new Set());
                }
              }}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, idx) => {
            if(currentlyEditingId === tx.id ){
                return (
                    <TxTableEditRow
                        index={idx + 1}
                        key={`edit-${tx.id}`}
                        transaction={tx}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        onCreateCategory={handleCreateCategory}
                        initCategories={categories}
                        onCreateTag={handleCreateTag}
                        initTags={tags}
                    />
                );
            } else { 
                return (
                    <TxTableRow
                    key={`row-${tx.id}`}
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
                );
            }
          
        })}

        {/* {isAdding && (
          <TxTableAddRow
            onCancel={handleCancelNew}
            onSave={handleSaveNew}
          />
        )} */}
      </tbody>
    </table>
  );
};

export default TxImpTable;