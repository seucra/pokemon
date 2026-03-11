import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Maximize2, ArrowRight } from 'lucide-react';
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
  const [offset, setOffset] = useState(0);
  const LIMIT = 30;

  // Interaction State
  const [quickInfoId, setQuickInfoId] = useState<number | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const lastClickTime = useRef<number>(0);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        if (searchTerm.trim()) {
           const p = await pokemonApi.getPokemon(searchTerm.toLowerCase());
           setPokemonList([p]);
        } else {
           const list = await pokemonApi.getPokedexList(offset, LIMIT);
           setPokemonList(list);
        }
      } catch (e) {
        setPokemonList([]);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(fetchList, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, offset]);

  const handlePokeInteraction = (p: Pokemon) => {
    const now = Date.now();
    const isDoubleClick = now - lastClickTime.current < 300;
    lastClickTime.current = now;

    if (isDoubleClick) {
      setSelectedPokemon(p);
      setQuickInfoId(null);
    } else {
      setQuickInfoId(quickInfoId === p.id ? null : p.id);
    }
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700 pb-20 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight mb-1">Pokédex <span className="text-[var(--accent-primary)]">Explorer</span></h1>
           <p className="text-[var(--text-muted)] text-sm font-medium">Synced with PokéAPI Archive. Deep Species Index.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
            <input 
              type="text"
              placeholder="SCAN NAME OR ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl py-4 pl-12 pr-4 text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)] uppercase placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:border-[var(--accent-primary)]/30 focus:ring-4 focus:ring-[var(--accent-primary)]/5 transition-all"
            />
          </div>
          <button className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
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
                onClick={() => handlePokeInteraction(p)}
                onDoubleClick={() => setSelectedPokemon(p)}
                onMouseEnter={() => setQuickInfoId(p.id)}
                onMouseLeave={() => setQuickInfoId(null)}
                className={twMerge(
                  "group bg-[var(--bg-panel)] border transition-all cursor-pointer relative overflow-visible active:scale-95 shadow-sm rounded-[32px] p-6 flex flex-col items-center gap-4",
                  isHovered ? "border-[var(--accent-primary)] bg-[var(--bg-card)] shadow-2xl -translate-y-2 z-50" : "border-[var(--border-subtle)] hover:bg-[var(--bg-card)]"
                )}
              >
                 {/* Quick Info Overlay */}
                 <div className={twMerge(
                   "absolute bottom-[80%] left-0 right-0 mb-4 transition-all duration-300 pointer-events-none z-[100]",
                   isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                 )}>
                    <div className="bg-[var(--bg-card)] border border-[var(--accent-primary)]/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl pointer-events-auto">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)]">Biological Specs</span>
                          <Maximize2 className="w-3 h-3 text-[var(--accent-primary)]/40" />
                       </div>
                       <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                             <span>HP</span>
                             <span className="text-[var(--text-primary)]">{p.stats[0].base_stat}</span>
                          </div>
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                             <span>ATK</span>
                             <span className="text-[var(--text-primary)]">{p.stats[1].base_stat}</span>
                          </div>
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                             <span>DEF</span>
                             <span className="text-[var(--text-primary)]">{p.stats[2].base_stat}</span>
                          </div>
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                             <span>SPD</span>
                             <span className="text-[var(--text-primary)]">{p.stats[5].base_stat}</span>
                          </div>
                       </div>
                       
                       <button 
                         onClick={(e) => { e.stopPropagation(); setSelectedPokemon(p); }}
                         className="w-full mt-4 py-2 bg-[var(--accent-primary)] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                       >
                          Open Archive <ArrowRight className="w-3 h-3" />
                       </button>
                    </div>
                 </div>

                 {/* Card Content */}
                 <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-[var(--accent-primary)]/40" />
                 </div>
                 
                 <div className="w-24 h-24 relative">
                    <div className={twMerge(
                      "absolute inset-0 rounded-full blur-2xl transition-all",
                      isHovered ? "bg-[var(--accent-primary)]/20 scale-125" : "bg-[var(--accent-primary)]/5"
                    )}></div>
                    <img 
                      src={p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default} 
                      alt={p.name}
                      className={twMerge(
                        "w-full h-full object-contain relative z-10 transition-transform duration-500 drop-shadow-xl",
                        isHovered ? "scale-125 -rotate-6" : "group-hover:scale-110"
                      )}
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
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!searchTerm && !loading && (
        <div className="flex items-center justify-center gap-6 pt-16">
          <button 
            onClick={() => setOffset(Math.max(0, offset - LIMIT))} 
            disabled={offset === 0}
            className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 disabled:opacity-20 disabled:hover:text-[var(--text-muted)] disabled:hover:border-[var(--border-subtle)] transition-all shadow-sm"
          >
              <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Sector</span>
             <span className="text-xl font-black text-[var(--accent-primary)]">
               {Math.floor(offset / LIMIT) + 1}
             </span>
          </div>
          <button onClick={() => setOffset(offset + LIMIT)} className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all shadow-sm">
              <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

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
