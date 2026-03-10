import type { PokemonType } from '../types/pokemon';

export type DamageRelation = 0 | 0.25 | 0.5 | 1 | 2 | 4;

export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export const TYPE_DESCRIPTIONS: Record<string, string> = {
  normal: "Standard moves with consistent, reliable damage. Ghost-immune.",
  fire: "Blazing attacks, effective against Grass, Ice, Bug, and Steel.",
  water: "Fluid moves, crushing Fire, Ground, and Rock.",
  electric: "Shocking power. Flying and Water Pokémons' bane.",
  grass: "Nature's force. Overwhelms Water, Ground, and Rock.",
  ice: "Freezing chill. Shatters Dragons, Flying, Grass, and Ground.",
  fighting: "Physical prowess. Breaks Normal, Ice, Rock, Dark, and Steel.",
  poison: "Toxic strikes. Corrodes Grass and Fairy types.",
  ground: "Earthen might. Devastates Fire, Electric, Poison, Rock, and Steel.",
  flying: "Arial supremacy. Swift against Grass, Fighting, and Bug.",
  psychic: "Mental dominance. Strong against Fighting and Poison.",
  bug: "Insect resilience. Bites through Grass, Psychic, and Dark.",
  rock: "Solid impact. Crushes Fire, Ice, Flying, and Bug.",
  ghost: "Ethereal presence. Ghost and Psychic types' nightmare.",
  dragon: "Ancient power. Only weak to other Dragons, Ice, and Fairy.",
  dark: "Shadowy trickery. Effective against Psychic and Ghost.",
  steel: "Indestructible. Shines against Ice, Rock, and Fairy.",
  fairy: "Magical charm. Conquers Dragons, Fighting, and Dark.",
  weakness: "Multiplies incoming damage by x2 or x4. Be careful!",
  resistance: "Halves (x0.5) or quarters (x0.25) incoming damage. Excellent for defending.",
  immunity: "Completely neglects (x0) incoming damage of this type.",
  ability: "A passive effect that grants unique battle advantages.",
  typechart: "A matrix showing how types interact defensively and offensively.",
};

export const getTypeEffectiveness = (attacker: PokemonType, defenders: PokemonType[]): number => {
  return defenders.reduce((acc, defender) => {
    const multiplier = TYPE_CHART[attacker]?.[defender] ?? 1;
    return acc * multiplier;
  }, 1);
};

export const getDefensiveCoverage = (types: PokemonType[]): Record<PokemonType, number> => {
  const coverage: Record<string, number> = {};
  const allTypes: PokemonType[] = Object.keys(TYPE_CHART) as PokemonType[];

  allTypes.forEach((attacker) => {
    coverage[attacker] = getTypeEffectiveness(attacker, types);
  });

  return coverage as Record<PokemonType, number>;
};

export interface TeamCoverageSummary {
  type: PokemonType;
  weak: number; // members weak to this type
  resist: number; // members resistant to this type
  immune: number; // members immune to this type
}

export const getTeamCoverage = (teamTypes: PokemonType[][]): TeamCoverageSummary[] => {
  const allTypes: PokemonType[] = Object.keys(TYPE_CHART) as PokemonType[];
  
  return allTypes.map((attacker) => {
    let weak = 0;
    let resist = 0;
    let immune = 0;

    teamTypes.forEach((defTypes) => {
      const mult = getTypeEffectiveness(attacker, defTypes);
      if (mult > 1) weak++;
      else if (mult === 0) immune++;
      else if (mult < 1) resist++;
    });

    return { type: attacker, weak, resist, immune };
  });
};
