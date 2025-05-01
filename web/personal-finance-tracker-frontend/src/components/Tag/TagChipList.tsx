import React from 'react';
import { Tag } from '../../types/tag';
import TagChip from './TagChip';

type Props = {
  tags: Tag[] | undefined | null;
  emptyText?: string;
  className?: string;
};

const TagChipList: React.FC<Props> = ({ tags, emptyText = '-', className = '' }) => {
  if (!tags || tags.length === 0) {
    return <span>{emptyText}</span>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }} className={className}>
      {tags.map(tag => (
        <TagChip key={tag.id} tag={tag} />
      ))}
    </div>
  );
};

export default TagChipList;
