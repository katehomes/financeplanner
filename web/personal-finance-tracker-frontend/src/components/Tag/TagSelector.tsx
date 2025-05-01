import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { Tag } from '../../types/tag';
import { fetchTags } from '../../services/tagService';

type Props = {
  value: Tag[]; // currently selected tags
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
};

type Option = { value: number; label: string };

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
    value: tag.id,
    label: tag.name
  }));

  const selectedOptions: Option[] = value.map(tag => ({
    value: tag.id,
    label: tag.name
  }));

  const handleChange = (selected: MultiValue<Option>) => {
    const updatedTags: Tag[] = selected.map(opt => ({
      id: opt.value,
      name: opt.label
    }));
    onChange(updatedTags);
  };

  return (
    <Select
      isMulti
      isDisabled={disabled || loading}
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={loading ? 'Loading tags...' : 'Select tags'}
    />
  );
};

export default TagSelector;
