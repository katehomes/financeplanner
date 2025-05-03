import React from 'react';
import SearchBar from '../../SearchBar';
import BatchActionBar from './BatchActionBar';
import { Tag } from '../../../types/tag';

type Props = {
    search: string;
    setSearch: (value: string) => void;
    selectedIds: Set<number>;
    handleAddTagsToSelected: (tags: Tag[]) => void;
    handleRemoveTagsFromSelected: (tags: Tag[]) => void;
    handleMassSetCategory: () => void;
    setConfirmDeleteOpen: (open: boolean) => void;
  };

const TxTableControls: React.FC<Props> = ({
    search,
    setSearch,
    selectedIds,
    handleAddTagsToSelected,
    handleRemoveTagsFromSelected,
    handleMassSetCategory,
    setConfirmDeleteOpen,
  }) => {
    return (
      <div className="table-controls">
        <SearchBar value={search} onChange={setSearch} placeholder="Search transactions..." />
        
        {selectedIds.size > 0 && (
            <BatchActionBar
            selectedIds={selectedIds}
            handleAddTagsToSelected={handleAddTagsToSelected}
            handleRemoveTagsFromSelected={handleRemoveTagsFromSelected}
            handleMassSetCategory={handleMassSetCategory}
            setConfirmDeleteOpen={setConfirmDeleteOpen}
            />
        )}
      </div>
    );
};

export default TxTableControls;
