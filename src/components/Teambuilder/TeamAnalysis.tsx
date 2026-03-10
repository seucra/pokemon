import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { getTeamCoverage } from '../../logic/typeCalc';
import { LayoutGrid, Info } from 'lucide-react';

export const TeamAnalysis: React.FC = () => {
  const members = useTeamStore((state) => state.getActiveTeam().members);
  
  // Extract types for all present team members
  const teamTypes = members
    .filter((m) => m && m.pokemon)
    .map((m) => m!.pokemon!.types.map((t) => t.type.name));

  if (teamTypes.length === 0) return null;

  const coverage = getTeamCoverage(teamTypes);

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Overall Team Analysis</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Defensive Coverage Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Hover for details</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
        {coverage.map((item) => {
          const score = item.resist + item.immune - item.weak;
          const bgColor = score > 0 ? 'bg-green-500/10 border-green-500/20' : score < 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/40 border-slate-700/50';
          const textColor = score > 0 ? 'text-green-400' : score < 0 ? 'text-red-400' : 'text-slate-400';

          return (
            <div 
              key={item.type} 
              className={`p-3 rounded-2xl border transition-all hover:scale-105 group relative ${bgColor}`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{item.type}</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-black ${textColor}`}>{score > 0 ? `+${score}` : score}</span>
                </div>
              </div>

              {/* Enhanced Tooltip Overlay */}
              <div className="absolute inset-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl text-[9px] text-slate-300 font-bold uppercase tracking-tight space-y-1">
                  <div className="flex justify-between text-green-400">
                    <span>Resist/Imm</span>
                    <span>{item.resist + item.immune}</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>Weaknesses</span>
                    <span>{item.weak}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-slate-800/50 text-[10px] uppercase font-bold tracking-widest text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Positive Coverage (Strength)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Negative Coverage (Vulnerability)</span>
        </div>
      </div>
    </div>
  );
};
