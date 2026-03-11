import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Plus, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const TeamSidebar: React.FC = () => {
  const { getActiveTeam, activeMemberIndex, setActiveIndex, removeMember } = useTeamStore();
  const members = getActiveTeam().members;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.2em] px-2 italic">Squad Members</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
        {members.map((member, index) => {
          const isActive = index === activeMemberIndex;
          
          return (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={twMerge(
                "group relative bg-[var(--bg-panel)] border rounded-2xl p-4 cursor-pointer transition-all min-h-[100px] flex flex-col items-center justify-center overflow-hidden",
                isActive ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-lg scale-[1.03]" : "border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-card)]"
              )}
            >
              <div className="absolute top-2.5 left-3 z-10">
                <span className={twMerge(
                  "text-[9px] font-extrabold uppercase tracking-tight transition-colors",
                  isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
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
                      "absolute top-2.5 right-2.5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 border",
                      isActive 
                        ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
                        : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/30"
                    )}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="relative">
                    <div className={twMerge(
                      "absolute inset-0 blur-2xl opacity-0 transition-opacity",
                      isActive ? "bg-[var(--accent-primary)] opacity-30" : "bg-[var(--accent-primary)] group-hover:opacity-10"
                    )}></div>
                    <img 
                      src={member.pokemon.sprites.other?.showdown?.front_default || member.pokemon.sprites.front_default} 
                      alt={member.pokemon.name}
                      className="w-14 h-14 object-contain relative z-10 drop-shadow-lg group-hover:rotate-6 transition-transform duration-500"
                    />
                  </div>
                  <span className={twMerge(
                    "text-[10px] font-extrabold uppercase tracking-tight mt-2 truncate w-full text-center",
                    isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  )}>
                    {member.pokemon.name.replace('-', ' ')}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className={twMerge(
                    "w-9 h-9 rounded-xl border-2 border-dashed flex items-center justify-center transition-all",
                    isActive ? "border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/5" : "border-[var(--border-subtle)] bg-[var(--bg-card)] group-hover:border-[var(--accent-primary)]/30"
                  )}>
                    <Plus className={twMerge("w-4 h-4", isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]/60")} />
                  </div>
                  <span className={twMerge(
                    "text-[9px] font-extrabold uppercase tracking-[0.15em]",
                    isActive ? "text-[var(--accent-primary)]/50" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                  )}>Recruit</span>
                </div>
              )}
              
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[var(--accent-primary)] shadow-[0_0_12px_var(--border-glow)]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
