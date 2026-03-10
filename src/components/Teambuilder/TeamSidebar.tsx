import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Plus, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const TeamSidebar: React.FC = () => {
  const { getActiveTeam, activeMemberIndex, setActiveIndex, removeMember } = useTeamStore();
  const members = getActiveTeam().members;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest px-2">Your Team</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
        {members.map((member, index) => {
          const isActive = index === activeMemberIndex;
          
          return (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={twMerge(
                "group relative bg-slate-900/40 border-2 rounded-2xl p-4 cursor-pointer transition-all min-h-[100px] flex flex-col items-center justify-center overflow-hidden",
                isActive ? "border-cyan-500 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.02]" : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              )}
            >
              <div className="absolute top-2 left-2 z-10">
                <span className={twMerge(
                  "text-[9px] font-black uppercase tracking-tighter transition-colors",
                  isActive ? "text-cyan-500" : "text-slate-600 group-hover:text-slate-500"
                )}>
                  #{index + 1}
                </span>
              </div>

              {member && member.pokemon ? (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/90 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 border border-slate-700 hover:border-red-500/50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <div className={twMerge(
                      "absolute inset-0 blur-xl opacity-20 transition-opacity",
                      isActive ? "bg-cyan-500 opacity-30" : "bg-white opacity-10"
                    )}></div>
                    <img 
                      src={member.pokemon.sprites.other?.showdown?.front_default || member.pokemon.sprites.front_default} 
                      alt={member.pokemon.name}
                      className="w-14 h-14 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mt-2 truncate w-full text-center">
                    {member.pokemon.name.replace('-', ' ')}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className={twMerge(
                    "w-8 h-8 rounded-xl border border-dashed flex items-center justify-center transition-colors",
                    isActive ? "border-cyan-500/50 bg-cyan-500/5" : "border-slate-800 bg-slate-950/20"
                  )}>
                    <Plus className={twMerge("w-4 h-4", isActive ? "text-cyan-500" : "text-slate-700")} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Recruit</span>
                </div>
              )}
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
