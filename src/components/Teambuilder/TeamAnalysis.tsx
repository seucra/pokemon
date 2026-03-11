import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { getTeamCoverage } from '../../logic/typeCalc';
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TYPE_BG_COLORS: Record<string, string> = {
  normal: 'from-gray-400 to-gray-500',
  fire: 'from-red-500 to-orange-500',
  water: 'from-blue-500 to-blue-600',
  electric: 'from-yellow-400 to-amber-500',
  grass: 'from-green-500 to-emerald-600',
  ice: 'from-cyan-300 to-cyan-500',
  fighting: 'from-orange-700 to-red-700',
  poison: 'from-purple-500 to-purple-700',
  ground: 'from-amber-600 to-yellow-700',
  flying: 'from-indigo-400 to-blue-400',
  psychic: 'from-pink-500 to-rose-500',
  bug: 'from-lime-500 to-green-600',
  rock: 'from-stone-500 to-stone-700',
  ghost: 'from-violet-600 to-purple-800',
  dragon: 'from-indigo-600 to-violet-700',
  dark: 'from-neutral-700 to-neutral-900',
  steel: 'from-slate-400 to-slate-600',
  fairy: 'from-pink-400 to-rose-400',
};

const RingGauge: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.abs(score), maxScore);
  const fillPercent = normalizedScore / maxScore;
  const offset = circumference - (fillPercent * circumference);
  
  const isPositive = score > 0;
  const isNegative = score < 0;
  const strokeColor = isPositive ? '#22c55e' : isNegative ? '#ef4444' : 'var(--text-muted)';
  const glowColor = isPositive ? 'rgba(34,197,94,0.3)' : isNegative ? 'rgba(239,68,68,0.3)' : 'transparent';

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--text-muted)" strokeWidth="4" className="opacity-10" />
        <circle 
          cx="32" cy="32" r={radius} fill="none" 
          stroke={strokeColor} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-ring-fill transition-all duration-1000"
          style={{ 
            '--ring-circumference': circumference,
            '--ring-offset': offset,
            filter: `drop-shadow(0 0 6px ${glowColor})`
          } as React.CSSProperties}
        />
      </svg>
      <span className={`absolute text-sm font-black ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
        {score > 0 ? `+${score}` : score}
      </span>
    </div>
  );
};

export const TeamAnalysis: React.FC = () => {
  const members = useTeamStore((state) => state.getActiveTeam().members);
  
  const teamTypes = members
    .filter((m) => m && m.pokemon)
    .map((m) => m!.pokemon!.types.map((t) => t.type.name));

  if (teamTypes.length === 0) return null;

  const coverage = getTeamCoverage(teamTypes);
  const maxScore = Math.max(...coverage.map(c => Math.abs(c.resist + c.immune - c.weak)), 1);

  return (
    <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[32px] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000 shadow-sm">
      <div className="relative px-8 py-8 border-b border-[var(--border-subtle)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent-primary)]/40 via-[var(--accent-secondary)]/20 to-transparent"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/80 rounded-2xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]/95 uppercase">Defensive Strategy</h2>
              <p className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-[var(--text-muted)] mt-0.5">Tactical Type Matrix</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 text-[10px] font-extrabold uppercase tracking-[0.15em]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500/70">Strong</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-500/70">Weak</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="text-[var(--text-muted)]/70">Neutral</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {coverage.map((item) => {
            const score = item.resist + item.immune - item.weak;
            const isPositive = score > 0;
            const isNegative = score < 0;
            
            return (
              <div 
                key={item.type} 
                className="group relative flex flex-col items-center rounded-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:z-10 cursor-default shadow-sm hover:shadow-xl"
              >
                <div className={`w-full bg-gradient-to-br ${TYPE_BG_COLORS[item.type] || 'from-gray-500 to-gray-600'} rounded-t-2xl px-3 py-2 text-center`}>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white drop-shadow-sm">
                    {item.type}
                  </span>
                </div>

                <div className={`w-full rounded-b-2xl px-3 py-4 flex flex-col items-center border border-t-0 transition-colors ${
                  isPositive 
                    ? 'bg-green-500/[0.04] border-green-500/20' 
                    : isNegative 
                    ? 'bg-red-500/[0.04] border-red-500/20' 
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)]'
                }`}>
                  <RingGauge score={score} maxScore={maxScore} />
                </div>

                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-2xl">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent-primary)] mb-3 text-center">{item.type}</div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-green-500">Resist / Immune</span>
                        <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">{item.resist + item.immune}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(((item.resist + item.immune) / 6) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-red-500">Weakness</span>
                        <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">{item.weak}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-500" style={{ width: `${Math.min((item.weak / 6) * 100, 100)}%` }}></div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Net Score</span>
                      <span className={`text-sm font-black ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                        {score > 0 ? `+${score}` : score}
                      </span>
                    </div>

                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-card)] border-r border-b border-[var(--border-subtle)] rotate-45"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
