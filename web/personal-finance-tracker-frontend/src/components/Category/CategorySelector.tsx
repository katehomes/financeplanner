import React, { useEffect, useState } from 'react';
import { Category } from '../../types/category';
import { fetchCategorys } from '../../services/categoryService';

type Props = {
  value: number | null; // category ID
  onChange: (id: number | null) => void;
  disabled?: boolean;
};

const CategorySelector: React.FC<Props> = ({ value, onChange, disabled = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategorys();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <select disabled><option>Loading...</option></select>;
  if (error) return <select disabled><option>{error}</option></select>;

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      disabled={disabled}
    >
      <option value="">None</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelector;
