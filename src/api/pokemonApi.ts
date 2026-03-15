import type { Pokemon } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

let cachedNames: string[] | null = null;
let cachedAbilities: string[] | null = null;

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
    if (cachedNames) return cachedNames;
    // There are ~1025 Pokemon as of Gen 9
    const response = await fetch(`${BASE_URL}/pokemon?limit=2000`);
    const data = await response.json();
    cachedNames = data.results.map((p: any) => p.name);
    return cachedNames || [];
  },

  /**
   * Fetch a paged list of Pokemon with their full details
   */
  async getPokedexList(offset: number, limit: number): Promise<Pokemon[]> {
    const listRes = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    const listData = await listRes.json();
    
    const details = await Promise.all(
      listData.results.map((p: { name: string }) => this.getPokemon(p.name))
    );
    return details;
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
  },

  /**
   * Fetch move details
   */
  async getMoveDetails(name: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/move/${name.toLowerCase()}`);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  /**
   * Fetch Pokemon by type
   */
  async getPokemonByType(type: string): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/type/${type.toLowerCase()}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.pokemon.map((p: any) => p.pokemon.name);
  },

  /**
   * Fetch Pokemon by generation (using species then mapping to pokemon)
   */
  async getPokemonByGeneration(gen: number | string): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/generation/${gen.toString().toLowerCase()}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.pokemon_species.map((p: any) => p.name);
  },

  /**
   * Fetch Pokemon by ability
   */
  async getPokemonByAbility(ability: string): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/ability/${ability.toLowerCase()}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.pokemon.map((p: any) => p.pokemon.name);
  },

  /**
   * Fetch a list of all abilities for search
   */
  async getAllAbilities(): Promise<string[]> {
    if (cachedAbilities) return cachedAbilities;
    const response = await fetch(`${BASE_URL}/ability?limit=2000`);
    if (!response.ok) return [];
    const data = await response.json();
    cachedAbilities = data.results.map((a: any) => a.name);
    return cachedAbilities || [];
  }
};
