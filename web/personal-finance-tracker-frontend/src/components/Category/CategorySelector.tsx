import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Category } from '../../types/category';
import { fetchCategorys, createCategory as defaultCreateCategory } from '../../services/categoryService';

type Props = {
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
  onCreateCategory?: (name: string) => Promise<Category>;
  initCategories?: Category[];
};

const CategorySelector: React.FC<Props> = ({ 
  value, onChange, disabled = false,
  onCreateCategory, initCategories
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = initCategories ? initCategories : await fetchCategorys();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const options = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const selectedOption = options.find(opt => opt.value === value) ?? null;

  const handleCreate = async (inputValue: string) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    try {
      // Use custom createCategory if passed, otherwise fallback to API
      const newCategory = await (onCreateCategory 
        ? onCreateCategory(trimmed) 
        : defaultCreateCategory(trimmed));

      setCategories(prev => [...prev, newCategory]);
      onChange(newCategory.id!);
    } catch (err) {
      alert("Failed to create new category");
      console.error(err);
    }
  };

  return (
<CreatableSelect
    isClearable
    isDisabled={disabled || loading}
    options={options}
    value={selectedOption}
    onChange={(selected) => onChange(selected?.value ?? null)}
    onCreateOption={handleCreate}
    placeholder={loading ? 'Loading...' : 'Select a category'}
  />
  );
};

export default CategorySelector;
