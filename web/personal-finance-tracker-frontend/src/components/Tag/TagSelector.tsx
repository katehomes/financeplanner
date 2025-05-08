import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';
import { Tag } from '../../types/tag';
import { fetchTags, createTag as defaultCreateTag } from '../../services/tagService';

type Props = {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
  onCreateTag?: (name: string) => Promise<Tag>;
  initTags?: Tag[];
};

type Option = { value: number; label: string };

const TagSelector: React.FC<Props> = ({ 
  value, onChange, disabled = false,
  onCreateTag, initTags
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      const data = initTags ? initTags : await fetchTags();
      setAllTags(data);
      setLoading(false);
    };
    loadTags();
  }, []);

  const options: Option[] = allTags.map(tag => ({
    value: tag.id!,
    label: tag.name,
  }));

  const selectedOptions: Option[] = value.map(tag => ({
    value: tag.id!,
    label: tag.name,
  }));

  const handleChange = (selected: MultiValue<Option>) => {
    const tags: Tag[] = selected.map(opt => ({
      id: opt.value,
      name: opt.label,
    }));
    onChange(tags);
  };

  const handleCreate = async (inputValue: string) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    try {
      // Use custom newTag if passed, otherwise fallback to API
      const newTag = await (onCreateTag 
        ? onCreateTag(trimmed) 
        : defaultCreateTag({name: trimmed}));
      setAllTags(prev => [...prev, newTag]);
      onChange([...value, newTag]);
    } catch (err) {
      alert("Failed to create new tag");
      console.error(err);
    }
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
