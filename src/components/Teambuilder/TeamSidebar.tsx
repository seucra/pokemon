import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Plus, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const TeamSidebar: React.FC = () => {
  const { getActiveTeam, activeMemberIndex, setActiveIndex, removeMember } = useTeamStore();
  const members = getActiveTeam().members;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-3 italic">Squad Members</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-5">
        {members.map((member, index) => {
          const isActive = index === activeMemberIndex;
          
          return (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={twMerge(
                "group relative bg-white border-2 rounded-[32px] p-5 cursor-pointer transition-all min-h-[110px] flex flex-col items-center justify-center overflow-hidden shadow-sm",
                isActive ? "border-orange-600 bg-orange-500 text-white shadow-xl scale-[1.05]" : "border-slate-100 hover:border-red-600/30 hover:bg-white hover:shadow-md"
              )}
            >
              <div className="absolute top-3 left-4 z-10">
                <span className={twMerge(
                  "text-[10px] font-black uppercase tracking-tight italic transition-colors",
                  isActive ? "text-red-600" : "text-slate-300 group-hover:text-red-500"
                )}>
                  SLOT {index + 1}
                </span>
              </div>

              {member && member.pokemon ? (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(index);
                    }}
                    className={twMerge(
                      "absolute top-3 right-3 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 border-2",
                      isActive 
                        ? "bg-red-600/10 border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white"
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-500/30"
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <div className={twMerge(
                      "absolute inset-0 blur-2xl opacity-10 transition-opacity",
                      isActive ? "bg-red-600 opacity-40" : "bg-red-600 opacity-0 group-hover:opacity-20"
                    )}></div>
                    <img 
                      src={member.pokemon.sprites.other?.showdown?.front_default || member.pokemon.sprites.front_default} 
                      alt={member.pokemon.name}
                      className="w-16 h-16 object-contain relative z-10 drop-shadow-lg scale-110 group-hover:rotate-12 transition-transform duration-500"
                    />
                  </div>
                  <span className={twMerge(
                    "text-[11px] font-black uppercase tracking-tighter mt-3 truncate w-full text-center italic",
                    isActive ? "text-white" : "text-slate-900"
                  )}>
                    {member.pokemon.name.replace('-', ' ')}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className={twMerge(
                    "w-10 h-10 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all",
                    isActive ? "border-red-600/50 bg-red-600/5 rotate-45" : "border-slate-100 bg-slate-50 group-hover:bg-red-50 group-hover:border-red-100"
                  )}>
                    <Plus className={twMerge("w-5 h-5", isActive ? "text-red-600 -rotate-45" : "text-slate-200 group-hover:text-red-600")} />
                  </div>
                  <span className={twMerge(
                    "text-[10px] font-black uppercase tracking-[0.2em] italic",
                    isActive ? "text-red-600 opacity-40" : "text-slate-200 group-hover:text-red-300"
                  )}>Recruit</span>
                </div>
              )}
              
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
