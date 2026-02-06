import { Account, Character, Item } from './types';

const createItem = (id: string, name: string, count: number, type: any, grade: any = 'S', enchant: number = 0): Item => ({
  id, name, count, type, grade, enchantLevel: enchant, icon: `https://picsum.photos/seed/${id}/64/64`
});

const mockInventory: Item[] = [
  createItem('i1', 'Adena', 1266037924, 'other', 'No Grade'),
  createItem('i2', 'Soul Ore', 25900, 'consumable', 'No Grade'),
  createItem('i3', 'Blessed Scroll: Enchant Weapon (S-Grade)', 3, 'consumable', 'S'),
  createItem('i4', 'Draconic Bow', 1, 'weapon', 'S', 12),
  createItem('i5', 'Arcana Mace', 1, 'weapon', 'S', 4),
  createItem('i6', 'Major Arcana Robe', 1, 'armor', 'S'),
];

const mockWarehouse: Item[] = [
  createItem('w1', 'Animal Bone', 4000, 'material', 'No Grade'),
  createItem('w2', 'Varnish', 200, 'material', 'No Grade'),
  createItem('w3', 'Recipe: Tateossian Necklace (100%)', 1, 'other', 'S'),
];

const mockClanWarehouse: Item[] = [
  createItem('cw1', 'Clan Oath Armor', 5, 'armor', 'B'),
  createItem('cw2', 'Blood Mark', 50, 'material', 'No Grade'),
  createItem('cw3', 'Proof of Blood', 100, 'material', 'No Grade'),
  createItem('cw4', 'Castle Gate Key', 2, 'quest', 'No Grade'),
  createItem('cw5', 'Draconic Bow Shaft', 15, 'material', 'S'),
];

const char1: Character = {
  id: 'c1',
  name: 'Binger',
  level: 85,
  class: 'Spectral Dancer',
  race: 'Dark Elf',
  location: 'Aden Town',
  clan: 'OnlyFriends',
  creationDate: '2007-08-15 01:05',
  playTime: 6474,
  pvp: 115,
  pk: 3,
  karma: 0,
  noble: true,
  hero: false,
  sp: 1511120536,
  online: true,
  lastAccess: '2024-02-04 11:02',
  status: { hp: 6720, maxHp: 6720, mp: 4348, maxMp: 4348, cp: 2735, maxCp: 2735 },
  subclasses: [
    { id: 1, level: 77, class: 'Titan', hp: 4946, maxHp: 4946, mp: 1667, maxMp: 1667, sp: 30643764, creationDate: '2010-04-13' },
    { id: 2, level: 78, class: 'Sagittarius', hp: 5206, maxHp: 5206, mp: 2735, maxMp: 2735, sp: 4273464, creationDate: '2010-08-27' },
    { id: 3, level: 80, class: 'Doomcryer', hp: 4348, maxHp: 4348, mp: 2898, maxMp: 2898, sp: 236245253, creationDate: '2011-05-29' },
  ],
  equipment: {
    helmet: createItem('e1', 'Dynasty Helmet', 1, 'armor', 'S80', 3),
    chest: createItem('e2', 'Dynasty Breastplate', 1, 'armor', 'S80', 3),
    legs: createItem('e3', 'Dynasty Gaiters', 1, 'armor', 'S80', 3),
    weapon: createItem('e4', 'Icarus Dual Swords', 1, 'weapon', 'S80', 7),
    necklace: createItem('e5', 'Frintezza Necklace', 1, 'jewelry', 'S', 3),
    ring1: createItem('e6', 'Queen Ant Ring', 1, 'jewelry', 'B', 3),
    ring2: createItem('e7', 'Baium Ring', 1, 'jewelry', 'S', 3),
    earring1: createItem('e13', 'Zaken Earring', 1, 'jewelry', 'S', 3),
    gloves: createItem('e14', 'Dynasty Gloves', 1, 'armor', 'S80', 3),
    boots: createItem('e15', 'Dynasty Boots', 1, 'armor', 'S80', 3),
    cloak: createItem('e16', 'Zaken Cloak', 1, 'armor', 'S80'),
    shirt: createItem('e17', 'Striped Shirt', 1, 'armor', 'A', 4),
    belt: createItem('e18', 'Rune Belt', 1, 'armor', 'S', 2)
  },
  inventory: mockInventory,
  warehouse: mockWarehouse,
  clanWarehouse: mockClanWarehouse,
  questTracking: {
    isFinished: true,
    isRewardCollected: true,
    selectedReward: 'Vesper Dual Swords',
    bosses: {
      emeraldHorn: true,
      dustRider: true,
      bleedingFly: true,
      blackdaggerWing: true,
      shadowSummoner: true,
      spikeSlasher: true,
      muscleBomber: true
    }
  },
  pets: ['Improved Kookaburra (Lvl 85)', 'Strider (Lvl 70)']
};

