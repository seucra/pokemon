import React, { useState } from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Plus, Trash2, Edit2, Check, X, Layers } from 'lucide-react';

export const TeamSwitcher: React.FC = () => {
  const { teams, activeTeamId, addTeam, removeTeam, setActiveTeamId, renameTeam } = useTeamStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renameTeam(id, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-5 rounded-[24px] shadow-sm">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
          <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
          <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em]">Active Squads</h2>
        </div>
        <button 
          onClick={() => addTeam()}
          className="p-1.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)] hover:text-white rounded-lg transition-all active:scale-90"
          title="New Squad"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {teams.map((team) => {
          const isActive = team.id === activeTeamId;
          const isEditing = editingId === team.id;

          return (
            <div 
              key={team.id}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                isActive 
                  ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-lg' 
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 text-[var(--text-secondary)]'
              }`}
            >
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(team.id)}
                    className="bg-[var(--bg-main)] border border-[var(--accent-primary)]/30 text-[10px] text-[var(--text-primary)] font-bold px-3 py-1.5 rounded-lg w-full focus:outline-none uppercase tracking-widest"
                  />
                  <button onClick={() => handleRename(team.id)} className="text-green-500 hover:scale-125 transition-transform p-1">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-[var(--accent-primary)] hover:scale-125 transition-transform p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTeamId(team.id)}
                    className={`text-[10px] font-extrabold tracking-widest text-left flex-1 px-1 uppercase truncate ${
                      isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors'
                    }`}
                  >
                    {team.name}
                  </button>
                  <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white/40' : 'text-[var(--text-muted)]'}`}>
                    <button 
                      onClick={() => startEditing(team.id, team.name)}
                      className="p-1 hover:text-[var(--accent-warn,#E9C46A)] transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {teams.length > 1 && (
                      <button 
                        onClick={() => removeTeam(team.id)}
                        className="p-1 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
