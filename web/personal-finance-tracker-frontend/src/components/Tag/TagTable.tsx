import React, { useEffect, useState } from 'react';
import { Tag } from '../../types/tag';
import { fetchTags, 
  addTag, 
  updateTag, 
  deleteTag } from '../../services/tagService';
  import TagChip from "../Tag/TagChip"
import '../../css/tagtable.css'

const TagTable: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState<Tag>({
    name: ""
  });
  const [currentlyEditingId, setCurrentlyEditingId] = useState<number | null>(null);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);



  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchTags();
        setTags(data);
      } catch (err) {
        setError((err as Error).message || 'Failed to load tags');
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  useEffect(() => {
    if (confirmDeleteOpen) {
      const proceed = window.confirm(
        `Are you sure you want to delete ${selectedIds.size} tag(s)? This action cannot be undone.`
      );
      if (proceed) {
        handleConfirmDelete();
      }
      setConfirmDeleteOpen(false);
    }
  }, [confirmDeleteOpen]);
  

  const handleAddClick = () => {
    setIsAdding(true);
    setNewTag({
      name: ""
    });
  };

  const handleCancelNew = () => {
    setIsAdding(false);
  };

  const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTag(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));
  };  

  const isValidTag = (tag: Tag): boolean => {
    return tag.name.trim() !== '';
  };

  const handleSaveNew = async () => {
    if (!isValidTag(newTag)) return;

    try {
      const saved = await addTag(newTag);
      setTags([...tags, saved]);
      setIsAdding(false);
    } catch (err) {
      alert('Failed to save tag.');
      console.error(err);
    }
  };

  const handleEdit = (tag: Tag) => {
    setCurrentlyEditingId(tag.id!);
    setEditTag({ ...tag });
  };

  const handleCancelEdit = () => {
    setCurrentlyEditingId(null);
    setEditTag(null);
  };

  const handleSaveEdit = async () => {
    if (!editTag || !isValidTag(editTag)) return;

    const updated = await updateTag(editTag.id!, editTag);
    setTags(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    );

    setCurrentlyEditingId(null);
    setEditTag(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setEditTag(prev => {
      if (!prev) return prev;
  
      return {
        ...prev,
        [name]: name === 'order' ? Number(value) : value
      };
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => deleteTag(id))
      );
      setTags(prev => prev.filter(tag => !selectedIds.has(tag.id!)));
      setSelectedIds(new Set());
    } catch (err) {
      alert("Failed to delete one or more tags.");
      console.error(err);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="table-container">
      <table className="tag-table">
          <thead className='tag-header-sticky'>
            <tr>
              <th rowSpan={2}>Name</th>
              <th colSpan={3}>Color / Style</th>
              <th rowSpan={2}>Preview</th>
              <th rowSpan={2}>Actions</th>
              <th rowSpan={2}>
                <input
                  type="checkbox"
                  checked={selectedIds.size === tags.length && tags.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(tags.map(tag => tag.id!)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                />
              </th>
            </tr>
            <tr>
              <th>Background</th>
              <th>Border</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, i) =>
              currentlyEditingId === tag.id ? (
                <tr key={tag.id} style={{ backgroundColor: i % 2 === 0 ? '#fdfdfd' : '#f0f4f8' }}>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editTag!.name ?? ''}
                      onChange={handleEditInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="color"
                      value={editTag!.color || ''}
                      onChange={handleEditInputChange}
                      placeholder="#e0e0e0 or 'bg-blue-500'"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="border"
                      value={editTag!.border || ''}
                      onChange={handleEditInputChange}
                      placeholder="#e0e0e0 or 'bg-blue-500'"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="text"
                      value={editTag!.text || ''}
                      onChange={handleEditInputChange}
                      placeholder="#e0e0e0 or 'bg-blue-500'"
                    />
                  </td>
                  <td><TagChip key={editTag!.id} tag={editTag!} /></td>
                  <td>
                    <button
                      className='save-button'
                      onClick={handleSaveEdit}
                      disabled={!isValidTag(editTag!)}
                    >
                      Save
                    </button>
                    <button
                      className='cancel-button' 
                      onClick={handleCancelEdit}>Cancel</button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tag.id!)}
                      onChange={() => {
                        setSelectedIds(prev => {
                          const next = new Set(prev);
                          if (next.has(tag.id!)) next.delete(tag.id!);
                          else next.add(tag.id!);
                          return next;  
                        });
                      }}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={tag.id} style={{ backgroundColor: i % 2 === 0 ? '#fdfdfd' : '#f0f4f8' }}>
                  <td>{tag.name}</td>
                  <td>{tag.color || '-'}</td>
                  <td>{tag.border || '-'}</td>
                  <td>{tag.text || '-'}</td>
                  <td><TagChip key={tag.id} tag={tag} /></td>
                  <td>
                    <button onClick={() => handleEdit(tag)}>Edit</button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tag.id!)}
                      onChange={() => {
                        setSelectedIds(prev => {
                          const next = new Set(prev);
                          if (next.has(tag.id!)) next.delete(tag.id!);
                          else next.add(tag.id!);
                          return next;
                        });
                      }}
                    />
                  </td>
                </tr>
              )
            )}

            {isAdding && (
              <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  value={newTag.name || ''}
                  onChange={handleNewInputChange}
                  placeholder="Tag..."
                />
              </td>
              <td>
                <input
                  type="text"
                  name="color"
                  value={newTag.color || ''}
                  onChange={handleNewInputChange}
                  placeholder="#e0e0e0 or 'bg-blue-500'"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="border"
                  value={newTag.border || ''}
                  onChange={handleNewInputChange}
                  placeholder="#e0e0e0 or 'bg-blue-500'"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="text"
                  value={newTag.text || ''}
                  onChange={handleNewInputChange}
                  placeholder="#e0e0e0 or 'bg-blue-500'"
                />
              </td>
              <td><TagChip key={newTag!.id} tag={newTag!} /></td>
              <td>
                <button
                  className='save-button'
                  onClick={handleSaveNew}
                  disabled={!isValidTag(newTag)}
                >
                  Save
                </button>
                <button 
                  className='cancel-button'
                  onClick={handleCancelNew}>Cancel</button>
              </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className='tag-footer-sticky'>
          {!isAdding && (
            <button style={{ marginTop: '1rem' }} onClick={handleAddClick}>
              + Add Tag
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
        </div>
        
      </div>

    </div>
  );
};

export default TagTable;
