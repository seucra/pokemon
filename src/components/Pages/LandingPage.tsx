import React from 'react';
import { ArrowRight, Box, Shield, Zap, Swords, Smartphone, Github, Zap as PokeIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white border-2 border-slate-100 p-10 rounded-[32px] hover:border-red-600/30 transition-all hover:shadow-xl hover:-translate-y-2 group shadow-sm">
    <div className="w-14 h-14 bg-red-600/5 rounded-2xl flex items-center justify-center text-red-600 mb-8 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-slate-900 italic">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#FDFEFE] overflow-x-hidden relative text-slate-900">
      {/* Decorative Dots Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#DC2626 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-red-600/10 border-2 border-red-600/20 px-5 py-2.5 rounded-full mb-10 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-sm">
             <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-red-700">Battle Ready</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000 italic">
            <span className="text-red-600 drop-shadow-md">Gotta Build</span> <br />
            <span className="text-slate-950 underline decoration-red-600/20 decoration-wavy decoration-8 underline-offset-8">The Best Team</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-slate-600 text-xl md:text-2xl mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-medium">
            Analyze type coverage, optimize abilities, and craft the perfect strategy 
            for your next Pokémon battle. Designed for enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button 
              onClick={onStart}
              className="px-12 py-5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-3xl shadow-[0_15px_35px_rgba(220,38,38,0.25)] transition-all flex items-center gap-4 active:scale-95 group text-lg"
            >
              Enter Hub <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <a 
              href="https://github.com/seucra/pokemon" 
              target="_blank" 
              className="px-12 py-5 bg-white border-4 border-slate-950 text-slate-950 font-black uppercase tracking-widest rounded-3xl hover:bg-slate-50 transition-all flex items-center gap-4 text-lg"
            >
              <Github className="w-6 h-6" /> Source Code
            </a>
          </div>

          <div className="mt-32 relative max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-red-600/5 blur-[100px] -z-10"></div>
             <div className="bg-slate-950 p-4 rounded-[50px] shadow-2xl overflow-hidden transform hover:scale-[1.005] transition-all group">
                <div className="aspect-video bg-white rounded-[40px] flex items-center justify-center overflow-hidden relative">
                   <div className="absolute inset-0 bg-red-600/5 group-hover:bg-transparent transition-colors"></div>
                   <Swords className="w-32 h-32 text-red-600/20 group-hover:text-red-600 group-hover:scale-125 transition-all duration-1000" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Clean Light View */}
      <section className="py-40 px-6 bg-[#F6F8F9] border-t-8 border-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col items-center">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 italic text-slate-950">Core Capabilities</h2>
            <div className="w-32 h-2.5 bg-red-600 rounded-full shadow-sm"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Shield className="w-7 h-7" />}
              title="Coverage Mastery"
              description="A sophisticated 18-type matrix analyzes your team's weaknesses and resistances in real-time."
            />
            <FeatureCard 
              icon={<Zap className="w-7 h-7" />}
              title="Ability Sync"
              description="Choose and save specific abilities, including rare Hidden Abilities, for every team member."
            />
            <FeatureCard 
              icon={<Smartphone className="w-7 h-7" />}
              title="Ultra-Responsive"
              description="Full-featured experience on any device, from ultrawide monitors to compact mobile phones."
            />
            <FeatureCard 
              icon={<Box className="w-7 h-7" />}
              title="Multi-Team Hub"
              description="Create and manage multiple specialized teams with instant local persistent storage."
            />
            <FeatureCard 
              icon={<ArrowRight className="w-7 h-7" />}
              title="Pro Tech Stack"
              description="Built with React 19, Tailwind CSS, and Zustand for a blazingly fast and fluid interface."
            />
            <FeatureCard 
              icon={<PokeIcon className="w-7 h-7" />}
              title="Elite Builder"
              description="Coming soon: Battle simulator integration and advanced EV/IV optimization tools."
            />
          </div>
        </div>
      </section>

      {/* Modern Pokemon Footer */}
      <footer className="py-24 border-t-4 border-red-600/10 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-4 border-slate-950 overflow-hidden shadow-md relative">
                 <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
                 <div className="w-2.5 h-2.5 bg-white rounded-full border-2 border-slate-950 z-10"></div>
                 <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-950 -translate-y-1/2"></div>
              </div>
              <span className="text-3xl font-black tracking-tighter text-slate-950 uppercase italic underline decoration-red-600 decoration-4">PokemonCraze</span>
           </div>
           <div className="flex flex-col items-end gap-3">
              <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
                <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
                <a href="#" className="hover:text-red-500 transition-colors">Discord</a>
                <a href="https://github.com/seucra/pokemon" className="hover:text-red-500 transition-colors">Github</a>
              </div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                © 2026 NERD HUB TEAMS • DATA BY POKEAPI
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};
