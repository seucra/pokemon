import type { Pokemon } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  /**
   * Fetch a single Pokemon by name or ID
   */
  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
    if (!response.ok) throw new Error('Pokemon not found');
    return response.json();
  },

  /**
   * Fetch a list of Pokemon for search/autocomplete
   * This fetches names to keep the payload small
   */
  async getAllPokemonNames(): Promise<string[]> {
    // There are ~1025 Pokemon as of Gen 9
    const response = await fetch(`${BASE_URL}/pokemon?limit=2000`);
    const data = await response.json();
    return data.results.map((p: any) => p.name);
  },

  /**
   * Fetch ability effect description
   */
  async getAbilityDescription(name: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/ability/${name.toLowerCase()}`);
      if (!response.ok) return "No description available.";
      const data = await response.json();
      const entry = data.effect_entries.find((e: any) => e.language.name === 'en') || data.flavor_text_entries.find((e: any) => e.language.name === 'en');
      return entry?.short_effect || entry?.effect || entry?.flavor_text || "No description available.";
    } catch {
      return "Failed to load description.";
    }
  }
};
