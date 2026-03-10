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
    <div className="flex flex-col gap-4 mb-8 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-widest">My Teams</h2>
        </div>
        <button 
          onClick={() => addTeam()}
          className="p-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-lg transition-all"
          title="New Team"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {teams.map((team) => {
          const isActive = team.id === activeTeamId;
          const isEditing = editingId === team.id;

          return (
            <div 
              key={team.id}
              className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                isActive ? 'bg-slate-800 border-cyan-500/50 shadow-lg' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isEditing ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(team.id)}
                    className="bg-slate-900 border border-cyan-500/50 text-[11px] text-white px-2 py-1 rounded w-full focus:outline-none"
                  />
                  <button onClick={() => handleRename(team.id)} className="text-green-500 hover:text-green-400">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTeamId(team.id)}
                    className={`text-[11px] font-bold tracking-tight text-left flex-1 truncate px-1 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {team.name}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEditing(team.id, team.name)}
                      className="p-1 text-slate-600 hover:text-amber-400"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {teams.length > 1 && (
                      <button 
                        onClick={() => removeTeam(team.id)}
                        className="p-1 text-slate-600 hover:text-red-400"
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
