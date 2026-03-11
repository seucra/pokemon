import React, { useState } from 'react';
import { ArrowRight, Shield, Zap, Box, Smartphone, Github, Sparkles, ChevronRight, Menu, X, Monitor, Database, LayoutDashboard, Settings } from 'lucide-react';
import { useTeamStore } from '../../store/useTeamStore';
import { twMerge } from 'tailwind-merge';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, delay }) => (
  <div 
    className={`relative group p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-panel)]/50 backdrop-blur-sm hover:bg-[var(--bg-panel)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-slide-up opacity-0`}
    style={{ animationDelay: delay }}
  >
    <div className={`absolute top-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r ${gradient} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
      {icon}
    </div>
    <h3 className="text-lg font-extrabold mb-3 text-[var(--text-primary)] tracking-tight">{title}</h3>
    <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

const Pokeball: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 400 }) => (
  <div className={`absolute pointer-events-none ${className}`} style={{ width: size, height: size }}>
    <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] border-[var(--border-subtle)] animate-pokeball-spin opacity-20" style={{animationDuration: '40s'}}>
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--accent-primary)]/20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--text-primary)]/5"></div>
      <div className="absolute top-1/2 left-0 right-0 h-[6px] bg-[var(--border-subtle)] -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] rounded-full bg-[var(--bg-card)] border-[4px] border-[var(--border-subtle)]"></div>
    </div>
  </div>
);

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { theme, setTheme } = useTeamStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg-main)] overflow-x-hidden relative text-[var(--text-primary)] transition-colors duration-500">
      {/* === Header / Navbar === */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full relative overflow-hidden border-2 border-[var(--accent-primary)]/30">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--accent-primary)]"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/20"></div>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60"></div>
          </div>
          <span className="text-lg font-black tracking-tight uppercase">PokemonCraze</span>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-lg hover:scale-110 transition-transform z-[110]"
        >
          {isMenuOpen ? <X className="w-6 h-6 text-[var(--accent-primary)]" /> : <Menu className="w-6 h-6 text-[var(--accent-primary)]" />}
        </button>
      </header>

      {/* === Dropdown Menu Overlay === */}
      <div className={twMerge(
        "fixed inset-0 z-[105] bg-[var(--bg-main)]/95 backdrop-blur-xl transition-all duration-500 flex flex-col",
        isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <div className="flex-1 flex flex-col items-center justify-center gap-8 pt-20">
          <button onClick={onStart} className="text-4xl font-black uppercase tracking-tighter hover:text-[var(--accent-primary)] transition-colors flex items-center gap-4">
            <LayoutDashboard className="w-8 h-8" /> Team Hub
          </button>
          <button onClick={onStart} className="text-4xl font-black uppercase tracking-tighter hover:text-[var(--accent-primary)] transition-colors flex items-center gap-4">
            <Database className="w-8 h-8" /> Pokedex
          </button>
          <a href="https://github.com/seucra/pokemon" target="_blank" className="text-4xl font-black uppercase tracking-tighter hover:text-[var(--accent-primary)] transition-colors flex items-center gap-4">
            <Github className="w-8 h-8" /> Source
          </a>
        </div>

        {/* Theme Switcher at bottom of menu */}
        <div className="p-12 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6 text-[var(--text-muted)] font-extrabold uppercase tracking-widest text-xs">
              <Settings className="w-4 h-4" /> Graphics Style
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('gba')}
                className={twMerge(
                  "p-6 rounded-3xl border-2 transition-all text-left group",
                  theme === 'gba' ? "border-[var(--accent-primary)] bg-white shadow-xl" : "border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 bg-[var(--bg-card)]"
                )}
              >
                <Monitor className={twMerge("w-6 h-6 mb-3", theme === 'gba' ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]")} />
                <div className={twMerge("font-black uppercase tracking-tight text-sm", theme === 'gba' ? "text-black" : "text-[var(--text-primary)]")}>GBA Retro</div>
                <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-60">Classic DMG Colors</div>
              </button>
              
              <button 
                onClick={() => setTheme('cinnabar')}
                className={twMerge(
                  "p-6 rounded-3xl border-2 transition-all text-left group",
                  theme === 'cinnabar' ? "border-[var(--accent-primary)] bg-[#2D2D34] shadow-xl shadow-red-900/20" : "border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 bg-[var(--bg-card)]"
                )}
              >
                <Monitor className={twMerge("w-6 h-6 mb-3", theme === 'cinnabar' ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]")} />
                <div className={twMerge("font-black uppercase tracking-tight text-sm", theme === 'cinnabar' ? "text-white" : "text-[var(--text-primary)]")}>Cinnabar Flare</div>
                <div className="text-[10px] font-bold text-[var(--text-secondary)] opacity-60">Modern Volcanic</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === Ambient Background === */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-[var(--accent-primary)]/[0.05] rounded-full blur-[180px] animate-float"></div>
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] bg-[var(--accent-secondary)]/[0.04] rounded-full blur-[150px] animate-float-slow"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(var(--accent-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      <Pokeball className="-top-48 -right-48" size={500} />
      <Pokeball className="top-[60%] -left-32 opacity-15" size={300} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-20">
        <div className="inline-flex items-center gap-3 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 px-5 py-2 rounded-full mb-10 animate-slide-up opacity-0">
          <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse shadow-[0_0_12px_var(--border-glow)]"></div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--accent-primary)]">Battle Ready • Alpha 1.0</span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-center leading-[0.9] tracking-tighter mb-8 animate-slide-up opacity-0 delay-100">
          <span className="block bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-warn,var(--accent-secondary))] bg-clip-text text-transparent drop-shadow-[0_0_30px_var(--border-glow)]">
            Gotta Build
          </span>
          <span className="block text-[var(--text-primary)] mt-2">
            'Em All
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-center text-[var(--text-secondary)] text-lg md:text-xl mb-14 leading-relaxed font-medium animate-slide-up opacity-0 delay-200">
          Analyze type coverage, optimize abilities, and craft the 
          perfect strategy for your next Pokémon battle.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 animate-slide-up opacity-0 delay-300">
          <button 
            onClick={onStart}
            className="group relative px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 text-white font-extrabold uppercase tracking-widest text-sm rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <span className="relative z-10">Enter Hub</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="https://github.com/seucra/pokemon" 
            target="_blank" 
            className="px-10 py-4 bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-extrabold uppercase tracking-widest text-sm rounded-2xl transition-all flex items-center gap-3"
          >
            <Github className="w-5 h-5" /> Source Code
          </a>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-float-slow">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Scroll</span>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] rotate-90" />
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-32 px-6 bg-[var(--bg-panel)]/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/60 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-slide-up opacity-0">
            <div className="inline-flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">Core Capabilities</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)]/95">
              Everything You Need
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-white" />}
              title="Coverage Mastery"
              description="A sophisticated 18-type matrix analyzes your team's weaknesses and resistances in real-time."
              gradient="from-[var(--accent-primary)] to-[var(--accent-primary)]/60"
              delay="200ms"
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-white" />}
              title="Ability Sync"
              description="Choose and save specific abilities, including rare Hidden Abilities, for every team member."
              gradient="from-[var(--accent-warn,#E9C46A)] to-[var(--accent-warn,#E9C46A)]/60"
              delay="300ms"
            />
            <FeatureCard 
              icon={<Smartphone className="w-6 h-6 text-white" />}
              title="Ultra-Responsive"
              description="Full-featured experience on any device, from ultrawide monitors to compact mobile phones."
              gradient="from-[var(--accent-secondary)] to-[var(--accent-secondary)]/60"
              delay="400ms"
            />
            <FeatureCard 
              icon={<Box className="w-6 h-6 text-white" />}
              title="Multi-Team Hub"
              description="Create and manage multiple specialized teams with instant local persistent storage."
              gradient="from-[var(--accent-secondary,#2A9D8F)] to-[var(--accent-secondary,#2A9D8F)]/60"
              delay="500ms"
            />
            <FeatureCard 
              icon={<ArrowRight className="w-6 h-6 text-white" />}
              title="Pro Tech Stack"
              description="Built with React 19, Tailwind CSS v4, and Zustand for a blazingly fast and fluid interface."
              gradient="from-purple-500 to-violet-500"
              delay="600ms"
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-white" />}
              title="Elite Builder"
              description="Coming soon: Battle simulator integration and advanced EV/IV optimization tools."
              gradient="from-pink-500 to-rose-500"
              delay="700ms"
            />
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '1000+', label: 'Pokémon', gradient: 'from-[var(--accent-primary)] to-[var(--accent-primary)]/80' },
              { value: '18', label: 'Types', gradient: 'from-[var(--accent-warn,#F4A261)] to-[var(--accent-warn,#F4A261)]/80' },
              { value: '∞', label: 'Teams', gradient: 'from-[var(--accent-secondary)] to-[var(--accent-secondary)]/80' },
              { value: '<50ms', label: 'Response', gradient: 'from-[var(--accent-secondary,#2A9D8F)] to-[var(--accent-secondary,#2A9D8F)]/80' },
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className="text-center p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 hover:bg-[var(--bg-panel)] transition-all group animate-slide-up opacity-0"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-32 px-6 bg-[var(--bg-panel)]/30">
        <div className="max-w-3xl mx-auto text-center animate-slide-up opacity-0">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]/95 mb-6">
            Ready to <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-warn,#F4A261)] bg-clip-text text-transparent">Battle?</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-12 font-medium">
            Start building your ultimate team now. It's free and always will be.
          </p>
          <button 
            onClick={onStart}
            className="group relative px-14 py-5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 text-white font-extrabold uppercase tracking-widest text-sm rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-3 mx-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <span className="relative z-10">Launch Team Builder</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-[var(--border-subtle)] py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-[var(--text-primary)]">
            <div className="w-8 h-8 rounded-full relative overflow-hidden border-2 border-[var(--accent-primary)]/30">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--accent-primary)]"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/20"></div>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/20 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/40"></div>
            </div>
            <span className="text-lg font-black tracking-tight uppercase">PokemonCraze</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3 text-[var(--text-muted)]">
            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
              <a href="https://github.com/seucra/pokemon" target="_blank" className="hover:text-[var(--accent-primary)] transition-colors">Github</a>
              <a href="https://pokeapi.co/" target="_blank" className="hover:text-[var(--accent-primary)] transition-colors">PokéAPI</a>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              © 2026 PokemonCraze • Data by PokéAPI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
