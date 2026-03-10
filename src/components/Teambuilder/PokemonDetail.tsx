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
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-200 gap-6 animate-in fade-in duration-500 italic">
        <div className="w-28 h-28 rounded-[40px] border-4 border-slate-50 border-dashed animate-spin flex items-center justify-center">
           <Star className="w-10 h-10 opacity-20" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-100">Scanning Unit...</p>
      </div>
    );
  }

  const { pokemon, ability: currentAbilityName } = member;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-16">
        {/* Left: Visuals & Types */}
        <div className="flex flex-col items-center gap-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-red-600/5 rounded-full blur-[100px] group-hover:bg-red-500/10 transition-all duration-1000"></div>
            <img 
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="w-56 h-56 md:w-72 md:h-72 object-contain relative z-10 drop-shadow-xl transform hover:scale-105 transition-transform duration-700"
            />
          </div>
          
          <div className="flex gap-3">
            {pokemon.types.map((t) => (
              <span 
                key={t.type.name}
                className={twMerge(
                  "px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-transform hover:scale-110 cursor-default italic",
                  TYPE_COLORS[t.type.name]
                )}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="w-full space-y-4 pt-6 text-center md:text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-l-[6px] border-orange-500 pl-4 italic">Biological Traits</h3>
            <div className="grid grid-cols-1 gap-3">
              {pokemon.abilities.map((a) => {
                const isSelected = currentAbilityName === a.ability.name;
                return (
                  <button
                    key={a.ability.name}
                    onClick={() => setAbility(activeMemberIndex, a.ability.name)}
                    className={twMerge(
                      "group flex items-center justify-between px-6 py-4 rounded-3xl border-2 transition-all text-sm",
                      isSelected 
                        ? "bg-orange-500/10 border-orange-600 shadow-md" 
                        : "bg-slate-50 border-transparent hover:border-orange-600/30 hover:bg-white hover:shadow-sm"
                    )}
                  >
                    <div className="flex flex-col items-start gap-1">
                       <span className={twMerge(
                         "font-black uppercase tracking-[0.05em] transition-colors italic",
                         isSelected ? "text-orange-700" : "text-slate-500 group-hover:text-orange-600"
                       )}>
                         {a.ability.name.replace('-', ' ')}
                       </span>
                       {a.is_hidden && (
                         <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 italic">Rare Hidden Gene</span>
                       )}
                    </div>
                    {isSelected && <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-pulse shadow-[0_0_12px_rgba(249,115,22,0.8)]"></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Info & Stats & TYPE CHART */}
        <div className="flex-1 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-950/5 pb-10">
            <div>
              <span className="text-base font-black text-red-600 italic tracking-[0.2em] mb-2 block uppercase opacity-40">#{pokemon.id.toString().padStart(4, '0')}</span>
              <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none italic text-orange-600 underline decoration-orange-600/5 underline-offset-10 decoration-8">{pokemon.name.replace('-', ' ')}</h2>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-slate-300">Height</span>
                <span className="font-black text-slate-900 border-b-2 border-orange-600/10 px-2 italic">{pokemon.height / 10}m</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-slate-300">Weight</span>
                <span className="font-black text-slate-900 border-b-2 border-orange-600/10 px-2 italic">{pokemon.weight / 10}kg</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            {/* Stats Column */}
            <div className="space-y-12">
               <div className="space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-l-[6px] border-orange-500 pl-4 italic">Power Matrices</h3>
                 <div className="space-y-5">
                   {pokemon.stats.map((s) => (
                     <div key={s.stat.name} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-400 group-hover:text-slate-600">{s.stat.name.replace('special-', 'Sp. ')}</span>
                         <span className="text-orange-700 italic border-b border-orange-100">{s.base_stat}</span>
                       </div>
                       <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                         <div 
                           className={twMerge("h-full transition-all duration-1000 ease-out rounded-full shadow-sm", STAT_COLORS[s.stat.name])}
                           style={{ width: `${(s.base_stat / 255) * 100}%` }}
                         />
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-l-[6px] border-orange-500 pl-4 italic">Performance Rating</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FDFEFE] border-2 border-slate-50 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 text-center group shadow-sm">
                       <Heart className="w-5 h-5 text-rose-500 group-hover:scale-125 transition-transform" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Vitality Hub</span>
                       <span className="font-black text-sm italic text-slate-900">{Math.floor(pokemon.stats[0].base_stat / 3)}</span>
                    </div>
                    <div className="bg-[#FDFEFE] border-2 border-slate-50 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 text-center group shadow-sm">
                       <Zap className="w-5 h-5 text-yellow-500 group-hover:scale-125 transition-transform" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Combat Tier</span>
                       <span className="font-black text-sm italic text-slate-900">S-CLASS</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Type Chart Column */}
            <div className="xl:border-l-4 xl:border-slate-50 xl:pl-12">
               <TypeChart types={pokemon.types.map(t => t.type.name)} />
            </div>
          </div>

          <div className="mt-10 p-8 bg-orange-500/5 border-2 border-orange-500/20 rounded-[40px] relative overflow-hidden group hover:bg-orange-500/10 transition-colors">
            <div className="flex gap-5 relative z-10 items-center">
              <Info className="w-7 h-7 text-orange-600 flex-shrink-0" />
              <p className="text-[12px] text-orange-900/60 leading-relaxed font-bold italic">
                STRATEGY NOTE: This Pokémon's resistances are calculated including its dual-type synergies. 
                Hover over results for tactical info.
              </p>
            </div>
            <Star className="absolute -bottom-10 -right-10 w-32 h-32 text-orange-600 opacity-10 rotate-12 transition-transform group-hover:rotate-90 duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
};
