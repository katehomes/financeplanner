import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Category } from '../../types/category';
import { fetchCategorys } from '../../services/categoryService';

type Props = {
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
};

const CategorySelector: React.FC<Props> = ({ value, onChange, disabled = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategorys();
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

  return (
<Select
    isClearable
    isDisabled={disabled || loading}
    options={options}
    value={selectedOption}
    onChange={(selected) => onChange(selected?.value ?? null)}
    placeholder={loading ? 'Loading...' : 'Select a category'}
  />
  );
};

export default CategorySelector;
