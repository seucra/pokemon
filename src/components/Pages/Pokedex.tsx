import React, { useState } from 'react';
import { Database, Zap, Disc, Wind, Cherry, Heart, ChevronRight, ArrowLeft } from 'lucide-react';
import { PokemonDex } from './PokemonDex';
import { twMerge } from 'tailwind-merge';

type DexCategory = 'none' | 'pokemon' | 'abilities' | 'moves' | 'items' | 'berries' | 'natures';

interface CategoryCard {
  id: DexCategory;
  name: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  status?: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'pokemon',
    name: 'Pokémon',
    description: 'Biological Specs & Species Index',
    icon: Database,
    accent: 'var(--accent-primary)',
  },
  {
    id: 'abilities',
    name: 'Abilities',
    description: 'Passive Traits & Battle Effects',
    icon: Zap,
    accent: '#F59E0B',
    status: 'Work in Progress',
  },
  {
    id: 'moves',
    name: 'Movements',
    description: 'Offensive & Defensive Techniques',
    icon: Wind,
    accent: '#3B82F6',
    status: 'Work in Progress',
  },
  {
    id: 'items',
    name: 'Pokéballs',
    description: 'Capture Gear & Utility Items',
    icon: Disc,
    accent: '#EF4444',
    status: 'Work in Progress',
  },
  {
    id: 'berries',
    name: 'Berries',
    description: 'Natural Remedies & Consumables',
    icon: Cherry,
    accent: '#10B981',
    status: 'Work in Progress',
  },
  {
    id: 'natures',
    name: 'Natures',
    description: 'Personality Traits & Stat Influences',
    icon: Heart,
    accent: '#8B5CF6',
    status: 'Work in Progress',
  },
];

export const Pokedex: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DexCategory>('none');

  if (selectedCategory === 'pokemon') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button 
          onClick={() => setSelectedCategory('none')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors group mb-4"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Archives
        </button>
        <PokemonDex />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 py-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black uppercase tracking-tight">
          Archives <span className="text-[var(--accent-primary)]">Terminal</span>
        </h1>
        <p className="text-[var(--text-muted)] text-sm font-medium max-w-lg mx-auto italic opacity-70">
          SELECT A DATA SECTOR TO BEGIN SYNCHRONIZATION. ACCESSING GLOBAL POKÉMON KNOWLEDGE BASE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => cat.id === 'pokemon' && setSelectedCategory('pokemon')}
            className={twMerge(
              "group relative p-8 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[40px] text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-95 overflow-hidden",
              cat.status ? "cursor-not-allowed opacity-80" : "hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-card)]"
            )}
          >
            {/* Background Glow */}
            <div 
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
              style={{ backgroundColor: cat.accent }}
            ></div>

            <div className="relative z-10 flex flex-col h-full gap-8">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg border border-white/5"
                style={{ backgroundColor: `${cat.accent}20`, color: cat.accent }}
              >
                <cat.icon className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                    {cat.name}
                  </h3>
                  {cat.status ? (
                    <span className="text-[8px] font-black uppercase tracking-tighter bg-[var(--bg-main)] px-2 py-1 rounded-md text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {cat.status}
                    </span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
                <p className="text-xs font-bold text-[var(--text-muted)] opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Bottom Bar Decoration */}
            <div 
              className="absolute bottom-0 left-0 h-1 transition-all duration-500 bg-[var(--accent-primary)]"
              style={{ width: cat.id === 'pokemon' ? '0%' : '0%', backgroundColor: cat.accent }}
            ></div>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex justify-center pt-8">
        <div className="px-6 py-3 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-full flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Terminal Online • Encryption Active • PokéAPI Connected</span>
        </div>
      </div>
    </div>
  );
};
