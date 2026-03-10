import React, { useState, useEffect } from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { Zap, BarChart3, Fingerprint, Swords, Info } from 'lucide-react';
import type { PokemonType } from '../../types/pokemon';
import { getDefensiveCoverage, TYPE_DESCRIPTIONS } from '../../logic/typeCalc';
import { pokemonApi } from '../../api/pokemonApi';

const TYPE_COLORS: Record<PokemonType, string> = {
  normal: 'bg-gray-400', fire: 'bg-orange-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-300',
  fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-700',
  flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-700', dragon: 'bg-indigo-600',
  dark: 'bg-gray-700', steel: 'bg-slate-400', fairy: 'bg-pink-300'
};

const Tooltip: React.FC<{ title: string; text: string; children: React.ReactNode }> = ({ title, text, children }) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <div 
      className="relative group cursor-help inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] w-max max-w-[200px] animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">{title}</h4>
            <p className="text-[11px] font-medium leading-normal text-slate-300 normal-case">{text}</p>
          </div>
          <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-800 rotate-45 mx-auto -mt-1.5"></div>
        </div>
      )}
    </div>
  );
};

export const PokemonDetail: React.FC = () => {
  const { getActiveTeam, activeMemberIndex } = useTeamStore();
  const members = getActiveTeam().members;
  const selectedMember = members[activeMemberIndex];
  const pokemon = selectedMember?.pokemon;
  const [abilityDesc, setAbilityDesc] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pokemon) {
      pokemon.abilities.forEach(a => {
        if (!abilityDesc[a.ability.name]) {
          pokemonApi.getAbilityDescription(a.ability.name).then(desc => {
            setAbilityDesc(prev => ({ ...prev, [a.ability.name]: desc }));
          });
        }
      });
    }
  }, [pokemon]);

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
  const x4Weak = Object.entries(coverage).filter(([_, mult]) => mult === 4);
  const x2Weak = Object.entries(coverage).filter(([_, mult]) => mult === 2);
  const x05Resist = Object.entries(coverage).filter(([_, mult]) => mult === 0.5);
  const x025Resist = Object.entries(coverage).filter(([_, mult]) => mult === 0.25);
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
                <Tooltip key={t.type.name} title={t.type.name} text={TYPE_DESCRIPTIONS[t.type.name]}>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${TYPE_COLORS[t.type.name]}`}>
                    {t.type.name}
                  </span>
                </Tooltip>
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
                  <Tooltip title="Abilities" text={TYPE_DESCRIPTIONS.ability}>
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 group">
                      Abilities <Info className="w-3 h-3 text-slate-600 group-hover:text-amber-400" />
                    </span>
                  </Tooltip>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((a) => (
                    <Tooltip key={a.ability.name} title={a.ability.name.replace('-', ' ')} text={abilityDesc[a.ability.name] || "Loading effect..."}>
                      <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 capitalize border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all">
                        {a.ability.name.replace('-', ' ')}
                      </span>
                    </Tooltip>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-4 text-purple-400">
                  <Swords className="w-5 h-5" />
                  <Tooltip title="Type Chart" text={TYPE_DESCRIPTIONS.typechart}>
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 group">
                      Type Chart <Info className="w-3 h-3 text-slate-600 group-hover:text-purple-400" />
                    </span>
                  </Tooltip>
                </div>
                
                <div className="space-y-4">
                  {(x4Weak.length > 0 || x2Weak.length > 0) && (
                    <div className="space-y-3">
                      <Tooltip title="Weakness" text={TYPE_DESCRIPTIONS.weakness}>
                        <span className="text-[10px] uppercase font-bold text-red-500 flex items-center gap-1 group mb-2">
                          Weaknesses <Info className="w-3 h-3 text-slate-600 group-hover:text-red-500" />
                        </span>
                      </Tooltip>
                      
                      <div className="space-y-2">
                        {x4Weak.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-2 border-l border-red-500/10">
                            <span className="text-[8px] uppercase font-black text-red-600 w-full mb-1">x4 Damage</span>
                            {x4Weak.map(([type]) => (
                              <Tooltip key={type} title={type} text={TYPE_DESCRIPTIONS[type]}>
                                <span className="bg-red-500/15 border border-red-500/30 text-red-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                  {type}
                                </span>
                              </Tooltip>
                            ))}
                          </div>
                        )}
                        {x2Weak.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-2 border-l border-red-500/10">
                            <span className="text-[8px] uppercase font-black text-red-400 w-full mb-1">x2 Damage</span>
                            {x2Weak.map(([type]) => (
                              <Tooltip key={type} title={type} text={TYPE_DESCRIPTIONS[type]}>
                                <span className="bg-red-500/10 border border-red-500/20 text-red-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                  {type}
                                </span>
                              </Tooltip>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(x05Resist.length > 0 || x025Resist.length > 0) && (
                    <div className="space-y-3">
                      <Tooltip title="Resistance" text={TYPE_DESCRIPTIONS.resistance}>
                        <span className="text-[10px] uppercase font-bold text-green-500 flex items-center gap-1 group mb-2">
                          Resistances <Info className="w-3 h-3 text-slate-600 group-hover:text-green-500" />
                        </span>
                      </Tooltip>

                      <div className="space-y-2">
                        {x05Resist.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-2 border-l border-green-500/10">
                            <span className="text-[8px] uppercase font-black text-green-400 w-full mb-1">x0.5 Damage</span>
                            {x05Resist.map(([type]) => (
                              <Tooltip key={type} title={type} text={TYPE_DESCRIPTIONS[type]}>
                                <span className="bg-green-500/10 border border-green-500/20 text-green-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                  {type}
                                </span>
                              </Tooltip>
                            ))}
                          </div>
                        )}
                        {x025Resist.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-2 border-l border-green-500/10">
                            <span className="text-[8px] uppercase font-black text-green-600 w-full mb-1">x0.25 Damage</span>
                            {x025Resist.map(([type]) => (
                              <Tooltip key={type} title={type} text={TYPE_DESCRIPTIONS[type]}>
                                <span className="bg-green-500/15 border border-green-500/30 text-green-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                  {type}
                                </span>
                              </Tooltip>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {immunities.length > 0 && (
                    <div className="space-y-2">
                      <Tooltip title="Immunity" text={TYPE_DESCRIPTIONS.immunity}>
                        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 group mb-2">
                          Immunities <Info className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                        </span>
                      </Tooltip>
                      <div className="flex flex-wrap gap-1.5 pl-2 border-l border-slate-800">
                        {immunities.map(([type]) => (
                          <Tooltip key={type} title={type} text={TYPE_DESCRIPTIONS[type]}>
                            <span className="bg-slate-800/80 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                              {type}
                            </span>
                          </Tooltip>
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
