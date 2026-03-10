import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { pokemonApi } from '../../api/pokemonApi';
import { useTeamStore } from '../../store/useTeamStore';

export const PokemonSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { addMember, activeMemberIndex } = useTeamStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const names = await pokemonApi.getAllPokemonNames();
        setAllNames(names);
      } catch (error) {
        console.error('Failed to fetch pokemon names', error);
      }
    };
    fetchNames();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const filtered = allNames
      .filter(name => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
    setSuggestions(filtered);
  }, [query, allNames]);

  const handleSelect = async (name: string) => {
    setLoading(true);
    try {
      const pokemon = await pokemonApi.getPokemon(name);
      addMember(activeMemberIndex, pokemon);
      setQuery('');
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to fetch pokemon details', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg animate-in fade-in slide-in-from-top-4 duration-700" ref={containerRef}>
      <div className="relative group p-1 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors z-10 transition-transform group-focus-within:scale-125 duration-500">
          {loading ? <Loader2 className="w-6 h-6 animate-spin text-red-600" /> : <Search className="w-6 h-6 group-focus-within:rotate-90 transition-transform" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="ENTER POKÉMON NAME..."
          className="w-full bg-white border-none rounded-[22px] py-5 pl-16 pr-12 text-slate-900 placeholder:text-slate-200 focus:outline-none focus:ring-0 text-sm font-black italic uppercase tracking-widest shadow-inner overflow-hidden"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-red-600/10 group-hover:text-red-600 transition-colors z-10 pointer-events-none">
           <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white border-2 border-red-600/10 rounded-[32px] shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-3 duration-300">
          {suggestions.map((name) => (
            <button
              key={name}
              onMouseDown={(e) => {
                e.preventDefault(); 
                handleSelect(name);
              }}
              className="w-full text-left px-8 py-5 text-slate-500 hover:bg-orange-500 hover:text-white transition-all capitalize font-black italic tracking-widest text-[11px] border-b border-slate-50 last:border-0 group flex items-center justify-between"
            >
              <span className="group-hover:translate-x-3 transition-transform">{name.replace('-', ' ')}</span>
              <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-opacity"></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
