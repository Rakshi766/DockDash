import React from 'react';

export default function EmptyState({ message, ctaText, onCtaClick }) {
  return (
    <div className="empty-state">
      <p className="empty-message">{message}</p>
      {ctaText && (
        <button className="btn-primary" onClick={onCtaClick}>
          {ctaText}
        </button>
      )}
    </div>
  );
}