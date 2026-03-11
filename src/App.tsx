import { useState } from 'react'
import { Shield, ChevronRight, LayoutDashboard, Database, Menu, X, Settings, Monitor } from 'lucide-react'
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
  const { getActiveTeam, theme, setTheme } = useTeamStore()
  const activeTeam = getActiveTeam()

  const navigate = (newView: View) => {
    setView(newView)
    setIsMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (view === 'landing') {
    return <LandingPage onStart={() => navigate('builder')} />
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-primary)]/20 overflow-x-hidden transition-colors duration-500">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-[180px]"></div>
        <div className="absolute -bottom-60 -left-40 w-[400px] h-[400px] bg-[var(--accent-secondary)]/3 rounded-full blur-[150px]"></div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-[var(--border-subtle)] bg-[var(--bg-nav)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            {/* Pokéball Logo */}
            <div className="w-8 h-8 rounded-full relative overflow-hidden border-2 border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)]/50 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--accent-primary)]"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/20"></div>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/30 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60 border border-white/30"></div>
            </div>
            <span className="text-lg font-black tracking-tight text-[var(--text-primary)]/90 uppercase">
              PokemonCraze
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
            <button 
              onClick={() => navigate('dex')}
              className={twMerge(
                "hover:text-[var(--text-primary)] transition-all px-4 py-2 rounded-xl flex items-center gap-2",
                view === 'dex' ? "bg-[var(--bg-panel)] text-[var(--text-primary)]" : ""
              )}
            >
              <Database className="w-3.5 h-3.5" /> Dex
            </button>
            <button 
              onClick={() => navigate('builder')}
              className={twMerge(
                "hover:text-[var(--text-primary)] transition-all px-4 py-2 rounded-xl flex items-center gap-2",
                view === 'builder' ? "bg-[var(--bg-panel)] text-[var(--text-primary)]" : ""
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Team Builder
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-[var(--text-primary)] transition-all px-4 py-2 rounded-xl flex items-center gap-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] ml-2"
            >
              <Settings className="w-3.5 h-3.5 animate-spin" style={{animationDuration: '8s'}} /> Style
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[9px] font-extrabold uppercase tracking-[0.15em] text-[var(--text-muted)] bg-[var(--bg-panel)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">Alpha 1.0</span>
            <button className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Style / Nav Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[var(--bg-panel)] border-b border-[var(--border-subtle)] shadow-2xl z-40 animate-slide-up">
             <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-4">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6">Navigation</h3>
                 <div className="grid grid-cols-1 gap-2">
                   <button onClick={() => navigate('dex')} className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-2xl hover:bg-[var(--accent-primary)]/10 group transition-all">
                     <div className="flex items-center gap-4">
                       <Database className="w-5 h-5 text-[var(--accent-primary)]" />
                       <span className="font-black uppercase tracking-widest text-sm">Dex Explorer</span>
                     </div>
                     <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                   </button>
                   <button onClick={() => navigate('builder')} className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-2xl hover:bg-[var(--accent-primary)]/10 group transition-all">
                     <div className="flex items-center gap-4">
                       <LayoutDashboard className="w-5 h-5 text-[var(--accent-primary)]" />
                       <span className="font-black uppercase tracking-widest text-sm">Team Builder</span>
                     </div>
                     <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                   </button>
                 </div>
               </div>

               <div className="space-y-4">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6">Graphics Style</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setTheme('gba')}
                      className={twMerge(
                        "p-6 rounded-3xl border-2 transition-all text-left",
                        theme === 'gba' ? "border-[var(--accent-primary)] bg-[var(--bg-main)]" : "border-[var(--border-subtle)] bg-[var(--bg-card)]"
                      )}
                    >
                      <Monitor className="w-6 h-6 mb-3 text-[var(--accent-primary)]" />
                      <div className="font-black uppercase tracking-tight text-sm">GBA Retro</div>
                      <div className="text-[10px] font-bold opacity-40">Paper White / Red</div>
                    </button>
                    <button 
                      onClick={() => setTheme('cinnabar')}
                      className={twMerge(
                        "p-6 rounded-3xl border-2 transition-all text-left",
                        theme === 'cinnabar' ? "border-[var(--accent-primary)] bg-[var(--bg-main)]" : "border-[var(--border-subtle)] bg-[var(--bg-card)]"
                      )}
                    >
                      <Monitor className="w-6 h-6 mb-3 text-[var(--accent-primary)]" />
                      <div className="font-black uppercase tracking-tight text-sm">Cinnabar Flare</div>
                      <div className="text-[10px] font-bold opacity-40">Dark Steel / Teal</div>
                    </button>
                 </div>
               </div>
             </div>
          </div>
        )}
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 py-10 space-y-10 min-h-screen">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => navigate('landing')} className="hover:text-[var(--accent-primary)] transition-colors">Home</button>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className={view === 'builder' || view === 'dex' ? 'text-[var(--text-primary)]/50' : 'text-[var(--text-muted)]'}>
            {view === 'builder' ? 'Team Builder' : 'Pokédex'}
          </span>
          {view === 'builder' && (
            <>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-[var(--accent-primary)] truncate max-w-[150px]">{activeTeam.name}</span>
            </>
          )}
        </div>

        {view === 'builder' ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4 xl:w-1/5 space-y-8">
              <TeamSwitcher />
              <TeamSidebar />
            </aside>

            <section className="flex-1 space-y-8">
              <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-8 rounded-[32px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                  <Shield className="w-60 h-60 -mr-16 -mt-16 text-[var(--accent-primary)]" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-8 text-center px-4">
                    <h2 className="text-3xl font-black mb-2 tracking-tight text-[var(--text-primary)]/95 uppercase">Recruit Pokémon</h2>
                    <p className="text-[var(--text-muted)] text-sm font-medium">Build your squad and conquer the league.</p>
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
      </main>
      
      {/* Footer */}
      <footer className="bg-[var(--bg-main)] border-t border-[var(--border-subtle)] py-16 px-6 mt-16">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded-full relative overflow-hidden border border-[var(--accent-primary)]/30">
                 <div className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--accent-primary)]"></div>
                 <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/10"></div>
                 <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 -translate-y-1/2"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40"></div>
               </div>
               <span className="text-lg font-black tracking-tight text-[var(--text-muted)] uppercase">PokemonCraze</span>
            </div>
            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] text-center opacity-40">Data Powered by PokéAPI • Designed for Trainers</p>
         </div>
      </footer>
    </div>
  )
}

export default App
