import React from 'react';
import type { PokemonType } from '../../types/pokemon';
import { TYPE_DESCRIPTIONS, TYPE_CHART } from '../../logic/typeCalc';
import { twMerge } from 'tailwind-merge';

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-400',
  fighting: 'bg-orange-700', poison: 'bg-purple-500', ground: 'bg-amber-600',
  flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-stone-600', ghost: 'bg-violet-700', dragon: 'bg-indigo-700',
  dark: 'bg-neutral-800', steel: 'bg-slate-400', fairy: 'bg-rose-400',
};

interface TypeChartProps {
  types: PokemonType[];
}

export const TypeChart: React.FC<TypeChartProps> = ({ types }) => {
  const getMultipliers = () => {
    const multipliers: Record<string, number> = {};
    const allTypes = Object.keys(TYPE_CHART) as PokemonType[];

    allTypes.forEach((attacker) => {
      let totalMult = 1;
      types.forEach((defender) => {
        totalMult *= (TYPE_CHART[attacker]?.[defender] ?? 1);
      });
      multipliers[attacker] = totalMult;
    });

    return multipliers;
  };

  const mults = getMultipliers();
  const weaknesses = Object.entries(mults).filter(([_, m]) => m > 1);
  const resistances = Object.entries(mults).filter(([_, m]) => m < 1 && m > 0);
  const immunities = Object.entries(mults).filter(([_, m]) => m === 0);

  const Group: React.FC<{ title: string; items: [string, number][]; descKey: string }> = ({ title, items, descKey }) => {
    if (items.length === 0 && title !== "Weaknesses") return null;

    return (
      <div className="space-y-4">
        <div className="group/title relative inline-block">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-l-4 border-orange-500 pl-3 cursor-help transition-colors hover:text-orange-600">
            {title}
          </h4>
          <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-slate-950 text-white text-[10px] uppercase font-bold tracking-widest rounded-xl opacity-0 translate-y-2 pointer-events-none group-hover/title:opacity-100 group-hover/title:translate-y-0 transition-all z-50 border border-orange-500/30 shadow-2xl">
            {TYPE_DESCRIPTIONS[descKey]}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map(([type, mult]) => (
            <div key={type} className="group/type relative">
              <div className={twMerge(
                "px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-sm transition-transform hover:scale-110",
                TYPE_COLORS[type]
              )}>
                <span className="text-[9px] font-black uppercase text-white tracking-widest">{type}</span>
                {mult !== 1 && (
                  <span className="text-[9px] font-black text-white/60 bg-black/20 px-1.5 rounded-md italic">
                    x{mult}
                  </span>
                )}
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-slate-950 text-white text-[9px] uppercase font-bold tracking-tight rounded-lg opacity-0 translate-y-1 pointer-events-none group-hover/type:opacity-100 group-hover/type:translate-y-0 transition-all z-50 border border-white/10 text-center">
                {TYPE_DESCRIPTIONS[type]}
              </div>
            </div>
          ))}
          {items.length === 0 && <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest italic opacity-50">None</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="group/main relative inline-block">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-800 italic border-b-4 border-orange-500 pb-2 cursor-help">
          Type Chart Analysis
        </h3>
        <div className="absolute bottom-full left-0 mb-4 w-64 p-4 bg-slate-950 text-white text-[11px] uppercase font-black tracking-widest rounded-2xl opacity-0 translate-y-4 pointer-events-none group-hover/main:opacity-100 group-hover/main:translate-y-0 transition-all z-50 border-2 border-orange-500/50 shadow-2xl leading-relaxed">
           {TYPE_DESCRIPTIONS.typechart}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Group title="Weaknesses" items={weaknesses as any} descKey="weakness" />
        <Group title="Resistances" items={resistances as any} descKey="resistance" />
        <Group title="Immunities" items={immunities as any} descKey="immunity" />
      </div>
    </div>
  );
};
