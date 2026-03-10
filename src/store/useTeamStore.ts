import { create } from 'zustand';
import type { TeamState, TeamMember, Pokemon } from '../types/pokemon';

interface TeamStore extends TeamState {
  addMember: (index: number, pokemon: Pokemon) => void;
  removeMember: (index: number) => void;
  updateMember: (index: number, updates: Partial<TeamMember>) => void;
  setActiveIndex: (index: number) => void;
}

const initialMember: TeamMember = {
  pokemon: null,
  moves: [],
  ability: '',
  item: '',
  nature: 'Hardy',
  evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
};

export const useTeamStore = create<TeamStore>((set) => ({
  members: Array(6).fill(null).map(() => ({ ...initialMember })),
  activeMemberIndex: 0,
  
  addMember: (index, pokemon) => set((state) => {
    const newMembers = [...state.members];
    newMembers[index] = { 
      ...initialMember, 
      pokemon,
      ability: pokemon.abilities[0]?.ability.name || '',
    };
    return { members: newMembers };
  }),

  removeMember: (index) => set((state) => {
    const newMembers = [...state.members];
    newMembers[index] = { ...initialMember };
    return { members: newMembers };
  }),

  updateMember: (index, updates) => set((state) => {
    const newMembers = [...state.members];
    if (newMembers[index]) {
      newMembers[index] = { ...newMembers[index], ...updates };
    }
    return { members: newMembers };
  }),

  setActiveIndex: (index) => set({ activeMemberIndex: index }),
}));
