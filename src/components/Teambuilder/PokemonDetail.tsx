import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Zap, BarChart3, Fingerprint, Swords } from 'lucide-react';
import type { PokemonType } from '../../types/pokemon';
import { getDefensiveCoverage } from '../../logic/typeCalc';

const TYPE_COLORS: Record<PokemonType, string> = {
  normal: 'bg-gray-400', fire: 'bg-orange-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-300',
  fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-700',
  flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-700', dragon: 'bg-indigo-600',
  dark: 'bg-gray-700', steel: 'bg-slate-400', fairy: 'bg-pink-300'
};

export const PokemonDetail: React.FC = () => {
  const { members, activeMemberIndex } = useTeamStore();
  const selectedMember = members[activeMemberIndex];
  const pokemon = selectedMember?.pokemon;

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-in fade-in duration-500">
        <div className="w-16 h-16 border-2 border-dashed border-slate-800 rounded-full flex items-center justify-center mb-4">
          <Fingerprint className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm font-medium">Select a slot to add a Pokémon</p>
      </div>
    );
  }

  const coverage = getDefensiveCoverage(pokemon.types.map(t => t.type.name));
  const weaknesses = Object.entries(coverage).filter(([_, mult]) => mult > 1);
  const resistances = Object.entries(coverage).filter(([_, mult]) => mult < 1 && mult > 0);
  const immunities = Object.entries(coverage).filter(([_, mult]) => mult === 0);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sprite & Identity */}
        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl group-hover:bg-cyan-500/30 transition-all rounded-full"></div>
            <img 
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform"
            />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white inline-flex items-center gap-3">
              <span className="text-slate-600 text-xl">#{pokemon.id.toString().padStart(3, '0')}</span>
              {pokemon.name.replace('-', ' ')}
            </h2>
            <div className="flex justify-center gap-2 mt-2">
              {pokemon.types.map((t) => (
                <span key={t.type.name} className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${TYPE_COLORS[t.type.name]}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats & Nerd Info */}
        <div className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Base Stats</span>
              </div>
              <div className="space-y-3">
                {pokemon.stats.map((s) => (
                  <div key={s.stat.name}>
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                      <span>{s.stat.name.replace('special-', 'sp. ')}</span>
                      <span className="text-slate-200">{s.base_stat}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                        style={{ width: `${(s.base_stat / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3 text-amber-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Abilities</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((a) => (
                    <span key={a.ability.name} className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 capitalize border border-slate-700">
                      {a.ability.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-4 text-purple-400">
                  <Swords className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Defensive Profile</span>
                </div>
                
                <div className="space-y-4">
                  {weaknesses.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-red-400 mb-2 block tracking-tight">Weaknesses (x2/x4)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {weaknesses.map(([type, mult]) => (
                          <span key={type} className="bg-red-500/10 border border-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {type} <span className="opacity-60">x{mult}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {resistances.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-green-400 mb-2 block tracking-tight">Resistances (x0.5/x0.25)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {resistances.map(([type, mult]) => (
                          <span key={type} className="bg-green-500/10 border border-green-500/20 text-green-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {type} <span className="opacity-60">x{mult}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {immunities.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 block tracking-tight">Immunities (x0)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {immunities.map(([type]) => (
                          <span key={type} className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
