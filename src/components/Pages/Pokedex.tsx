import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { pokemonApi } from '../../api/pokemonApi';
import type { Pokemon } from '../../types/pokemon';
import { twMerge } from 'tailwind-merge';
import { PokedexEntry } from './PokedexEntry';

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-400',
  fighting: 'bg-orange-700', poison: 'bg-purple-500', ground: 'bg-amber-600',
  flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-stone-600', ghost: 'bg-violet-700', dragon: 'bg-indigo-700',
  dark: 'bg-neutral-800', steel: 'bg-slate-400', fairy: 'bg-rose-400',
};

export const Pokedex: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 30;

  const observerTarget = useRef<HTMLDivElement>(null);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    gen: '',
    ability: ''
  });
  const [allAbilities, setAllAbilities] = useState<string[]>([]);
  const [abilitySearchTerm, setAbilitySearchTerm] = useState('');
  const [abilitySuggestions, setAbilitySuggestions] = useState<string[]>([]);

  // Constants
  const GENERATIONS = [
    { label: 'Gen 1', value: '1' },
    { label: 'Gen 2', value: '2' },
    { label: 'Gen 3', value: '3' },
    { label: 'Gen 4', value: '4' },
    { label: 'Gen 5', value: '5' },
    { label: 'Gen 6', value: '6' },
    { label: 'Gen 7', value: '7' },
    { label: 'Gen 8', value: '8' },
    { label: 'Gen 9', value: '9' },
  ];

  const TYPES = Object.keys(TYPE_COLORS);

  // Interaction State
  const [quickInfoId, setQuickInfoId] = useState<number | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchAbilities = async () => {
      const abilities = await pokemonApi.getAllAbilities();
      setAllAbilities(abilities);
    };
    fetchAbilities();
  }, []);

  useEffect(() => {
    if (abilitySearchTerm.trim()) {
      const suggestions = allAbilities.filter(a => 
        a.toLowerCase().includes(abilitySearchTerm.toLowerCase())
      ).slice(0, 5);
      setAbilitySuggestions(suggestions);
    } else {
      setAbilitySuggestions([]);
    }
  }, [abilitySearchTerm, allAbilities]);

  useEffect(() => {
    const fetchList = async () => {
      // If it's the first page or filters changed, use full loading state
      const isReset = offset === 0;
      if (isReset) {
        setLoading(true);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      try {
        const isFilterActive = filters.type || filters.gen || filters.ability || searchTerm.trim();
        let targetNames: string[] = [];

        if (isFilterActive) {
          let nameLists: string[][] = [];

          // 1. Name search
          if (searchTerm.trim()) {
            const allNames = await pokemonApi.getAllPokemonNames();
            const filteredByName = allNames.filter(name => 
              name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              name === searchTerm
            );
            nameLists.push(filteredByName);
          }

          // 2. Type filter
          if (filters.type) {
            const byType = await pokemonApi.getPokemonByType(filters.type);
            nameLists.push(byType);
          }

          // 3. Gen filter
          if (filters.gen) {
            const byGen = await pokemonApi.getPokemonByGeneration(filters.gen);
            nameLists.push(byGen);
          }

          // 4. Ability filter
          if (filters.ability) {
            const byAbility = await pokemonApi.getPokemonByAbility(filters.ability);
            nameLists.push(byAbility);
          }

          if (nameLists.length > 0) {
            targetNames = nameLists.reduce((acc, list) => 
               acc.filter(name => list.includes(name))
            );
          }
        } else {
          // Default list fetch logic (now using cached names)
          targetNames = await pokemonApi.getAllPokemonNames();
        }

        // Paginate and fetch details
        const paginatedNames = targetNames.slice(offset, offset + LIMIT);
        
        if (paginatedNames.length === 0) {
          setHasMore(false);
          if (isReset) setPokemonList([]);
        } else {
          const details = await Promise.all(
            paginatedNames.map(name => pokemonApi.getPokemon(name))
          );
          
          setPokemonList(prev => isReset ? details : [...prev, ...details]);
          setHasMore(targetNames.length > offset + LIMIT);
        }
      } catch (e) {
        console.error(e);
        if (offset === 0) setPokemonList([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    
    // De-bounce only on initial resets/search changes
    if (offset === 0) {
      const timer = setTimeout(fetchList, 500);
      return () => clearTimeout(timer);
    } else {
      fetchList();
    }
  }, [searchTerm, filters, offset]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setOffset(prev => prev + LIMIT);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore]);

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700 pb-20 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight mb-1">Pokédex <span className="text-[var(--accent-primary)]">Explorer</span></h1>
           <p className="text-[var(--text-muted)] text-sm font-medium">Synced with PokéAPI Archive. Deep Species Index.</p>
        </div>
        
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
              <input 
                type="text"
                placeholder="SCAN NAME OR ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOffset(0); // Reset pagination on search
                }}
                className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl py-4 pl-12 pr-4 text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)] uppercase placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:border-[var(--accent-primary)]/30 focus:ring-4 focus:ring-[var(--accent-primary)]/5 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={twMerge(
                "p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all shadow-sm",
                isFilterOpen && "border-[var(--accent-primary)]/30 text-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Expandable Filter Panel */}
          <div className={twMerge(
            "w-full transition-all duration-300 ease-in-out",
            isFilterOpen ? "max-h-[1000px] opacity-100 mt-2 visible" : "max-h-0 opacity-0 invisible overflow-hidden"
          )}>
            <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-xl relative overflow-visible">
              {/* Type Dropdown */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => {
                    setFilters(f => ({ ...f, type: e.target.value }));
                    setOffset(0);
                  }}
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-3 text-[10px] font-bold text-[var(--text-primary)] uppercase outline-none focus:border-[var(--accent-primary)]/40 transition-colors"
                >
                  <option value="">Any Type</option>
                  {TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Gen Dropdown */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Generation</label>
                <select 
                  value={filters.gen}
                  onChange={(e) => {
                    setFilters(f => ({ ...f, gen: e.target.value }));
                    setOffset(0);
                  }}
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-3 text-[10px] font-bold text-[var(--text-primary)] uppercase outline-none focus:border-[var(--accent-primary)]/40 transition-colors"
                >
                  <option value="">Any Gen</option>
                  {GENERATIONS.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Ability Search */}
              <div className="space-y-2 relative">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Ability</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="SCAN ABILITY..."
                    value={filters.ability || abilitySearchTerm}
                    onChange={(e) => {
                      setAbilitySearchTerm(e.target.value);
                      if (filters.ability) setFilters(f => ({ ...f, ability: '' }));
                    }}
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-3 text-[10px] font-bold text-[var(--text-primary)] uppercase outline-none focus:border-[var(--accent-primary)]/40 transition-colors"
                  />
                  {abilitySuggestions.length > 0 && !filters.ability && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-2xl z-[200] overflow-hidden">
                      {abilitySuggestions.map(s => (
                        <button 
                          key={s}
                          onClick={() => {
                            setFilters(f => ({ ...f, ability: s }));
                            setAbilitySearchTerm(s);
                            setAbilitySuggestions([]);
                            setOffset(0);
                          }}
                          className="w-full p-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors border-b border-[var(--border-subtle)] last:border-0"
                        >
                          {s.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                  {filters.ability && (
                    <button 
                      onClick={() => {
                        setFilters(f => ({ ...f, ability: '' }));
                        setAbilitySearchTerm('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent-primary)] hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Reset Filters */}
              {(filters.type || filters.gen || filters.ability) && (
                <div className="sm:col-span-3 flex justify-end">
                  <button 
                    onClick={() => {
                      setFilters({ type: '', gen: '', ability: '' });
                      setAbilitySearchTerm('');
                      setOffset(0);
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-primary)] hover:underline"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
           <div className="w-14 h-14 border-4 border-[var(--border-subtle)] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">Accessing Archive Data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {pokemonList.map((p) => {
            const isHovered = quickInfoId === p.id;
            return (
              <div 
                key={p.id}
                onClick={() => setSelectedPokemon(p)}
                onMouseEnter={() => setQuickInfoId(p.id)}
                onMouseLeave={() => setQuickInfoId(null)}
                className={twMerge(
                  "group bg-[var(--bg-panel)] border transition-all duration-500 cursor-pointer relative overflow-hidden active:scale-95 shadow-sm rounded-[32px] p-6 flex flex-col items-center gap-4 min-h-[280px]",
                  isHovered ? "border-[var(--accent-primary)] bg-[var(--bg-card)] shadow-2xl -translate-y-2" : "border-[var(--border-subtle)] hover:bg-[var(--bg-card)]"
                )}
              >
                  {/* Default Content (Visible when NOT hovered) */}
                  <div className={twMerge(
                    "w-full flex flex-col items-center gap-4 transition-all duration-500",
                    isHovered ? "opacity-0 -translate-y-8 pointer-events-none scale-90" : "opacity-100 translate-y-0"
                  )}>
                    <div className="w-24 h-24 relative">
                        <div className="absolute inset-0 rounded-full blur-2xl bg-[var(--accent-primary)]/5 transition-all group-hover:bg-[var(--accent-primary)]/20 group-hover:scale-125"></div>
                        <img 
                          src={p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default} 
                          alt={p.name}
                          className="w-full h-full object-contain relative z-10 transition-transform duration-500 drop-shadow-xl group-hover:scale-110"
                        />
                    </div>
                    
                    <div className="text-center space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)]/40 block">#{p.id.toString().padStart(4, '0')}</span>
                      <h3 className="font-black text-xs uppercase tracking-tight text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate px-1">
                        {p.name.replace('-', ' ')}
                      </h3>
                    </div>

                    <div className="flex gap-1.5 justify-center">
                      {p.types.map((t) => (
                        <span 
                          key={t.type.name}
                          className={twMerge(
                            "text-[7px] font-black uppercase px-2 py-1 rounded-lg text-white/90 shadow-sm",
                            TYPE_COLORS[t.type.name] || 'bg-slate-600'
                          )}
                        >
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Content (Visible when hovered) */}
                  <div className={twMerge(
                    "absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 bg-[var(--bg-card)]",
                    isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 pointer-events-none scale-110"
                  )}>
                    <div className="space-y-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {[0, 1, 2, 5].map(idx => (
                          <div key={idx} className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-1.5">
                            <span>{['HP', 'ATK', 'DEF', 'SPD', 'SPD', 'SPD'][idx]}</span>
                            <span className="text-[var(--text-primary)] text-sm">{p.stats[idx].base_stat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Abilities */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]/60 block">Abilities</span>
                        <div className="flex flex-wrap gap-2">
                          {p.abilities.map(a => (
                            <span key={a.ability.name} className="text-[10px] font-black uppercase py-1.5 px-3 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] shadow-sm">
                              {a.ability.name.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Listener & Status */}
      <div ref={observerTarget} className="w-full h-20 flex items-center justify-center mt-10">
        {loadingMore && (
           <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] animate-pulse">Syncing Next Sector...</span>
           </div>
        )}
        {!hasMore && pokemonList.length > 0 && (
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-50">
            — End of Archive Reach —
          </span>
        )}
      </div>

      {/* Full Pokedex Entry Viewer */}
      {selectedPokemon && (
        <PokedexEntry 
          pokemon={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)} 
        />
      )}
    </div>
  );
};
