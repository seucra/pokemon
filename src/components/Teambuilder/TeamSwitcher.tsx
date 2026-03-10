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
    <div className="flex flex-col gap-5 mb-10 bg-white border-2 border-slate-200/60 p-6 rounded-[32px] shadow-sm">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3 text-slate-800">
          <Layers className="w-5 h-5 text-red-600" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Active Squads</h2>
        </div>
        <button 
          onClick={() => addTeam()}
          className="p-2 bg-red-600/5 text-red-600 border border-red-600/20 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
          title="New Squad"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {teams.map((team) => {
          const isActive = team.id === activeTeamId;
          const isEditing = editingId === team.id;

          return (
            <div 
              key={team.id}
              className={`group flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                isActive 
                  ? 'bg-orange-500 border-orange-600 text-white shadow-md' 
                  : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'
              }`}
            >
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(team.id)}
                    className="bg-white border-2 border-red-500 text-[11px] text-slate-900 font-bold px-3 py-1.5 rounded-lg w-full focus:outline-none shadow-inner italic"
                  />
                  <button onClick={() => handleRename(team.id)} className="text-green-500 hover:scale-125 transition-transform p-1">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-red-500 hover:scale-125 transition-transform p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTeamId(team.id)}
                    className={`text-[11px] font-black tracking-widest text-left flex-1 px-2 uppercase italic truncate ${
                      isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900 transition-colors'
                    }`}
                  >
                    {team.name}
                  </button>
                  <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white/40' : 'text-slate-400'}`}>
                    <button 
                      onClick={() => startEditing(team.id, team.name)}
                      className="p-1.5 hover:text-amber-500 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {teams.length > 1 && (
                      <button 
                        onClick={() => removeTeam(team.id)}
                        className="p-1.5 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
