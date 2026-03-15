import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, X, ChevronRight } from 'lucide-react';
import { pokemonApi } from '../../api/pokemonApi';

export const AbilitiesDex: React.FC = () => {
  const [abilities, setAbilities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 40;
  const [displayList, setDisplayList] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [abilityDetail, setAbilityDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const allNames = await pokemonApi.getAllAbilities();
      // Filter out weird internal ones if necessary
      setAbilities(allNames);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const filtered = abilities.filter(a => 
      a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayList(filtered.slice(0, offset + LIMIT));
    setHasMore(filtered.length > offset + LIMIT);
  }, [searchTerm, abilities, offset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setOffset(prev => prev + LIMIT);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleSelect = async (name: string) => {
    setSelectedAbility(name);
    setLoadingDetail(true);
    const detail = await pokemonApi.getAbility(name);
    setAbilityDetail(detail);
    setLoadingDetail(false);
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight mb-1">Ability <span className="text-amber-500">Archive</span></h1>
           <p className="text-[var(--text-muted)] text-sm font-medium">Neural Pathways & Combat Modifications. Passive Intelligence.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text"
            placeholder="SCAN TRAIT NAME..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOffset(0);
            }}
            className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl py-4 pl-12 pr-4 text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)] uppercase placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
           <div className="w-14 h-14 border-4 border-[var(--border-subtle)] border-t-amber-500 rounded-full animate-spin"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">Syncing Neural Nodes...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayList.map((a) => (
            <button
              key={a}
              onClick={() => handleSelect(a)}
              className="group p-6 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-3xl text-left hover:border-amber-500/40 hover:bg-[var(--bg-card)] transition-all duration-300 active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] transition-colors group-hover:text-amber-500">
                  {a.replace('-', ' ')}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      )}

      <div ref={observerTarget} className="h-10 invisible" />

      {/* Ability Detail Modal */}
      {selectedAbility && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-6 backdrop-blur-3xl bg-[var(--bg-main)]/60 animate-in fade-in duration-500"
          onClick={() => setSelectedAbility(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-[40px] shadow-2xl flex flex-col max-h-full sm:max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-500"
            onClick={(e) => e.stopPropagation()}
          >
             <button 
                onClick={() => setSelectedAbility(null)}
                className="absolute top-6 right-6 p-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-full text-[var(--text-muted)] hover:text-amber-500 transition-all z-50 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 sm:p-12 overflow-y-auto scrollbar-hide">
                 {loadingDetail ? (
                   <div className="py-20 flex flex-col items-center justify-center gap-6">
                      <div className="w-12 h-12 border-4 border-[var(--border-subtle)] border-t-amber-500 rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Decoding Synaptic Patterns...</span>
                   </div>
                 ) : abilityDetail && (
                   <div className="space-y-10 animate-in fade-in duration-500">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-lg border border-amber-500/20">
                               <Zap className="w-6 h-6" />
                            </div>
                            <div>
                               <span className="text-[10px] font-black text-amber-500/40 tracking-[0.3em] uppercase block">Combat Trait Archive</span>
                               <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">{abilityDetail.name.replace('-', ' ')}</h2>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 border-l-4 border-amber-500 pl-4">Tactical Breakdown</h3>
                         <div className="p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)]">
                            <p className="text-sm font-medium leading-[1.8] text-[var(--text-primary)]/80 italic">
                               {abilityDetail.effect_entries.find((e: any) => e.language.name === 'en')?.effect.replace(/\f/g, ' ') || "No field data available for this trait."}
                            </p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 border-l-4 border-amber-500 pl-4">Genetic Carriers</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {abilityDetail.pokemon.map((p: any) => (
                               <div key={p.pokemon.name} className="p-3 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl text-center flex flex-col gap-1 group hover:border-amber-500/30 transition-colors">
                                  <span className="text-[10px] font-black uppercase text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">{p.pokemon.name.replace('-', ' ')}</span>
                                  {p.is_hidden && <span className="text-[7px] font-black uppercase text-amber-500 shadow-amber-500/20">Hidden Node</span>}
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
