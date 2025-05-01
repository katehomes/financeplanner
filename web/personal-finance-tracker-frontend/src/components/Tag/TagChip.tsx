import React from 'react';
import { Tag } from '../../types/tag';

type Props = {
  tag: Tag;
  className?: string;
};

const TagChip: React.FC<Props> = ({ tag, className = '' }) => {
  const style: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: tag.color ?? '#e0e0e0',
    color: '#333',
    borderRadius: '999px',
    padding: '2px 10px',
    fontSize: '0.75rem',
    margin: '2px',
    whiteSpace: 'nowrap',
    ...(/^#/.test(tag.color || '') ? {} : {}), // if needed, you could fall back to class-based styling
  };

  return (
    <span style={style} className={className}>
      {tag.name}
    </span>
  );
};

export default TagChip;
