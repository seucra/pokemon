export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' 
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' 
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface Pokemon {
  id: number;
  name: string;
  types: {
    slot: number;
    type: {
      name: PokemonType;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
      showdown?: {
        front_default: string;
      }
    }
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  height: number;
  weight: number;
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
      };
      version_group: {
        name: string;
      };
    }[];
  }[];
}

export interface TeamMember {
  pokemon: Pokemon | null;
  moves: string[];
  ability: string;
  item: string;
  nature: string;
  evs: { [key: string]: number };
  ivs: { [key: string]: number };
}

export interface Team {
  id: string;
  name: string;
  members: (TeamMember | null)[];
}

export interface TeamState {
  teams: Team[];
  activeTeamId: string;
  activeMemberIndex: number;
}