const char2: Character = {
  id: 'c2',
  name: 'HealerPro',
  level: 80,
  class: 'Cardinal',
  race: 'Human',
  location: 'Rune Castle',
  clan: 'HealingHands',
  creationDate: '2023-01-10 10:00',
  playTime: 120,
  pvp: 0,
  pk: 0,
  karma: 0,
  noble: false,
  hero: false,
  sp: 5000000,
  online: false,
  lastAccess: '2024-02-01 09:30',
  status: { hp: 4500, maxHp: 4500, mp: 6000, maxMp: 6000, cp: 1500, maxCp: 1500 },
  subclasses: [],
  equipment: {
    chest: createItem('e8', 'Vesper Noble Tunic', 1, 'armor', 'S84', 3),
    weapon: createItem('e9', 'Vesper Caster', 1, 'weapon', 'S84', 4),
  },
  inventory: [createItem('i10', 'Spirit Ore', 5000, 'consumable', 'No Grade')],
  warehouse: [],
  questTracking: {
    isFinished: false,
    isRewardCollected: false,
    bosses: {
      emeraldHorn: true,
      dustRider: true,
      bleedingFly: false,
      blackdaggerWing: false,
      shadowSummoner: true,
      spikeSlasher: false,
      muscleBomber: false
    }
  },
  pets: []
};

const char3: Character = {
  id: 'c3',
  name: 'TankMachine',
  level: 78,
  class: 'Phoenix Knight',
  race: 'Human',
  location: 'Giran Harbor',
  clan: 'IronWall',
  creationDate: '2022-11-05 14:20',
  playTime: 340,
  pvp: 15,
  pk: 0,
  karma: 0,
  noble: true,
  hero: false,
  sp: 12000000,
  online: false,
  lastAccess: '2023-12-15 14:20',
  status: { hp: 12000, maxHp: 12000, mp: 2000, maxMp: 2000, cp: 5000, maxCp: 5000 },
  subclasses: [
     { id: 1, level: 75, class: 'Warlord', hp: 8000, maxHp: 8000, mp: 1500, maxMp: 1500, sp: 2000000, creationDate: '2023-01-01' },
  ],
  equipment: {
    chest: createItem('e10', 'Imperial Crusader Breastplate', 1, 'armor', 'S', 3),
    weapon: createItem('e11', 'Forgotten Blade', 1, 'weapon', 'S', 0),
    shield: createItem('e12', 'Imperial Crusader Shield', 1, 'armor', 'S', 3),
  },
  inventory: [createItem('i12', 'Crystal (S-Grade)', 500, 'material', 'S')],
  warehouse: [createItem('w4', 'Draconic Bow Shaft', 12, 'material', 'S')],
  questTracking: {
    isFinished: false,
    isRewardCollected: false,
    bosses: {
      emeraldHorn: false,
      dustRider: false,
      bleedingFly: false,
      blackdaggerWing: false,
      shadowSummoner: false,
      spikeSlasher: false,
      muscleBomber: false
    }
  },
  pets: ['Wolf (Lvl 55)']
};

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc1',
    username: 'jcbprofesor@hotmail.com',
    email: 'jcbprofesor@hotmail.com',
    ip: '192.168.1.10',
    lastAccess: '2024-02-04 11:02',
    status: 'active',
    characters: [char1, char2]
  },
  {
    id: 'acc2',
    username: 'alt_account_01',
    email: 'alt01@gmail.com',
    ip: '192.168.1.10',
    lastAccess: '2023-12-15 14:20',
    status: 'active',
    characters: [char3]
  },
  {
    id: 'acc3',
    username: 'shop_mule',
    email: 'trader@yahoo.com',
    ip: '85.23.11.40',
    lastAccess: '2023-11-01 08:00',
    status: 'suspended',
    characters: []
  }
];