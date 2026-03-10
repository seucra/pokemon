import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const TeamSidebar: React.FC = () => {
  const { members, activeMemberIndex, setActiveIndex, removeMember } = useTeamStore();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest px-2">Your Team</h2>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        {members.map((member, index) => {
          const isActive = index === activeMemberIndex;
          
          return (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={twMerge(
                "group relative bg-slate-900/40 border-2 rounded-2xl p-3 cursor-pointer transition-all h-24 flex items-center justify-center overflow-hidden",
                isActive ? "border-cyan-500 bg-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              )}
            >
              {member && member.pokemon ? (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(index);
                    }}
                    className="absolute top-1 right-1 p-1 bg-slate-950/60 text-slate-500 hover:text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-3 xh-3" />
                  </button>
                  <img 
                    src={member.pokemon.sprites.other?.showdown?.front_default || member.pokemon.sprites.front_default} 
                    alt={member.pokemon.name}
                    className="w-16 h-16 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  />
                  <div className="absolute bottom-1 left-2">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500 group-hover:text-cyan-400 transition-colors">
                      Slot {index + 1}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Plus className={clsx("w-5 h-5", isActive ? "text-cyan-500" : "text-slate-700")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Empty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
