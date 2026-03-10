import React from 'react';
import { useTeamStore } from '../../store/useTeamStore';
import { getTeamCoverage } from '../../logic/typeCalc';
import { LayoutGrid, Info } from 'lucide-react';

export const TeamAnalysis: React.FC = () => {
  const members = useTeamStore((state) => state.getActiveTeam().members);
  
  const teamTypes = members
    .filter((m) => m && m.pokemon)
    .map((m) => m!.pokemon!.types.map((t) => t.type.name));

  if (teamTypes.length === 0) return null;

  const coverage = getTeamCoverage(teamTypes);

  return (
    <div className="bg-white border-2 border-slate-200/60 p-10 rounded-[40px] shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-red-600 rounded-[20px] shadow-lg shadow-red-600/20 rotate-3 group-hover:rotate-0 transition-all">
            <LayoutGrid className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-950 italic">Defensive Strategy</h2>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-300">Tactical Type Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 px-5 py-2.5 rounded-2xl text-slate-400 group hover:border-red-600/20 transition-all">
          <Info className="w-5 h-5 text-red-600" />
          <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-red-600">Hover for Type-Resistance Link</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6">
        {coverage.map((item) => {
          const score = item.resist + item.immune - item.weak;
          const isPositive = score > 0;
          const isNegative = score < 0;
          
          const borderClass = isPositive 
            ? 'border-green-500 bg-green-50 shadow-sm' 
            : isNegative 
            ? 'border-red-600 bg-red-50 shadow-sm' 
            : 'border-slate-100 bg-slate-50';
            
          const textColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-700' : 'text-slate-300';

          return (
            <div 
              key={item.type} 
              className={`p-5 rounded-3xl border-2 transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden flex flex-col items-center justify-center gap-2 ${borderClass}`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-current opacity-10"></div>
              <span className="text-[9px] font-black uppercase tracking-widest mb-1 italic opacity-60 text-slate-500 group-hover:text-slate-900 group-hover:opacity-100 transition-all">{item.type}</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black italic underline decoration-current decoration-4 underline-offset-4 ${textColor}`}>
                   {score > 0 ? `+${score}` : score}
                </span>
              </div>

              {/* Enhanced Tooltip Overlay */}
              <div className="absolute inset-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                <div className="bg-orange-600 p-4 rounded-2xl shadow-2xl text-[9px] text-white font-black uppercase tracking-widest space-y-2 border-2 border-orange-400/30 scale-75 group-hover:scale-100 transition-transform">
                  <div className="flex justify-between items-center gap-4 text-white">
                    <span>RES/IMM</span>
                    <span className="text-sm bg-white/20 px-2 rounded-lg">{(item.resist + item.immune)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4 text-white/80">
                    <span>WEAK</span>
                    <span className="text-sm bg-black/10 px-2 rounded-lg">{item.weak}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-8 pt-10 border-t-4 border-slate-50 text-[10px] uppercase font-black tracking-widest italic">
        <div className="flex items-center gap-3 group">
          <div className="w-4 h-4 rounded-lg bg-green-500 shadow-lg shadow-green-500/20 group-hover:scale-150 transition-transform"></div>
          <span className="text-green-600">Tactical Strength</span>
        </div>
        <div className="flex items-center gap-3 group">
          <div className="w-4 h-4 rounded-lg bg-red-600 shadow-lg shadow-red-600/20 group-hover:scale-150 transition-transform"></div>
          <span className="text-red-700">Team vulnerability</span>
        </div>
        <div className="flex items-center gap-3 group">
          <div className="w-4 h-4 rounded-lg bg-slate-200 group-hover:scale-150 transition-transform"></div>
          <span className="text-slate-400">Neutral Balanced Exposure</span>
        </div>
      </div>
    </div>
  );
};
