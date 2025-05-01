import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';
import { Tag } from '../../types/tag';
import { fetchTags } from '../../services/tagService';

type Props = {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
};

type Option = { value: number | string; label: string };

const TagSelector: React.FC<Props> = ({ value, onChange, disabled = false }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      const data = await fetchTags();
      setAllTags(data);
      setLoading(false);
    };

    loadTags();
  }, []);

  const options: Option[] = allTags.map(tag => ({
    value: tag.id ?? tag.name,
    label: tag.name,
  }));

  const selectedOptions: Option[] = value.map(tag => ({
    value: tag.id ?? tag.name,
    label: tag.name,
  }));

  const handleChange = (selected: MultiValue<Option>) => {
    const tags: Tag[] = selected.map(opt => ({
      id: typeof opt.value === 'number' ? opt.value : undefined,
      name: opt.label,
    }));
    onChange(tags);
  };

  const handleCreate = (inputValue: string) => {
    const newTag: Tag = { name: inputValue }; // id will be set after save
    onChange([...value, newTag]);
  };

  return (
    <CreatableSelect
      isMulti
      isDisabled={disabled || loading}
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder={loading ? 'Loading tags...' : 'Select or type new tags'}
    />
  );
};

export default TagSelector;
