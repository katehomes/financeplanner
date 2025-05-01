import React, { useEffect, useState } from 'react';
import { Category } from '../../types/category';
import { fetchCategorys, 
  addCategory, 
  updateCategory, 
  deleteCategory } from '../../services/categoryService';
  
import '../../css/category-table.css'

const CategoryTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({
    name: "",
    order: 0,
    description: ''
  });
  const [currentlyEditingId, setCurrentlyEditingId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);



  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategorys();
        setCategories(data);
      } catch (err) {
        setError((err as Error).message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (confirmDeleteOpen) {
      const proceed = window.confirm(
        `Are you sure you want to delete ${selectedIds.size} category(s)? This action cannot be undone.`
      );
      if (proceed) {
        handleConfirmDelete();
      }
      setConfirmDeleteOpen(false);
    }
  }, [confirmDeleteOpen]);
  

  const handleAddClick = () => {
    setIsAdding(true);
    setNewCategory({
      name: "",
      order: 0,
      description: ''
    });
  };

  const handleCancelNew = () => {
    setIsAdding(false);
  };

  const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));
  };  

  const isValidCategory = (cg: Category): boolean => {
    return cg.name.trim() !== '';
  };

  const handleSaveNew = async () => {
    if (!isValidCategory(newCategory)) return;

    try {
      const saved = await addCategory(newCategory);
      setCategories([...categories, saved]);
      setIsAdding(false);
    } catch (err) {
      alert('Failed to save category.');
      console.error(err);
    }
  };

  const handleEdit = (cg: Category) => {
    setCurrentlyEditingId(cg.id!);
    setEditCategory({ ...cg });
  };

  const handleCancelEdit = () => {
    setCurrentlyEditingId(null);
    setEditCategory(null);
  };

  const handleSaveEdit = async () => {
    if (!editCategory || !isValidCategory(editCategory)) return;

    const updated = await updateCategory(editCategory.id!, editCategory);
    setCategories(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    );

    setCurrentlyEditingId(null);
    setEditCategory(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setEditCategory(prev => {
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
        Array.from(selectedIds).map(id => deleteCategory(id))
      );
      setCategories(prev => prev.filter(cg => !selectedIds.has(cg.id!)));
      setSelectedIds(new Set());
    } catch (err) {
      alert("Failed to delete one or more categories.");
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
            <th>Name</th>
            <th>Order</th>
            <th>Description</th>
            <th>Actions</th>
            <th>
              <input
                type="checkbox"
                checked={selectedIds.size === categories.length && categories.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(new Set(categories.map(cg => cg.id!)));
                  } else {
                    setSelectedIds(new Set());
                  }
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cg =>
            currentlyEditingId === cg.id ? (
              <tr key={cg.id}>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={editCategory!.name ?? ''}
                    onChange={handleEditInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="order"
                    value={editCategory!.order ?? 0}
                    onChange={handleEditInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={editCategory!.description ?? ''}
                    onChange={handleEditInputChange}
                  />
                </td>
                <td>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!isValidCategory(editCategory!)}
                  >
                    Save
                  </button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={cg.id}>
                <td>{cg.name}</td>
                <td>{cg.order || '-'}</td>
                <td>{cg.description || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(cg)}>Edit</button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(cg.id!)}
                    onChange={() => {
                      setSelectedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(cg.id!)) next.delete(cg.id!);
                        else next.add(cg.id!);
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
                value={newCategory.name || ''}
                onChange={handleNewInputChange}
                placeholder="Category..."
              />
            </td>
            <td>
              <input
                type="number"
                name="order"
                value={newCategory.order || 0}
                onChange={handleNewInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="description"
                value={newCategory.description || ''}
                onChange={handleNewInputChange}
                placeholder="Description..."
              />
            </td>
              <td>
                <button
                  onClick={handleSaveNew}
                  disabled={!isValidCategory(newCategory)}
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
          + Add Category
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
  );
};

export default CategoryTable;
