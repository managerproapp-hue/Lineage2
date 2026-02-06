export interface Item {
  id: string;
  name: string;
  count: number;
  icon?: string; // URL to icon
  type: 'weapon' | 'armor' | 'jewelry' | 'consumable' | 'material' | 'quest' | 'other';
  enchantLevel?: number;
  grade?: 'No Grade' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S80' | 'S84';
}

export interface Equipment {
  helmet?: Item;
  chest?: Item;
  legs?: Item;
  gloves?: Item;
  boots?: Item;
  weapon?: Item;
  shield?: Item;
  necklace?: Item;
  earring1?: Item;
  earring2?: Item;
  ring1?: Item;
  ring2?: Item;
  cloak?: Item;
  shirt?: Item;
  belt?: Item;
}

export interface Subclass {
  id: number;
  level: number;
  class: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sp: number;
  creationDate: string;
}

export interface BossProgress {
  emeraldHorn: boolean;
  dustRider: boolean;
  bleedingFly: boolean;
  blackdaggerWing: boolean;
  shadowSummoner: boolean;
  spikeSlasher: boolean;
  muscleBomber: boolean;
}

export interface QuestTracking {
  isFinished: boolean;
  isRewardCollected: boolean;
  selectedReward?: string; // e.g., 'Vesper Caster'
  bosses: BossProgress;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  class: string; // e.g., Duelist, Cardinal
  race: string; // e.g., Human, Elf
  location: string;
  clan?: string;
  creationDate?: string;
  playTime?: number; // hours
  pvp?: number;
  pk?: number;
  karma?: number;
  noble?: boolean;
  hero?: boolean;
  sp?: number;
  status: {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    cp: number;
    maxCp: number;
  };
  subclasses?: Subclass[];
  equipment: Equipment;
  inventory: Item[];
  warehouse: Item[];
  clanWarehouse?: Item[]; 
  questTracking: QuestTracking; // Replaces 'quests: string[]'
  pets: string[]; // List of pet names
  online: boolean;
  lastAccess: string;
}

export interface Account {
  id: string;
  username: string;
  email: string;
  ip: string;
  lastAccess: string;
  status: 'active' | 'banned' | 'suspended';
  characters: Character[];
}

export interface SearchResult {
  item: Item;
  characterName: string;
  accountName: string;
  location: 'Inventory' | 'Warehouse' | 'Equipped' | 'Clan Warehouse';
}