import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { pokemonApi } from '../../api/pokemonApi';
import { useTeamStore } from '../../store/useTeamStore';

export const PokemonSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [allNames, setAllNames] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const addMember = useTeamStore((state) => state.addMember);
  const activeIndex = useTeamStore((state) => state.activeMemberIndex);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pokemonApi.getAllPokemonNames().then(setAllNames);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = allNames
        .filter(name => name.includes(query.toLowerCase()))
        .slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, allNames]);

  const handleSelect = async (name: string) => {
    setIsLoading(true);
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);
    
    try {
      const pokemon = await pokemonApi.getPokemon(name);
      addMember(activeIndex, pokemon);
    } catch (error) {
      console.error("Failed to fetch pokemon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-slate-500" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a Pokémon..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-slate-200"
        />
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden z-[60] shadow-2xl">
          {suggestions.map((name, index) => (
            <button
              key={`${name}-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(name);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors capitalize text-slate-300 hover:text-cyan-400 font-medium"
            >
              {name.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
