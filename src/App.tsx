import { Shield, ChevronRight } from 'lucide-react'
import { PokemonSearch } from './components/Teambuilder/PokemonSearch'
import { TeamSwitcher } from './components/Teambuilder/TeamSwitcher'
import { TeamSidebar } from './components/Teambuilder/TeamSidebar'
import { PokemonDetail } from './components/Teambuilder/PokemonDetail'
import { TeamAnalysis } from './components/Teambuilder/TeamAnalysis'
import { useTeamStore } from './store/useTeamStore'

function App() {
  const activeIndex = useTeamStore(state => state.activeMemberIndex);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white/20 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
               <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              PokemonCraze
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Dex</a>
            <a href="#" className="hover:text-cyan-400 transition-colors underline underline-offset-8 decoration-cyan-500 text-slate-100">Team Builder</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Battle Simulator</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-slate-600">Beta v0.1</span>
            <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-all text-sm font-semibold">
              Login
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 px-2">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-cyan-500">Team Builder</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">Slot {activeIndex + 1}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Team Selection */}
          <aside className="lg:w-1/4 xl:w-1/5">
            <TeamSwitcher />
            <TeamSidebar />
          </aside>

          {/* Main Content - Search & Detail */}
          <section className="flex-1 space-y-8">
            <div className="bg-slate-900/10 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-sm shadow-inner relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield className="w-64 h-64 -mr-16 -mt-16" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Recruit a Pokémon</h2>
                  <p className="text-slate-500 text-sm">Select slot {activeIndex + 1} and search for your next team member.</p>
                </div>
                <PokemonSearch />
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-3xl min-h-[500px]">
              <PokemonDetail />
            </div>
          </section>
        </div>

        {/* Team Analysis Section */}
        <div className="w-full">
          <TeamAnalysis />
        </div>
      </main>
    </div>
  )
}

export default App
