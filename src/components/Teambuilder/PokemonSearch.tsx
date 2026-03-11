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
      <div className="relative group p-[2px] bg-[var(--accent-primary)] rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors z-10">
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-primary)]" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="ENTER POKÉMON NAME..."
          className="w-full bg-[var(--bg-panel)] border-none rounded-[14px] py-4 pl-14 pr-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-0 text-sm font-extrabold uppercase tracking-widest"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]/60 transition-colors z-10 pointer-events-none">
           <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[300px] z-[200] animate-in slide-in-from-top-3 duration-300 scrollbar-hide">
          {suggestions.map((name) => (
            <button
              key={name}
              onMouseDown={(e) => {
                e.preventDefault(); 
                handleSelect(name);
              }}
              className="w-full text-center px-6 py-4 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all capitalize font-black tracking-widest text-[11px] border-b border-[var(--border-subtle)]/50 last:border-0 group relative"
            >
              <span className="relative z-10">{name.replace('-', ' ')}</span>
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
