import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { pokemonApi } from '../../api/pokemonApi';
import type { Pokemon } from '../../types/pokemon';
import { twMerge } from 'tailwind-merge';

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

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight mb-1">Pokédex <span className="text-[var(--accent-primary)]">Explorer</span></h1>
           <p className="text-[var(--text-muted)] text-sm font-medium">Syncing with PokéAPI. Over 1000 species indexed.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
            <input 
              type="text"
              placeholder="Enter name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:border-[var(--accent-primary)]/30 focus:ring-2 focus:ring-[var(--accent-primary)]/5 transition-all"
            />
          </div>
          <button className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
           <div className="w-14 h-14 border-4 border-[var(--border-subtle)] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
           <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] animate-pulse">Scanning Bio-database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {pokemonList.map((p) => (
            <div 
              key={p.id}
              className="group bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-5 rounded-2xl hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-card)] transition-all cursor-pointer relative overflow-hidden active:scale-95 shadow-sm hover:shadow-xl"
            >
               <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 bg-[var(--accent-primary)]/10 rounded-lg flex items-center justify-center text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all transform scale-50 group-hover:scale-100 duration-300">
                     <ArrowRight className="w-3 h-3" />
                  </div>
               </div>
               
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-24 h-24 relative">
                     <div className="absolute inset-0 bg-[var(--accent-primary)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent-primary)]/10 transition-all"></div>
                     <img 
                       src={p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default} 
                       alt={p.name}
                       className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-md"
                     />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[var(--accent-primary)]/40 block">#{p.id.toString().padStart(4, '0')}</span>
                    <h3 className="font-extrabold text-sm uppercase tracking-tight text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate px-1">
                      {p.name.replace('-', ' ')}
                    </h3>
                  </div>

                  <div className="flex gap-1.5 justify-center">
                    {p.types.map((t) => (
                      <span 
                        key={t.type.name}
                        className={twMerge(
                          "text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md text-white/90 shadow-sm",
                          TYPE_COLORS[t.type.name] || 'bg-slate-600'
                        )}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          ))}
          {!loading && pokemonList.length === 0 && (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center opacity-30">
                  <Search className="w-6 h-6 text-[var(--text-muted)]" />
               </div>
               <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">No Pokémon found in this sector</span>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!searchTerm && (
        <div className="flex items-center justify-center gap-6 pt-16">
          <button 
            onClick={() => setOffset(Math.max(0, offset - LIMIT))} 
            disabled={offset === 0}
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 disabled:opacity-20 disabled:hover:text-[var(--text-muted)] disabled:hover:border-[var(--border-subtle)] transition-all shadow-sm"
          >
              <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-[9px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-1">Sector</span>
             <span className="text-lg font-black text-[var(--text-primary)]/70">
               {Math.floor(offset / LIMIT) + 1}
             </span>
          </div>
          <button onClick={() => setOffset(offset + LIMIT)} className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all shadow-sm">
              <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
