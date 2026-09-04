import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

export default function CollaboratorList({ collaborators, currentUserId, isOwner, onRemove }) {
  if (collaborators.length === 0) {
    return <p className="text-sm text-parchment-text/40 italic py-4">No one else has been invited yet.</p>;
  }

  return (
    <div className="divide-y divide-surface-hair/50">
      {collaborators.map((c) => (
        <div key={c.id} className="flex items-center gap-3 py-3">
          <Avatar name={c.user.fullName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{c.user.fullName}</p>
            <p className="data-mono text-xs text-parchment-text/50 truncate">{c.user.email}</p>
          </div>
          <span className="text-xs font-mono text-muted uppercase tracking-wide">{c.role.toLowerCase()}</span>
          <Badge tone={c.accepted ? 'ONGOING' : 'PLANNING'}>
            {c.accepted ? 'joined' : 'pending'}
          </Badge>
          {isOwner && c.user.id !== currentUserId && (
            <button
              onClick={() => onRemove(c.user.id)}
              className="text-xs text-danger hover:underline ml-2"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}