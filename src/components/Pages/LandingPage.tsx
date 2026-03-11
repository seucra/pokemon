import React from 'react';
import { ArrowRight, Shield, Zap, Box, Smartphone, Github, Sparkles, ChevronRight, Target, ShieldCheck, Activity } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, delay }) => (
  <div 
    className={`relative group p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-panel)]/50 backdrop-blur-sm hover:bg-[var(--bg-panel)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in opacity-0`}
    style={{ animationDelay: delay, animationFillMode: 'forwards' }}
  >
    <div className={`absolute top-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r ${gradient} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
      {icon}
    </div>
    <h3 className="text-lg font-extrabold mb-3 text-[var(--text-primary)] tracking-tight uppercase">{title}</h3>
    <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

const PokeballDecoration: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 400 }) => (
  <div className={`absolute pointer-events-none ${className}`} style={{ width: size, height: size }}>
    <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] border-[var(--border-subtle)] animate-pokeball-spin opacity-10" style={{animationDuration: '60s'}}>
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--accent-primary)]/20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--text-primary)]/5"></div>
      <div className="absolute top-1/2 left-0 right-0 h-[6px] bg-[var(--border-subtle)] -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] rounded-full bg-[var(--bg-card)] border-[4px] border-[var(--border-subtle)]"></div>
    </div>
  </div>
);

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden pt-10">
      <PokeballDecoration className="-top-48 -right-48" size={600} />
      <PokeballDecoration className="top-[60%] -left-32 opacity-10" size={400} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pb-20">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black text-center leading-[0.85] tracking-tighter mb-10 animate-slide-up">
          <span className="block bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-warn,var(--accent-secondary))] bg-clip-text text-transparent drop-shadow-[0_0_30px_var(--border-glow)]">
            Gotta Build
          </span>
          <span className="block text-[var(--text-primary)] mt-3">
            'Em All
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-center text-[var(--text-secondary)] text-xl md:text-2xl mb-16 leading-relaxed font-medium animate-slide-up delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
          The ultimate engine for Pokémon team optimization, defensive analysis, and competitive strategy. Built for the modern trainer.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 animate-slide-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <button 
            onClick={onStart}
            className="group relative px-12 py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <span className="relative z-10">Enter Team Hub</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
          <a 
            href="https://github.com/seucra/pokemon" 
            target="_blank" 
            className="px-12 py-5 bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all flex items-center gap-4"
          >
            <Github className="w-6 h-6" /> Repository
          </a>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-float-slow opacity-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Scroll Exploration</span>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] rotate-90" />
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-40 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <div className="inline-flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] px-6 py-2 rounded-full mb-10">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Core Capabilities</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text-primary)] uppercase">
              Pro-Grade <span className="text-[var(--accent-primary)]">Tooling</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="w-7 h-7 text-white" />}
              title="Coverage Mastery"
              description="Real-time 18-type matrix analysis with net score weighting to find every blind spot in your defense."
              gradient="from-[var(--accent-primary)] to-[var(--accent-primary)]/60"
              delay="100ms"
            />
            <FeatureCard 
              icon={<Zap className="w-7 h-7 text-white" />}
              title="State Engine"
              description="Persistent local storage for all your squads. No loss of data, even after refreshing your session."
              gradient="from-[var(--accent-warn,#E9C46A)] to-[var(--accent-warn,#E9C46A)]/60"
              delay="200ms"
            />
            <FeatureCard 
              icon={<Smartphone className="w-7 h-7 text-white" />}
              title="Platform Agnostic"
              description="Optimized for every screen. From high-resolution battle stations to mobile scouting in the field."
              gradient="from-[var(--accent-secondary)] to-[var(--accent-secondary)]/60"
              delay="300ms"
            />
            <FeatureCard 
              icon={<Box className="w-7 h-7 text-white" />}
              title="Squad Vault"
              description="Manage multiple teams simultaneously. Switch between competitive builds in a single click."
              gradient="from-[var(--accent-secondary,#2A9D8F)] to-[var(--accent-secondary,#2A9D8F)]/60"
              delay="400ms"
            />
            <FeatureCard 
              icon={<ArrowRight className="w-7 h-7 text-white" />}
              title="Vite-Powered"
              description="Built with the fastest modern frontend stack for a zero-latency trainer experience."
              gradient="from-purple-500 to-violet-500"
              delay="500ms"
            />
            <FeatureCard 
              icon={<Sparkles className="w-7 h-7 text-white" />}
              title="Next Gen"
              description="Ongoing development for battle simulation, damage calculators, and move-set validation."
              gradient="from-pink-500 to-rose-500"
              delay="600ms"
            />
          </div>
        </div>
      </section>
      
      {/* ===== STRATEGIC FRONTIER SECTION ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-3 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 px-6 py-2 rounded-full">
                <Target className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">Battle Intelligence</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text-primary)] uppercase leading-[0.9]">
                Strategic <br /><span className="text-[var(--accent-primary)]">Frontier</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg font-medium leading-relaxed max-w-xl">
                Beyond simple collection. Our engine simulates thousands of type-interaction permutations to ensure your squad isn't just strong—it's mathematically superior.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Type Sovereignty</span>
                   </div>
                   <p className="text-[var(--text-muted)] text-xs font-medium">Automatic identification of quad-weaknesses and defensive voids.</p>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Meta-Analysis</span>
                   </div>
                   <p className="text-[var(--text-muted)] text-xs font-medium">Real-time stats processing for the current competitive landscape.</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-primary)]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="relative bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[40px] p-8 sm:p-12 shadow-2xl backdrop-blur-xl animate-float-slow">
                  <div className="space-y-8">
                     <div className="flex justify-between items-end">
                        <div className="space-y-2">
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Squad Efficiency</div>
                           <div className="text-4xl font-black text-[var(--text-primary)]">94.8<span className="text-[var(--accent-primary)]">%</span></div>
                        </div>
                        <div className="flex gap-1 items-end h-12">
                           {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                              <div 
                                key={i} 
                                className="w-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" 
                                style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                              ></div>
                           ))}
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="h-[1px] bg-gradient-to-r from-[var(--border-subtle)] to-transparent"></div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)]">
                              <div className="text-[8px] font-black uppercase text-[var(--text-muted)] mb-1">Defense</div>
                              <div className="text-sm font-black text-[var(--text-primary)]">ELITE</div>
                           </div>
                           <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)]">
                              <div className="text-[8px] font-black uppercase text-[var(--text-muted)] mb-1">Coverage</div>
                              <div className="text-sm font-black text-[var(--text-primary)]">FULL</div>
                           </div>
                           <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)]">
                              <div className="text-[8px] font-black uppercase text-[var(--text-muted)] mb-1">Synergy</div>
                              <div className="text-sm font-black text-[var(--accent-primary)]">ALPHA</div>
                           </div>
                        </div>
                     </div>

                     <div className="relative h-40 bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-10">
                           <div className="grid grid-cols-8 h-full">
                              {Array.from({length: 32}).map((_, i) => (
                                 <div key={i} className="border-[0.5px] border-[var(--text-primary)]"></div>
                              ))}
                           </div>
                        </div>
                        <Activity className="w-16 h-16 text-[var(--accent-primary)] animate-pulse" />
                        <div className="absolute bottom-4 left-6 right-6 flex justify-between">
                           <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Scanning Type Vectors...</span>
                           <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[var(--accent-primary)]">System Nominal</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1000+', label: 'Pokémon Indexed', gradient: 'from-[var(--accent-primary)] to-[var(--accent-primary)]/80' },
              { value: '18', label: 'Canonical Types', gradient: 'from-[var(--accent-warn,#F4A261)] to-[var(--accent-warn,#F4A261)]/80' },
              { value: '∞', label: 'Squad Slots', gradient: 'from-[var(--accent-secondary)] to-[var(--accent-secondary)]/80' },
              { value: 'Fast', label: 'Performance', gradient: 'from-[var(--accent-secondary,#2A9D8F)] to-[var(--accent-secondary,#2A9D8F)]/80' },
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className="text-center p-10 rounded-[40px] border border-[var(--border-subtle)] bg-[var(--bg-panel)]/30 hover:bg-[var(--bg-panel)] transition-all group animate-fade-in opacity-0"
                style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-40 px-6 bg-[var(--bg-panel)]/20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-[var(--text-primary)] mb-8 uppercase leading-none">
            Forge Your <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-warn,#F4A261)] bg-clip-text text-transparent">Destiny</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-xl mb-16 font-medium max-w-2xl mx-auto">
            Build the most scientifically sound Pokémon team in existence today.
          </p>
          <button 
            onClick={onStart}
            className="group relative px-16 py-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 text-white font-black uppercase tracking-[0.3em] text-sm rounded-3xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 mx-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <span className="relative z-10">Launch Engine</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
