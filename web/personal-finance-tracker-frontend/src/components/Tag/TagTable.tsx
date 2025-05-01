import React, { useEffect, useState } from 'react';
import { Tag } from '../../types/tag';
import { fetchTags, 
  addTag, 
  updateTag, 
  deleteTag } from '../../services/tagService';
  import TagChip from "../Tag/TagChip"

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

  const isValidTag = (tg: Tag): boolean => {
    return tg.name.trim() !== '';
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

  const handleEdit = (tg: Tag) => {
    setCurrentlyEditingId(tg.id!);
    setEditTag({ ...tg });
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
      setTags(prev => prev.filter(tg => !selectedIds.has(tg.id!)));
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
      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Color / Style</th>
            <th>Preview</th>
            <th>Actions</th>
            <th>
              <input
                type="checkbox"
                checked={selectedIds.size === tags.length && tags.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(new Set(tags.map(tg => tg.id!)));
                  } else {
                    setSelectedIds(new Set());
                  }
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {tags.map(tg =>
            currentlyEditingId === tg.id ? (
              <tr key={tg.id}>
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
                <td>PREVIEW</td>
                <td>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!isValidTag(editTag!)}
                  >
                    Save
                  </button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={tg.id}>
                <td>{tg.name}</td>
                <td>{tg.color || '-'}</td>
                <td>
                  {tg.color ? (
                    <td>tags here</td>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(tg)}>Edit</button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(tg.id!)}
                    onChange={() => {
                      setSelectedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(tg.id!)) next.delete(tg.id!);
                        else next.add(tg.id!);
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
            <td>PREVIEW</td>
            <td>
              <button
                onClick={handleSaveNew}
                disabled={!isValidTag(newTag)}
              >
                Save
              </button>
              <button onClick={handleCancelNew}>Cancel</button>
            </td>
            </tr>
          )}
        </tbody>
      </table>

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
  );
};

export default TagTable;
