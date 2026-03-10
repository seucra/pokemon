import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TeamState, TeamMember, Pokemon, Team } from '../types/pokemon';

interface TeamActions {
  addMember: (index: number, pokemon: Pokemon) => void;
  removeMember: (index: number) => void;
  updateMember: (index: number, updates: Partial<TeamMember>) => void;
  setActiveIndex: (index: number) => void;
  setAbility: (index: number, name: string) => void;
  addTeam: (name?: string) => void;
  removeTeam: (id: string) => void;
  setActiveTeamId: (id: string) => void;
  renameTeam: (id: string, name: string) => void;
}

interface TeamStore extends TeamState, TeamActions {
  // Helper to get active team for UI
  getActiveTeam: () => Team;
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

const createEmptyTeam = (name: string): Team => ({
  id: crypto.randomUUID(),
  name,
  members: Array(6).fill(null).map(() => ({ ...initialMember })),
});

const defaultTeam = createEmptyTeam('New Team');

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teams: [defaultTeam],
      activeTeamId: defaultTeam.id,
      activeMemberIndex: 0,

      getActiveTeam: () => {
        const state = get();
        return state.teams.find((t) => t.id === state.activeTeamId) || state.teams[0];
      },

      addTeam: (name = 'New Team') => set((state) => {
        const newTeam = createEmptyTeam(name);
        return {
          teams: [...state.teams, newTeam],
          activeTeamId: newTeam.id,
          activeMemberIndex: 0,
        };
      }),

      removeTeam: (id) => set((state) => {
        if (state.teams.length <= 1) return state; // Don't delete last team
        const newTeams = state.teams.filter((t) => t.id !== id);
        return {
          teams: newTeams,
          activeTeamId: state.activeTeamId === id ? newTeams[0].id : state.activeTeamId,
        };
      }),

      setActiveTeamId: (id) => set({ activeTeamId: id, activeMemberIndex: 0 }),

      renameTeam: (id, name) => set((state) => ({
        teams: state.teams.map((t) => t.id === id ? { ...t, name } : t),
      })),

      setActiveIndex: (index) => set({ activeMemberIndex: index }),

      setAbility: (index, ability) => set((state) => {
        const newTeams = state.teams.map((team) => {
          if (team.id === state.activeTeamId) {
            const newMembers = [...team.members];
            if (newMembers[index]) {
              newMembers[index] = { ...newMembers[index], ability };
            }
            return { ...team, members: newMembers };
          }
          return team;
        });
        return { teams: newTeams };
      }),

      addMember: (index, pokemon) => set((state) => {
        const newTeams = state.teams.map((team) => {
          if (team.id === state.activeTeamId) {
            const newMembers = [...team.members];
            // Prefer non-hidden ability for default
            const defaultAbility = pokemon.abilities.find(a => !a.is_hidden)?.ability.name || pokemon.abilities[0]?.ability.name || '';
            
            newMembers[index] = { 
              ...initialMember, 
              pokemon,
              ability: defaultAbility,
            };
            return { ...team, members: newMembers };
          }
          return team;
        });
        return { teams: newTeams };
      }),

      removeMember: (index) => set((state) => {
        const newTeams = state.teams.map((team) => {
          if (team.id === state.activeTeamId) {
            const newMembers = [...team.members];
            newMembers[index] = { ...initialMember };
            return { ...team, members: newMembers };
          }
          return team;
        });
        return { teams: newTeams };
      }),

      updateMember: (index, updates) => set((state) => {
        const newTeams = state.teams.map((team) => {
          if (team.id === state.activeTeamId) {
            const newMembers = [...team.members];
            if (newMembers[index]) {
              newMembers[index] = { ...newMembers[index], ...updates };
            }
            return { ...team, members: newMembers };
          }
          return team;
        });
        return { teams: newTeams };
      }),
    }),
    {
      name: 'pokemon-craze-storage',
    }
  )
);
