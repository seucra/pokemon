import React, { useState, useEffect } from 'react';
import { X, Shield, Info, Activity, Target, Sword, ShieldCheck, Flame } from 'lucide-react';
import type { Pokemon } from '../../types/pokemon';
import { pokemonApi } from '../../api/pokemonApi';
import { twMerge } from 'tailwind-merge';
import { TYPE_COLORS, STAT_COLORS } from '../../constants/colors';

interface PokedexEntryProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export const PokedexEntry: React.FC<PokedexEntryProps> = ({ pokemon, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'info' | 'moves'>('stats');
  const [moveTab, setMoveTab] = useState<'level-up' | 'machine' | 'tutor' | 'all'>('level-up');
  const [abilityData, setAbilityData] = useState<Record<string, string>>({});
  const [moveDetails, setMoveDetails] = useState<Record<string, any>>({});
  const [loadingExtras, setLoadingExtras] = useState(false);

  // Prevent background scrolling when archive is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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

      // Fetch move details for ALL moves to ensure perfect coverage
      // We do this in chunks to avoid overwhelming the browser/API
      const allMoves = [...pokemon.moves];
      const mvPromises = allMoves.map(async (m) => ({
        name: m.move.name,
        data: await pokemonApi.getMoveDetails(m.move.name)
      }));
      
      const mvResults = await Promise.all(mvPromises);
      const mvMap: Record<string, any> = {};
      mvResults.forEach(r => {
        if (r.data) mvMap[r.name] = r.data;
      });
      setMoveDetails(mvMap);
      setLoadingExtras(false);
    };

    fetchExtras();
  }, [pokemon]);

  const sortedMoves = [...pokemon.moves].sort((a, b) => {
    const aMethod = a.version_group_details[0]?.move_learn_method.name;
    const bMethod = b.version_group_details[0]?.move_learn_method.name;
    
    // Sort by method first: level-up < tutor < machine
    const methodOrder: Record<string, number> = { 'level-up': 0, 'tutor': 1, 'machine': 2 };
    const aOrder = methodOrder[aMethod] ?? 3;
    const bOrder = methodOrder[bMethod] ?? 3;
    
    if (aOrder !== bOrder) return aOrder - bOrder;
    
    // Within same method, sort by level
    const aLvl = a.version_group_details[0]?.level_learned_at || 0;
    const bLvl = b.version_group_details[0]?.level_learned_at || 0;
    return aLvl - bLvl;
  });

  const filteredMoves = sortedMoves.filter(m => {
    const method = m.version_group_details[0]?.move_learn_method.name;
    if (moveTab === 'all') return true;
    if (moveTab === 'machine') return method === 'machine';
    if (moveTab === 'level-up') return method === 'level-up';
    if (moveTab === 'tutor') return method === 'tutor';
    return false;
  });

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 backdrop-blur-3xl bg-[var(--bg-main)]/60 animate-in fade-in duration-500"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[var(--bg-panel)] border-x border-b sm:border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-[40px] shadow-2xl flex flex-col md:flex-row h-full sm:h-auto max-h-full sm:max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 overflow-y-auto sm:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed sm:absolute top-4 sm:top-6 right-4 sm:right-6 p-3 bg-[var(--bg-card)]/80 sm:bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-full text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all z-[100] shadow-xl backdrop-blur-md active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Visuals & Core Info */}
        <div className="w-full md:w-2/5 p-6 sm:p-12 relative flex flex-col items-center justify-center bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-panel)] to-[var(--bg-panel)] border-b md:border-b-0 md:border-r border-[var(--border-subtle)] shrink-0 overflow-hidden">
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
        <div className="flex-1 flex flex-col bg-[var(--bg-panel)] sm:overflow-hidden">
           {/* Tab Headers */}
           <div className="flex border-b border-[var(--border-subtle)] px-6 sm:px-8 pt-6 sm:pt-8 gap-6 sm:gap-8 overflow-x-auto scrollbar-hide shrink-0 bg-[var(--bg-panel)] sticky top-0 md:relative z-40">
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
           <div className="flex-1 sm:overflow-y-auto p-6 sm:p-10 scrollbar-hide">
              {activeTab === 'stats' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {pokemon.stats.map((s) => (
                       <div key={s.stat.name} className="space-y-3">
                          <div className="flex justify-between items-center px-1">
                             <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)]">{s.stat.name.replace('special-', 'Sp. ')}</span>
                             <span className="text-base font-black text-[var(--text-primary)]">{s.base_stat}</span>
                          </div>
                          <div className="h-3 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
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
                             <div className="space-y-5">
                                <p className="text-[var(--text-primary)]/90 text-sm font-medium leading-[1.6]">
                                   {abilityData[a.ability.name] || (loadingExtras ? "Processing Bio-Stream..." : "Scanning Archive...")}
                                </p>
                                <div className="pt-5 border-t border-[var(--border-subtle)]/50 flex flex-wrap gap-5">
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)] border-l-4 border-[var(--accent-primary)] pl-4">Mastery Progression</h3>
                       
                       {/* Sub-Tabs */}
                       <div className="flex bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-subtle)] overflow-x-auto scrollbar-hide">
                          {[
                            { id: 'level-up', label: 'Level Up' },
                            { id: 'machine', label: 'TM / HM' },
                            { id: 'tutor', label: 'Tutor' },
                            { id: 'all', label: 'All' },
                          ].map(t => (
                             <button
                                key={t.id}
                                onClick={() => setMoveTab(t.id as any)}
                                className={twMerge(
                                   "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                   moveTab === t.id ? "bg-[var(--accent-primary)] text-white shadow-md shadow-red-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                )}
                             >
                                {t.label}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       {filteredMoves.slice(0, 50).map((m) => {
                          const lvl = m.version_group_details[0]?.level_learned_at;
                          const method = m.version_group_details[0]?.move_learn_method.name;
                          const details = moveDetails[m.move.name];
                          const typeColor = details ? (TYPE_COLORS[details.type.name] || 'bg-slate-500') : 'border-[var(--border-subtle)]';

                          return (
                             <div 
                                key={m.move.name} 
                                className={twMerge(
                                  "flex items-center gap-4 p-4 bg-[var(--bg-card)] border transition-all rounded-2xl group",
                                  details ? `border-l-4 ${typeColor.replace('bg-', 'border-')}` : "border-[var(--border-subtle)]"
                                )}
                             >
                                <div className="w-10 h-10 bg-[var(--bg-panel)] rounded-xl flex items-center justify-center border border-[var(--border-subtle)] shrink-0 shadow-inner">
                                   <span className="text-[10px] font-black text-[var(--accent-primary)]">{lvl > 0 ? lvl : '—'}</span>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                       <span className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                                          {m.move.name.replace('-', ' ')}
                                       </span>
                                       {details && (
                                          <span className={twMerge(
                                             "text-[9px] font-black uppercase px-3 py-1 rounded-lg text-white shadow-md border border-white/20",
                                             TYPE_COLORS[details.type.name]
                                          )}>
                                             {details.type.name}
                                          </span>
                                       )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <span className={twMerge(
                                         "text-[10px] font-black uppercase p-1.5 rounded-md border shadow-sm transition-all",
                                         details 
                                           ? `${TYPE_COLORS[details.type.name].replace('bg-', 'text-')} ${TYPE_COLORS[details.type.name].replace('bg-', 'border-')}/30 bg-[var(--bg-panel)]` 
                                           : "bg-[var(--bg-panel)] border-[var(--border-subtle)]/50 text-[var(--text-muted)]"
                                       )}>
                                          {method === 'level-up' && details ? details.damage_class.name : method.replace('-', ' ')}
                                       </span>
                                       {details && (
                                          <>
                                             <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)] opacity-40"></div>
                                             <span className={twMerge(
                                                "text-[10px] font-black uppercase flex items-center gap-1.5 opacity-70 transition-colors",
                                                TYPE_COLORS[details.type.name].replace('bg-', 'text-')
                                             )}>
                                                {details.damage_class.name === 'physical' ? <Sword className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
                                                {details.damage_class.name}
                                             </span>
                                          </>
                                       )}
                                    </div>
                                </div>

                                {details && (
                                   <div className="flex gap-6 shrink-0 pr-2">
                                      <div className="text-center">
                                         <span className="text-[9px] font-black uppercase text-[var(--text-muted)] block mb-0.5">PWR</span>
                                         <span className="text-base font-black text-[var(--text-primary)]">
                                            {details.power !== null ? details.power : '—'}
                                         </span>
                                      </div>
                                      <div className="text-center">
                                         <span className="text-[9px] font-black uppercase text-[var(--text-muted)] block mb-0.5">ACC</span>
                                         <span className="text-base font-black text-[var(--text-primary)]">
                                            {details.accuracy !== null ? details.accuracy : '—'}
                                         </span>
                                      </div>
                                   </div>
                                )}
                             </div>
                          );
                       })}
                       {filteredMoves.length === 0 && (
                          <div className="py-20 text-center space-y-4 bg-[var(--bg-card)]/30 rounded-[32px] border border-dashed border-[var(--border-subtle)]">
                             <div className="w-12 h-12 border-2 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin mx-auto"></div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">No archives found in this sector</p>
                          </div>
                       )}
                    </div>
                    {filteredMoves.length > 50 && (
                       <p className="text-center text-[9px] font-black uppercase text-[var(--text-muted)] opacity-40 italic">Truncating sector at 50 nodes for performance...</p>
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
