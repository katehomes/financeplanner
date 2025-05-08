import React from 'react';
import '../css/modal.css';
import { ImpactedTag } from '../types/impactedTag';

type Props = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  impactedTags?: ImpactedTag[]; 
};

const ConfirmDeleteModal: React.FC<Props> = ({ open, title = 'Confirm Deletion', message, onConfirm, onCancel, impactedTags}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>
        {impactedTags && impactedTags.length > 0 && (
        <div className="modal-warning-section">
            <h4>⚠ Tags in use</h4>
            <ul className="impacted-tag-list">
            {impactedTags.map(tag => (
                <li key={tag.id}>
                <span className="tag-name">{tag.name}</span>
                <span className="tag-count">{tag.transactionCount} transaction{tag.transactionCount !== 1 ? 's' : ''}</span>
                <span className="alert-icon">⚠</span>
                </li>
            ))}
            </ul>
        </div>
        )}

        <div className="modal-actions">
          <button className="btn cancel" onClick={onCancel}>Cancel</button>
          <button className="btn delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
