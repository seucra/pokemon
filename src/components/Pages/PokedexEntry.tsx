import React, { useState, useEffect } from 'react';
import { X, Shield, Info, Activity, Target, Sword, ShieldCheck, Flame } from 'lucide-react';
import type { Pokemon } from '../../types/pokemon';
import { pokemonApi } from '../../api/pokemonApi';
import { twMerge } from 'tailwind-merge';

interface PokedexEntryProps {
  pokemon: Pokemon;
  onClose: () => void;
}

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

export const PokedexEntry: React.FC<PokedexEntryProps> = ({ pokemon, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'info' | 'moves'>('stats');
  const [abilityData, setAbilityData] = useState<Record<string, string>>({});
  const [moveDetails, setMoveDetails] = useState<Record<string, any>>({});
  const [loadingExtras, setLoadingExtras] = useState(false);

  useEffect(() => {
    const fetchExtras = async () => {
      setLoadingExtras(true);
      const abPromises = pokemon.abilities.map(async (a) => ({
        name: a.ability.name,
        desc: await pokemonApi.getAbilityDescription(a.ability.name)
      }));
      
      const abResults = await Promise.all(abPromises);
      const abMap: Record<string, string> = {};
      abResults.forEach(r => abMap[r.name] = r.desc);
      setAbilityData(abMap);

      // Fetch first 20 moves for performance
      const sortedMoves = [...pokemon.moves].sort((a, b) => {
        const aLvl = a.version_group_details[0]?.level_learned_at || 0;
        const bLvl = b.version_group_details[0]?.level_learned_at || 0;
        return aLvl - bLvl;
      }).slice(0, 20);

      const mvPromises = sortedMoves.map(async (m) => ({
        name: m.move.name,
        data: await pokemonApi.getMoveDetails(m.move.name)
      }));
      
      const mvResults = await Promise.all(mvPromises);
      const mvMap: Record<string, any> = {};
      mvResults.forEach(r => mvMap[r.name] = r.data);
      setMoveDetails(mvMap);
      setLoadingExtras(false);
    };

    fetchExtras();
  }, [pokemon]);

  const sortedMoves = [...pokemon.moves].sort((a, b) => {
    const aLvl = a.version_group_details[0]?.level_learned_at || 0;
    const bLvl = b.version_group_details[0]?.level_learned_at || 0;
    return aLvl - bLvl;
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 backdrop-blur-3xl bg-[var(--bg-main)]/60 animate-in fade-in duration-500">
      <div 
        className="relative w-full max-w-5xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[90vh] animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-full text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all z-50 shadow-lg active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Visuals & Core Info */}
        <div className="w-full md:w-2/5 p-8 sm:p-12 relative flex flex-col items-center justify-center bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-panel)] to-[var(--bg-panel)] border-r border-[var(--border-subtle)] shrink-0">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
             <Shield className="w-96 h-96 -ml-20 -mt-20 text-[var(--accent-primary)] rotate-12" />
           </div>

           <div className="relative z-10 space-y-8 flex flex-col items-center w-full">
              <div className="text-center">
                 <span className="text-sm font-black text-[var(--accent-primary)]/40 tracking-[0.3em] uppercase block mb-1">Entry #{pokemon.id.toString().padStart(4, '0')}</span>
                 <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none text-[var(--text-primary)]">{pokemon.name.replace('-', ' ')}</h2>
              </div>

              <div className="relative group">
                 <div className="absolute inset-0 bg-[var(--accent-primary)]/10 rounded-full blur-[100px] group-hover:bg-[var(--accent-primary)]/20 transition-all duration-1000"></div>
                 <img 
                    src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} 
                    alt={pokemon.name}
                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain relative z-10 drop-shadow-2xl animate-float-slow"
                 />
              </div>

              <div className="flex gap-2">
                 {pokemon.types.map((t) => (
                    <span 
                       key={t.type.name}
                       className={twMerge(
                          "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                          TYPE_COLORS[t.type.name]
                       )}
                    >
                       {t.type.name}
                    </span>
                 ))}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="bg-[var(--bg-card)]/50 border border-[var(--border-subtle)] p-4 rounded-2xl text-center">
                    <span className="text-[9px] font-black uppercase text-[var(--text-muted)] block mb-1">Height</span>
                    <span className="font-black text-[var(--text-primary)]">{pokemon.height / 10}m</span>
                 </div>
                 <div className="bg-[var(--bg-card)]/50 border border-[var(--border-subtle)] p-4 rounded-2xl text-center">
                    <span className="text-[9px] font-black uppercase text-[var(--text-muted)] block mb-1">Weight</span>
                    <span className="font-black text-[var(--text-primary)]">{pokemon.weight / 10}kg</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Detailed Tabs */}
        <div className="flex-1 flex flex-col bg-[var(--bg-panel)] overflow-hidden">
           {/* Tab Headers */}
           <div className="flex border-b border-[var(--border-subtle)] px-8 pt-8 gap-8 overflow-x-auto scrollbar-hide shrink-0">
              {[
                { id: 'stats', label: 'Base Stats', icon: Activity },
                { id: 'info', label: 'Abilities', icon: Info },
                { id: 'moves', label: 'Moves Mastery', icon: Target },
              ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={twMerge(
                       "flex items-center gap-2 pb-6 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                       activeTab === tab.id ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                 >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent-primary)] rounded-full shadow-[0_0_12px_var(--border-glow)]"></div>
                    )}
                 </button>
              ))}
           </div>

           {/* Tab Content */}
           <div className="flex-1 overflow-y-auto p-8 sm:p-10 scrollbar-hide">
              {activeTab === 'stats' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {pokemon.stats.map((s) => (
                       <div key={s.stat.name} className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                             <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{s.stat.name.replace('special-', 'Sp. ')}</span>
                             <span className="text-sm font-black text-[var(--text-primary)]">{s.base_stat}</span>
                          </div>
                          <div className="h-2.5 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                             <div 
                                className={twMerge("h-full transition-all duration-1000 ease-out rounded-full shadow-lg", STAT_COLORS[s.stat.name])}
                                style={{ width: `${(s.base_stat / 255) * 100}%` }}
                             />
                          </div>
                       </div>
                    ))}
                    
                    <div className="pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between">
                       <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Base Stat Total</span>
                       <span className="text-2xl font-black text-[var(--accent-primary)]">{pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0)}</span>
                    </div>
                 </div>
              )}

              {activeTab === 'info' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)] border-l-4 border-[var(--accent-primary)] pl-4">Biological Abilities</h3>
                    <div className="grid grid-cols-1 gap-6">
                       {pokemon.abilities.map((a) => (
                          <div key={a.ability.name} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-3xl group hover:border-[var(--accent-primary)]/30 transition-all relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="w-12 h-12" />
                             </div>
                             <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-black uppercase tracking-tighter text-[var(--text-primary)]">{a.ability.name.replace('-', ' ')}</span>
                                {a.is_hidden && (
                                   <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">Hidden Factor</span>
                                )}
                             </div>
                             <div className="space-y-4">
                                <p className="text-[var(--text-primary)]/80 text-xs font-medium leading-relaxed">
                                   {abilityData[a.ability.name] || (loadingExtras ? "Processing Bio-Stream..." : "Scanning Archive...")}
                                </p>
                                <div className="pt-4 border-t border-[var(--border-subtle)]/50 flex flex-wrap gap-4">
                                   <div className="flex items-center gap-2">
                                      <Activity className="w-3 h-3 text-[var(--accent-primary)]" />
                                      <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">Battle Class: <span className="text-[var(--text-primary)]">Tactical</span></span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <Target className="w-3 h-3 text-[var(--accent-primary)]" />
                                      <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">Priority: <span className="text-[var(--text-primary)]">Critical</span></span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'moves' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)] border-l-4 border-[var(--accent-primary)] pl-4">Mastery Progression</h3>
                       <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-card)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">{pokemon.moves.length} Archives Found</span>
                    </div>

                    <div className="space-y-3">
                       {sortedMoves.slice(0, 50).map((m) => {
                          const lvl = m.version_group_details[0]?.level_learned_at;
                          const method = m.version_group_details[0]?.move_learn_method.name;
                          const details = moveDetails[m.move.name];

                          return (
                             <div key={m.move.name} className="flex items-center gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl group hover:border-[var(--accent-primary)]/30 transition-all">
                                <div className="w-10 h-10 bg-[var(--bg-panel)] rounded-xl flex items-center justify-center border border-[var(--border-subtle)] shrink-0">
                                   <span className="text-xs font-black text-[var(--accent-primary)]">{lvl > 0 ? lvl : '—'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-3 mb-1">
                                      <span className="text-xs font-black uppercase tracking-tight text-[var(--text-primary)] truncate">{m.move.name.replace('-', ' ')}</span>
                                      {details && (
                                         <span className={twMerge(
                                            "text-[7px] font-black uppercase px-2 py-0.5 rounded-md text-white/90",
                                            TYPE_COLORS[details.type.name]
                                         )}>
                                            {details.type.name}
                                         </span>
                                      )}
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">{method.replace('-', ' ')}</span>
                                      {details && (
                                         <>
                                            <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)]"></div>
                                            <span className="text-[9px] font-black uppercase text-[var(--text-muted)] flex items-center gap-1">
                                               {details.damage_class.name === 'physical' ? <Sword className="w-2.5 h-2.5" /> : <Flame className="w-2.5 h-2.5" />}
                                               {details.damage_class.name}
                                            </span>
                                         </>
                                      )}
                                   </div>
                                </div>
                                {details && (
                                   <div className="flex gap-4 shrink-0">
                                      <div className="text-center">
                                         <span className="text-[8px] font-black uppercase text-[var(--text-muted)] block">PWR</span>
                                         <span className="text-[10px] font-black text-[var(--text-primary)]">{details.power || '—'}</span>
                                      </div>
                                      <div className="text-center">
                                         <span className="text-[8px] font-black uppercase text-[var(--text-muted)] block">ACC</span>
                                         <span className="text-[10px] font-black text-[var(--text-primary)]">{details.accuracy || '—'}</span>
                                      </div>
                                   </div>
                                )}
                             </div>
                          );
                       })}
                    </div>
                    {pokemon.moves.length > 50 && (
                       <p className="text-center text-[9px] font-black uppercase text-[var(--text-muted)] opacity-40 italic">Truncating archive at 50 nodes...</p>
                    )}
                 </div>
              )}
           </div>

           {/* Quick Footer Action */}
           <div className="p-8 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/30 flex justify-between items-center shrink-0">
              <div className="hidden sm:flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Live Data Stream Active</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full sm:w-auto px-12 py-4 bg-[var(--accent-primary)] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-red-500/20 active:scale-95 transition-all"
              >
                 Return to Archive
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
