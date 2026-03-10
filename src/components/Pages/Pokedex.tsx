import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b-4 border-slate-950/5">
        <div>
           <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Pokédex <span className="text-red-600">Explorer</span></h1>
           <p className="text-slate-500 text-sm font-medium tracking-wide">Syncing with PokeAPI. Over 1000 species indexed.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              type="text"
              placeholder="Enter name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-3xl py-4 pl-14 pr-4 text-sm font-bold focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all shadow-sm"
            />
          </div>
          <button className="p-4 bg-white border-2 border-slate-200 rounded-3xl text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
           <div className="w-16 h-16 border-8 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
           <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Scanning Bio-database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {pokemonList.map((p) => (
            <div 
              key={p.id}
              className="group bg-white border-2 border-slate-100 p-6 rounded-[32px] hover:border-red-600/40 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden active:scale-95 shadow-sm"
            >
               <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all transform scale-50 group-hover:scale-100 duration-300">
                     <ArrowRightIcon className="w-4 h-4" />
                  </div>
               </div>
               
               <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-28 h-28 relative">
                     <div className="absolute inset-0 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>
                     <img 
                       src={p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default} 
                       alt={p.name}
                       className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-md"
                     />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 italic block mb-1 opacity-60">#{p.id.toString().padStart(4, '0')}</span>
                    <h3 className="font-black text-sm uppercase tracking-tight group-hover:text-red-600 transition-colors truncate px-1 italic">
                      {p.name.replace('-', ' ')}
                    </h3>
                  </div>

                  <div className="flex gap-1.5 justify-center">
                    {p.types.map((t) => (
                      <span 
                        key={t.type.name}
                        className={twMerge(
                          "text-[9px] font-black uppercase px-2.5 py-1 rounded-lg text-white/95 shadow-sm",
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
            <div className="col-span-full py-40 text-center flex flex-col items-center gap-4">
               <div className="w-20 h-20 bg-slate-50 border-4 border-slate-100/50 rounded-full flex items-center justify-center opacity-30">
                  <Search className="w-8 h-8" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">No Pokémon found in this sector</span>
            </div>
          )}
        </div>
      )}

      {/* Pagination View */}
      {!searchTerm && (
        <div className="flex items-center justify-center gap-6 pt-20">
          <button 
            onClick={() => setOffset(Math.max(0, offset - LIMIT))} 
            disabled={offset === 0}
            className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-500 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 shadow-sm transition-all"
          >
              <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-xs font-black uppercase tracking-widest text-slate-300 mb-1">Sector</span>
             <span className="text-lg font-black text-slate-800 italic">
               {Math.floor(offset / LIMIT) + 1}
             </span>
          </div>
          <button onClick={() => setOffset(offset + LIMIT)} className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-500 shadow-sm transition-all">
              <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
