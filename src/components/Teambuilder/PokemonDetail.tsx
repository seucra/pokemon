import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Zap, Heart, Info, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { TypeChart } from './TypeChart';

const STAT_COLORS: Record<string, string> = {
  hp: 'bg-rose-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  'special-attack': 'bg-blue-400',
  'special-defense': 'bg-green-500',
  speed: 'bg-pink-500',
};

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-400',
  fighting: 'bg-orange-700', poison: 'bg-purple-500', ground: 'bg-amber-600',
  flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-stone-600', ghost: 'bg-violet-700', dragon: 'bg-indigo-700',
  dark: 'bg-neutral-800', steel: 'bg-slate-400', fairy: 'bg-rose-400',
};

export const PokemonDetail: React.FC = () => {
  const { getActiveTeam, activeMemberIndex, setAbility } = useTeamStore();
  const team = getActiveTeam();
  const member = team.members[activeMemberIndex];

  if (!member || !member.pokemon) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-[var(--text-muted)] gap-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 rounded-full border-2 border-[var(--border-subtle)] border-dashed animate-spin flex items-center justify-center" style={{animationDuration: '8s'}}>
           <Star className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm font-extrabold uppercase tracking-[0.3em] opacity-40">Scanning Unit...</p>
      </div>
    );
  }

  const { pokemon, ability: currentAbilityName } = member;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Visuals & Types */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-[var(--accent-primary)]/5 rounded-full blur-[80px] group-hover:bg-[var(--accent-primary)]/10 transition-all duration-1000"></div>
            <img 
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-xl transform hover:scale-105 transition-transform duration-700"
            />
          </div>
          
          <div className="flex gap-2">
            {pokemon.types.map((t) => (
              <span 
                key={t.type.name}
                className={twMerge(
                  "px-5 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-widest text-white shadow-md transition-transform hover:scale-110 cursor-default",
                  TYPE_COLORS[t.type.name]
                )}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="w-full space-y-3 pt-4 text-center md:text-left">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--text-muted)] border-l-4 border-[var(--accent-primary)] pl-3">Abilities</h3>
            <div className="grid grid-cols-1 gap-2">
              {pokemon.abilities.map((a) => {
                const isSelected = currentAbilityName === a.ability.name;
                return (
                  <button
                    key={a.ability.name}
                    onClick={() => setAbility(activeMemberIndex, a.ability.name)}
                    className={twMerge(
                      "group flex items-center justify-between px-5 py-3 rounded-xl border transition-all text-sm",
                      isSelected 
                        ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 shadow-md" 
                        : "bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/20 hover:bg-[var(--bg-panel)]"
                    )}
                  >
                    <div className="flex flex-col items-start gap-0.5">
                       <span className={twMerge(
                         "font-extrabold uppercase tracking-[0.05em] transition-colors text-sm",
                         isSelected ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                       )}>
                         {a.ability.name.replace('-', ' ')}
                       </span>
                       {a.is_hidden && (
                         <span className="text-[8px] font-extrabold uppercase tracking-widest text-amber-500/60">Hidden</span>
                       )}
                    </div>
                    {isSelected && <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse shadow-[0_0_12px_var(--border-glow)]"></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Info & Stats */}
        <div className="flex-1 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-8">
            <div>
              <span className="text-sm font-extrabold text-[var(--accent-primary)]/40 tracking-[0.15em] mb-1 block uppercase">#{pokemon.id.toString().padStart(4, '0')}</span>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none text-[var(--text-primary)]/95">{pokemon.name.replace('-', ' ')}</h2>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-extrabold uppercase text-[var(--text-muted)]">Height</span>
                <span className="font-extrabold text-[var(--text-primary)]/70 text-sm">{pokemon.height / 10}m</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-extrabold uppercase text-[var(--text-muted)]">Weight</span>
                <span className="font-extrabold text-[var(--text-primary)]/70 text-sm">{pokemon.weight / 10}kg</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-10">
               <div className="space-y-5">
                 <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--text-muted)] border-l-4 border-[var(--accent-primary)] pl-3">Base Stats</h3>
                 <div className="space-y-4">
                   {pokemon.stats.map((s) => (
                     <div key={s.stat.name} className="space-y-1.5">
                       <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest">
                         <span className="text-[var(--text-muted)]">{s.stat.name.replace('special-', 'Sp. ')}</span>
                         <span className="text-[var(--text-secondary)]">{s.base_stat}</span>
                       </div>
                       <div className="h-2 bg-[var(--bg-panel)] rounded-full overflow-hidden">
                         <div 
                           className={twMerge("h-full transition-all duration-1000 ease-out rounded-full shadow-sm", STAT_COLORS[s.stat.name])}
                           style={{ width: `${(s.base_stat / 255) * 100}%` }}
                         />
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--text-muted)] border-l-4 border-[var(--accent-primary)] pl-3">Performance</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center group">
                       <Heart className="w-4 h-4 text-rose-500 group-hover:scale-125 transition-transform" />
                       <span className="text-[8px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Vitality</span>
                       <span className="font-extrabold text-sm text-[var(--text-primary)]/70">{Math.floor(pokemon.stats[0].base_stat / 3)}</span>
                    </div>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center group">
                       <Zap className="w-4 h-4 text-[var(--accent-secondary)] group-hover:scale-125 transition-transform" />
                       <span className="text-[8px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Tier</span>
                       <span className="font-extrabold text-sm text-[var(--text-primary)]/70 uppercase">Elite</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="xl:border-l xl:border-[var(--border-subtle)] xl:pl-10">
               <TypeChart types={pokemon.types.map(t => t.type.name)} />
            </div>
          </div>

          <div className="mt-8 p-6 bg-[var(--accent-primary)]/[0.03] border border-[var(--accent-primary)]/10 rounded-2xl relative overflow-hidden group hover:bg-[var(--accent-primary)]/[0.06] transition-colors">
            <div className="flex gap-4 relative z-10 items-center">
              <Info className="w-5 h-5 text-[var(--accent-primary)]/60 flex-shrink-0" />
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Resistances are calculated including dual-type synergies. 
                Switch graphics style in the top menu.
              </p>
            </div>
            <Star className="absolute -bottom-8 -right-8 w-24 h-24 text-[var(--accent-primary)] opacity-5 rotate-12 transition-transform group-hover:rotate-90 duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
};
