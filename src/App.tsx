import { useState } from 'react'
import { Shield, ChevronRight, LayoutDashboard, Database, Star, Menu, X } from 'lucide-react'
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
  const { getActiveTeam } = useTeamStore()
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
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 font-sans selection:bg-red-500/20 overflow-x-hidden">
      {/* Navbar - The iconic Poké-Red bar */}
      <nav className="border-b-4 border-slate-950 bg-red-600 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-4 border-slate-950 relative overflow-hidden shadow-md">
               <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-600"></div>
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-950 -translate-y-1/2"></div>
               <div className="w-3 h-3 bg-white rounded-full border-2 border-slate-950 relative z-10 group-hover:scale-125 transition-transform"></div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white italic drop-shadow-sm">
              PokemonCraze
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80">
            <button 
              onClick={() => navigate('dex')}
              className={twMerge(
                "hover:text-white transition-all px-5 py-2 rounded-full flex items-center gap-2",
                view === 'dex' ? "bg-slate-950/20 text-white" : ""
              )}
            >
              <Database className="w-4 h-4" /> Dex
            </button>
            <button 
              onClick={() => navigate('builder')}
              className={twMerge(
                "hover:text-white transition-all px-5 py-2 rounded-full flex items-center gap-2",
                view === 'builder' ? "bg-slate-950/20 text-white" : ""
              )}
            >
              <LayoutDashboard className="w-4 h-4" /> Team Builder
            </button>
            <a href="#" className="hover:text-white transition-all px-5 py-2 flex items-center gap-2">
              <Star className="w-4 h-4" /> Battle
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.2em] text-white/90 bg-slate-950/20 px-4 py-1.5 rounded-full border border-white/20">Alpha 1.0</span>
            <button className="md:hidden text-white hover:text-red-100 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-18 left-0 right-0 bg-red-600 border-b border-slate-950/20 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300 z-40 text-white">
             <button onClick={() => navigate('dex')} className="flex items-center justify-between w-full text-left p-5 bg-slate-950/10 rounded-2xl transition-colors font-bold uppercase tracking-widest text-sm">
               <span>Dex Explorer</span>
               <Database className="w-5 h-5" />
             </button>
             <button onClick={() => navigate('builder')} className="flex items-center justify-between w-full text-left p-5 bg-slate-950/10 rounded-2xl transition-colors font-bold uppercase tracking-widest text-sm">
               <span>Team Builder</span>
               <LayoutDashboard className="w-5 h-5" />
             </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-12 bg-[#F6F8F9] min-h-screen">
        {/* Breadcrumbs - Styled for visibility on light bg */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => navigate('landing')} className="hover:text-red-600 transition-colors">Home</button>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className={view === 'builder' || view === 'dex' ? 'text-red-600' : 'text-slate-400'}>
            {view === 'builder' ? 'Team Builder' : 'Pokédex'}
          </span>
          {view === 'builder' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-orange-600 underline decoration-orange-500/40 decoration-2 underline-offset-4 truncate max-w-[150px] font-bold italic">{activeTeam.name}</span>
            </>
          )}
        </div>

        {view === 'builder' ? (
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-1/4 xl:w-1/5 space-y-10">
              <TeamSwitcher />
              <TeamSidebar />
            </aside>

            <section className="flex-1 space-y-10">
              <div className="bg-white border-2 border-slate-200/60 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                  <Shield className="w-72 h-72 -mr-20 -mt-20 text-red-600" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-10 text-center px-4">
                    <h2 className="text-4xl font-black mb-3 uppercase tracking-tight text-slate-900 italic">Recruit Pokémon</h2>
                    <p className="text-slate-500 text-sm max-w-sm font-medium">Build your squad and conquer the league.</p>
                  </div>
                  <PokemonSearch />
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200/60 p-10 rounded-[40px] shadow-sm min-h-[500px]">
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
      
      {/* Poké-Footer */}
      <footer className="bg-slate-950 text-white py-20 px-6 border-t-8 border-red-600 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-white relative flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full border border-slate-950 relative z-10"></div>
                 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white -translate-y-1/2"></div>
               </div>
               <span className="text-2xl font-black uppercase tracking-tighter italic">PokemonCraze</span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] text-center">Data Powered by PokéAPI • Designed for Nerds</p>
         </div>
      </footer>
    </div>
  )
}

export default App
