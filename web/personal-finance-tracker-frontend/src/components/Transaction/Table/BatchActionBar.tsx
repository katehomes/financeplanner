import '../../../css/batch-action-bar.css'
import React, { useState } from 'react';
import CategorySelector from '../../Category/CategorySelector';
import TagSelector from '../../Tag/TagSelector';
import { Tag } from '../../../types/tag';


type Props = {
    selectedIds: Set<number>;
    handleAddTagsToSelected: (tags: Tag[]) => void;
    handleRemoveTagsFromSelected: (tags: Tag[]) => void;
    handleMassSetCategory: (categoryId?: number | null) => void;
    setConfirmDeleteOpen: (bool: boolean) => void;
};

const BatchActionBar: React.FC<Props> = ({ 
    selectedIds, 
    handleAddTagsToSelected, 
    handleRemoveTagsFromSelected,
    handleMassSetCategory,
    setConfirmDeleteOpen }) => {
  const [massEditTags, setMassEditTags] = useState<Tag[]>([]);
  const [massEditCategoryId, setMassEditCategoryId] = useState<number | null>(null);
  const [massEditAction, setMassEditAction] = useState<string>('');
        
    return (
        <div className='batch-action-bar'>
              <p>{selectedIds.size} transaction(s) selected</p>

              <select
                name="massEditAction"
                id="massEditActionSelect"
                className='bab-select'
                value={massEditAction}
                onChange={(e) => setMassEditAction(e.target.value)}
              >
                <option value="" disabled hidden>Choose here</option>
                <optgroup label="Tag" >
                    <option value="add-tag">Add Tag(s)</option>
                    <option value="remove-tag">Remove Tag(s)</option>
                </optgroup>
                <optgroup label="Category" >
                    <option value="category">Set Category</option>
                </optgroup>
                <optgroup label="Delete" >
                    <option value="delete">Delete Transaction(s)</option>
                </optgroup>
              </select>

              {massEditAction === 'add-tag' && (
                <>
                  <TagSelector value={massEditTags} onChange={(tags) => setMassEditTags(tags)} />
                  <button className='bab-button' onClick={() => handleAddTagsToSelected(massEditTags)}>Apply</button>
                </>
              )}

              {massEditAction === 'remove-tag' && (
                <>
                  <TagSelector value={massEditTags} onChange={(tags) => setMassEditTags(tags)} />
                  <button className='bab-button' onClick={() => handleRemoveTagsFromSelected(massEditTags)}>Apply</button>
                </>
              )}

              {massEditAction === 'category' && (
                <>
                  <CategorySelector value={massEditCategoryId} onChange={setMassEditCategoryId} />
                  <button className='bab-button' onClick={() => handleMassSetCategory(massEditCategoryId)}>Apply</button>
                </>
              )}

              {massEditAction === 'delete' && (
                <>
                  <br/>
                  <button
                    className='delete-button bab-button' 
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    Delete Selected ({selectedIds.size})
                  </button>
                </>
              )}

            </div>
    );
};

export default BatchActionBar;
