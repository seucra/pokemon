import { useState } from 'react'
import { Shield, ChevronRight, LayoutDashboard, Database, Menu, X, Settings, Monitor, Globe, Sword, Github, Download, Type, User } from 'lucide-react'
import { PokemonSearch } from './components/Teambuilder/PokemonSearch'
import { TeamSwitcher } from './components/Teambuilder/TeamSwitcher'
import { TeamSidebar } from './components/Teambuilder/TeamSidebar'
import { PokemonDetail } from './components/Teambuilder/PokemonDetail'
import { TeamAnalysis } from './components/Teambuilder/TeamAnalysis'
import { LandingPage } from './components/Pages/LandingPage'
import { Pokedex } from './components/Pages/Pokedex'
import { useTeamStore } from './store/useTeamStore'
import { twMerge } from 'tailwind-merge'

type View = 'landing' | 'dex' | 'builder'

function App() {
  const [view, setView] = useState<View>('landing')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { getActiveTeam, theme, setTheme } = useTeamStore()
  const activeTeam = getActiveTeam()

  const navigate = (newView: View) => {
    setView(newView)
    setIsMenuOpen(false)
    setShowSettings(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-primary)]/20 overflow-x-hidden transition-colors duration-500">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-[180px]"></div>
        <div className="absolute -bottom-60 -left-40 w-[400px] h-[400px] bg-[var(--accent-secondary)]/3 rounded-full blur-[150px]"></div>
      </div>

      {/* Shared Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95 group"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-[var(--accent-primary)]" /> : <Menu className="w-6 h-6 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]" />}
          </button>
          
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center gap-3 transition-transform hover:scale-105"
          >
            {/* Canonical Pokéball (Red/White) */}
            <div className="w-8 h-8 rounded-full relative overflow-hidden border-2 border-[var(--border-subtle)] bg-white shadow-md">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-600"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-900 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2 border-gray-900 shadow-sm"></div>
            </div>
            <span className="text-lg font-black tracking-tight uppercase">
              PokemonCraze
            </span>
          </button>
        </div>

        {/* Hero-like Style indicator breadcrumb (minimal) */}
        {!isMenuOpen && view !== 'landing' && (
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-panel)] px-4 py-2 rounded-xl border border-[var(--border-subtle)] backdrop-blur-md">
            <span className="opacity-40">Session</span>
            <ChevronRight className="w-3 h-3 opacity-20" />
            <span className="text-[var(--accent-primary)]">{view === 'builder' ? 'Team Manager' : 'Pokédex'}</span>
          </div>
        )}
      </nav>

      {/* Menu Overlay */}
      <div className={twMerge(
        "fixed inset-0 z-[90] bg-[var(--bg-main)]/95 backdrop-blur-2xl transition-all duration-500 overflow-y-auto",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
      )}>
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Side: Navigation */}
          <div className="space-y-12">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-50 border-l-4 border-[var(--accent-primary)] pl-4">Sector Navigation</h3>
            <div className="flex flex-col gap-4">
              <button onClick={() => navigate('landing')} className="flex items-center justify-between p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl hover:bg-[var(--accent-primary)] group transition-all">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-[var(--bg-panel)] rounded-2xl group-hover:bg-white/20 transition-colors">
                    <Globe className="w-8 h-8 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black uppercase tracking-tighter group-hover:text-white">Main Site</div>
                    <div className="text-xs font-bold text-[var(--text-muted)] group-hover:text-white/60">Overview & Capabilities</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:text-white translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>

              <button onClick={() => navigate('dex')} className="flex items-center justify-between p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl hover:bg-[var(--accent-primary)] group transition-all">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-[var(--bg-panel)] rounded-2xl group-hover:bg-white/20 transition-colors">
                    <Database className="w-8 h-8 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black uppercase tracking-tighter group-hover:text-white">Pokédex</div>
                    <div className="text-xs font-bold text-[var(--text-muted)] group-hover:text-white/60">Species Database</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:text-white translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>

              <button onClick={() => navigate('builder')} className="flex items-center justify-between p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl hover:bg-[var(--accent-primary)] group transition-all">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-[var(--bg-panel)] rounded-2xl group-hover:bg-white/20 transition-colors">
                    <LayoutDashboard className="w-8 h-8 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black uppercase tracking-tighter group-hover:text-white">Team Manager</div>
                    <div className="text-xs font-bold text-[var(--text-muted)] group-hover:text-white/60">Squad Optimization</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:text-white translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>

              <div className="relative group cursor-not-allowed">
                <div className="flex items-center justify-between p-6 bg-[var(--bg-card)]/40 border border-[var(--border-subtle)] rounded-3xl opacity-40 grayscale transition-all">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-[var(--bg-panel)] rounded-2xl">
                      <Sword className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black uppercase tracking-tighter">Battle</div>
                      <div className="text-xs font-bold text-[var(--text-muted)]">COMING SOON</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-10 flex items-center gap-6">
              <a href="https://github.com/seucra/pokemon" target="_blank" className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                <Github className="w-5 h-5" /> Source Code
              </a>
               <button 
                onClick={() => setShowSettings(!showSettings)}
                className={twMerge(
                  "flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-colors",
                  showSettings ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                )}
              >
                <Settings className={twMerge("w-5 h-5", showSettings && "animate-spin")} /> {showSettings ? 'Hide Settings' : 'Settings'}
              </button>
            </div>
          </div>

          {/* Right Side: Settings Toggleable */}
          <div className={twMerge(
            "space-y-12 transition-all duration-700",
            showSettings ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none lg:block lg:opacity-100 lg:translate-y-0"
          )}>
            <div className="p-10 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[40px] space-y-10 group">
              <div className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-6">
                <Settings className="w-6 h-6 text-[var(--accent-primary)]" />
                <h3 className="text-lg font-black uppercase tracking-widest">Configuration</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> Graphics Style
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setTheme('gba')}
                      className={twMerge(
                        "p-6 rounded-3xl border-2 transition-all text-left",
                        theme === 'gba' ? "border-[var(--accent-primary)] bg-white shadow-xl" : "border-[var(--border-subtle)] bg-[var(--bg-card)]"
                      )}
                    >
                      <div className={twMerge("font-black uppercase tracking-tight text-sm mb-1", theme === 'gba' ? "text-black" : "text-[var(--text-primary)]")}>GBA Retro</div>
                      <div className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">Paper White / Red</div>
                    </button>
                    <button 
                      onClick={() => setTheme('cinnabar')}
                      className={twMerge(
                        "p-6 rounded-3xl border-2 transition-all text-left",
                        theme === 'cinnabar' ? "border-[var(--accent-primary)] bg-[#1C2128] shadow-xl" : "border-[var(--border-subtle)] bg-[var(--bg-card)]"
                      )}
                    >
                      <div className={twMerge("font-black uppercase tracking-tight text-sm mb-1", theme === 'cinnabar' ? "text-white" : "text-[var(--text-primary)]")}>Cinnabar Flare</div>
                      <div className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">Obsidian / Teal</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                         <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                          <Type className="w-3 h-3" /> Scaling
                         </label>
                         <div className="flex items-center gap-2 p-4 bg-[var(--bg-card)] rounded-2xl opacity-40 cursor-not-allowed">
                            <span className="text-xs font-bold">Standard</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                          <Download className="w-3 h-3" /> Backup
                         </label>
                         <button className="w-full flex items-center justify-center p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl hover:border-[var(--accent-primary)]/50 transition-all opacity-40 cursor-not-allowed">
                            <span className="text-xs font-bold uppercase tracking-widest">Export Teams</span>
                         </button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-[var(--bg-main)]/50 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Authenticated as</div>
                  <div className="text-sm font-black uppercase tracking-tight">Guest Trainer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative pt-24 min-h-screen">
        {view === 'landing' ? (
           <LandingPage onStart={() => navigate('builder')} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <button onClick={() => navigate('landing')} className="hover:text-[var(--accent-primary)] transition-colors">Home</button>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <button onClick={() => navigate(view)} className="text-[var(--text-primary)]/50 hover:text-[var(--text-primary)] transition-colors">
                {view === 'builder' ? 'Team Manager' : 'Pokédex'}
              </button>
              {view === 'builder' && (
                <>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[var(--accent-primary)] truncate max-w-[150px]">{activeTeam.name}</span>
                </>
              )}
            </div>

            {view === 'builder' ? (
              <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4 xl:w-1/5 space-y-8 animate-slide-up">
                  <TeamSwitcher />
                  <TeamSidebar />
                </aside>

                <section className="flex-1 space-y-8 animate-slide-up delay-100">
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-8 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                      <Shield className="w-60 h-60 -mr-16 -mt-16 text-[var(--accent-primary)]" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="mb-8 text-center px-4">
                        <h2 className="text-3xl font-black mb-2 tracking-tight text-[var(--text-primary)]/95 uppercase">Recruit Pokémon</h2>
                        <p className="text-[var(--text-muted)] text-sm font-medium italic opacity-60">Build your squad and conquer the league.</p>
                      </div>
                      <PokemonSearch />
                    </div>
                  </div>

                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-8 rounded-[32px] min-h-[500px]">
                    <PokemonDetail />
                  </div>

                  <div className="w-full">
                    <TeamAnalysis />
                  </div>
                </section>
              </div>
            ) : (
              <Pokedex />
            )}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-[var(--bg-main)] border-t border-[var(--border-subtle)] py-20 px-6">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
               {/* Canonical Pokéball (Red/White) */}
               <div className="w-6 h-6 rounded-full relative overflow-hidden border border-[var(--border-subtle)] bg-white">
                 <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-600"></div>
                 <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
                 <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-900 -translate-y-1/2"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white border border-gray-900"></div>
               </div>
               <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]/80 uppercase">PokemonCraze</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">
               <a href="#" className="hover:text-[var(--accent-primary)] transition-colors">Documentation</a>
               <a href="https://github.com/seucra/pokemon" target="_blank" className="hover:text-[var(--accent-primary)] transition-colors">GitHub</a>
               <a href="https://pokeapi.co/" target="_blank" className="hover:text-[var(--accent-primary)] transition-colors">PokéAPI</a>
               <a href="https://github.com/seucra" target="_blank" className="hover:text-[var(--accent-primary)] transition-colors text-[var(--accent-primary)] opacity-100">@seucra</a>
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-center opacity-20">Data Powered by PokéAPI • Designed for Trainers Worldwide</p>
         </div>
      </footer>
    </div>
  )
}

export default App
