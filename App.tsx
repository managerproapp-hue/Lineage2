import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Users, 
  MapPin, 
  Shield, 
  Sword, 
  Search, 
  Box, 
  ScrollText, 
  Dog,
  Menu,
  X,
  Database,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Globe,
  Coins,
  Plus,
  Crown,
  Skull,
  Check,
  CheckCircle2,
  XCircle,
  Trophy,
  Copy,
  FileJson,
  Upload,
  Sparkles,
  ArrowRight,
  Save,
  Grid,
  Code,
  Link as LinkIcon,
  Trash2,
  Lock,
  Unlock,
  Camera,
  Loader2,
  Image as ImageIcon,
  ClipboardCheck,
  Terminal,
  Pencil,
  Undo2,
  Calendar,
  Download,
  Home,
  Activity,
  TrendingUp,
  Library,
  HardDrive,
  RefreshCw,
  FileUp,
  FileDown
} from 'lucide-react';
import { MOCK_ACCOUNTS } from './constants';
import { GLOBAL_ITEM_MAP, MASTER_ITEM_LIST } from './items_db';
import { Account, Character, Item, SearchResult, Equipment, Subclass, QuestTracking } from './types';

// --- Static Data: L2 Class Grouping & Hierarchy (Based on Image 2) ---

const L2_RACES = ['Human', 'Elf', 'Dark Elf', 'Orc', 'Dwarf', 'Kamael'];

const L2_CLASSES_BY_RACE: Record<string, string[]> = {
  'Human': [
    // Fighter
    'Duelist', 'Dreadnought', 'Phoenix Knight', 'Hell Knight', 'Adventurer', 'Sagittarius', 'Grand Khavatari', 'Titan',
    // Mage
    'Archmage', 'Soultaker', 'Arcana Lord', 'Cardinal', 'Hierophant'
  ],
  'Elf': [
    // Fighter
    'Eva\'s Templar', 'Sword Muse', 'Wind Rider', 'Moonlight Sentinel',
    // Mage
    'Mystic Muse', 'Elemental Master', 'Eva\'s Saint'
  ],
  'Dark Elf': [
    // Fighter
    'Shillien Templar', 'Spectral Dancer', 'Ghost Hunter', 'Ghost Sentinel',
    // Mage
    'Storm Screamer', 'Spectral Master', 'Shillien Saint'
  ],
  'Orc': [
    // Fighter
    'Titan', 'Grand Khavatari',
    // Mage
    'Dominator', 'Doomcryer'
  ],
  'Dwarf': [
    'Fortune Seeker', 'Maestro'
  ],
  'Kamael': [
    'Doombringer', 'Soul Hound', 'Trickster', 'Judicator'
  ]
};

// Helper for grouping icons logic
const CLASS_GROUPS: Record<string, string[]> = {
  'Human Fighter': ['Duelist', 'Dreadnought', 'Phoenix Knight', 'Hell Knight', 'Adventurer', 'Sagittarius', 'Titan', 'Grand Khavatari'], 
  'Human Mage': ['Archmage', 'Soultaker', 'Arcana Lord', 'Cardinal', 'Hierophant'],
  'Elf Fighter': ['Eva\'s Templar', 'Sword Muse', 'Wind Rider', 'Moonlight Sentinel'],
  'Elf Mage': ['Mystic Muse', 'Elemental Master', 'Eva\'s Saint'],
  'Dark Elf Fighter': ['Shillien Templar', 'Spectral Dancer', 'Ghost Hunter', 'Ghost Sentinel'],
  'Dark Elf Mage': ['Storm Screamer', 'Spectral Master', 'Shillien Saint'],
  'Orc Fighter': ['Titan', 'Grand Khavatari'],
  'Orc Mage': ['Dominator', 'Doomcryer'],
  'Dwarf Fighter': ['Fortune Seeker', 'Maestro'],
  'Kamael': ['Doombringer', 'Soul Hound', 'Trickster', 'Judicator']
};

const getGroupForClass = (className: string): string => {
  for (const [group, classes] of Object.entries(CLASS_GROUPS)) {
    if (classes.some(c => c.toLowerCase() === className.toLowerCase() || className.toLowerCase().includes(c.toLowerCase()))) {
      return group;
    }
  }
  return 'Unknown';
};

// --- Helper Functions ---
const getItemIcon = (item: Item, registry: Record<string, string>) => {
  // 1. Check registry (User imported images - Priority 1)
  if (registry[item.name]) return registry[item.name];

  // 2. Check Item Static Definition (Priority 2)
  // Only use if it's a real URL and not a Picsum placeholder (unless specifically set)
  if (item.icon && item.icon.startsWith('http') && !item.icon.includes('picsum')) return item.icon;

  // 3. Check MASTER DB (Priority 3)
  // Logic: Remove "+3 ", "+10 ", etc. from the beginning
  const cleanName = item.name
    .replace(/^\+\d+\s+/, '') // Removes "+4 " from start
    .trim()
    .toLowerCase();

  const dbImage = GLOBAL_ITEM_MAP[cleanName];
  if (dbImage) return dbImage;

  // 4. Fallback: "No Encontrado" (Visual Placeholder)
  // We use the unique hashed image as the "Not Found" visual representation to keep aesthetics
  let hash = 0;
  for (let i = 0; i < item.name.length; i++) {
    hash = item.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `https://picsum.photos/seed/${Math.abs(hash)}/64/64`;
};

// --- Components ---

// 0. Modals

const AddAccountModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (name: string, ip: string) => void }) => {
  const [username, setUsername] = useState('');
  const [ip, setIp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && ip) {
      onAdd(username, ip);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
          
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Users className="text-teal-500" /> Nueva Cuenta
          </h2>
          <p className="text-slate-400 text-sm mb-6">Registra una nueva cuenta de juego en el panel.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Usuario / Email</label>
               <input 
                 autoFocus
                 type="text" 
                 value={username}
                 onChange={e => setUsername(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                 placeholder="Ej: l2player@mail.com"
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección IP (Último Acceso)</label>
               <input 
                 type="text" 
                 value={ip}
                 onChange={e => setIp(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                 placeholder="Ej: 192.168.1.1"
               />
             </div>
             <button type="submit" disabled={!username || !ip} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
               Crear Cuenta
             </button>
          </form>
       </div>
    </div>
  );
};

const AddCharacterModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (name: string, level: number, charClass: string, race: string) => void }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('85');
  const [charClass, setCharClass] = useState('');
  const [race, setRace] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && level && charClass && race) {
      onAdd(name, parseInt(level), charClass, race);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
          
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Shield className="text-teal-500" /> Nuevo Personaje (Manual)
          </h2>
          <p className="text-slate-400 text-sm mb-6">Añade un personaje manualmente a la cuenta.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
               <input 
                 autoFocus
                 type="text" 
                 value={name}
                 onChange={e => setName(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                 placeholder="Ej: LordWind"
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nivel</label>
                   <input 
                     type="number" 
                     value={level}
                     onChange={e => setLevel(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                     placeholder="85"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Raza</label>
                   <input 
                     type="text" 
                     value={race}
                     onChange={e => setRace(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                     placeholder="Ej: Human"
                   />
                </div>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Clase</label>
               <input 
                 type="text" 
                 value={charClass}
                 onChange={e => setCharClass(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                 placeholder="Ej: Duelist"
               />
             </div>
             <button type="submit" disabled={!name || !level || !charClass || !race} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
               Crear Personaje
             </button>
          </form>
       </div>
    </div>
  );
};

// --- Data Management Modal (Backup/Restore) ---
interface DataManagementModalProps {
  onClose: () => void;
  currentAccounts: Account[];
  currentItemRegistry: Record<string, string>;
  onRestore: (accounts?: Account[], registry?: Record<string, string>) => void;
}

const DataManagementModal = ({ onClose, currentAccounts, currentItemRegistry, onRestore }: DataManagementModalProps) => {
  const [exportOptions, setExportOptions] = useState({ accounts: true, registry: true });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<{ accounts?: Account[], registry?: Record<string, string> } | null>(null);
  const [importOptions, setImportOptions] = useState({ accounts: false, registry: false });

  const handleExport = () => {
    const dataToExport: any = {
      meta: {
        date: new Date().toISOString(),
        version: "1.0",
        app: "l2-dashboard"
      }
    };

    if (exportOptions.accounts) dataToExport.accounts = currentAccounts;
    if (exportOptions.registry) dataToExport.registry = currentItemRegistry;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `L2Dashboard_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (!json.meta || json.meta.app !== "l2-dashboard") {
            alert("Archivo no válido o formato incorrecto.");
            setImportFile(null);
            return;
          }
          setImportPreview({
            accounts: json.accounts,
            registry: json.registry
          });
          // Default select available options
          setImportOptions({
            accounts: !!json.accounts,
            registry: !!json.registry
          });
        } catch (err) {
          alert("Error al leer el archivo JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (!importPreview) return;
    
    const accountsToRestore = importOptions.accounts ? importPreview.accounts : undefined;
    const registryToRestore = importOptions.registry ? importPreview.registry : undefined;

    onRestore(accountsToRestore, registryToRestore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-700 shadow-2xl p-8 relative flex flex-col md:flex-row gap-8 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white z-10"><X /></button>

        {/* Export Section */}
        <div className="flex-1 flex flex-col relative group">
           <div className="absolute inset-0 bg-teal-500/5 rounded-2xl -m-4 z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10">
             <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <FileDown className="text-teal-500" /> Exportar (Backup)
             </h2>
             <p className="text-slate-400 text-sm mb-6">Descarga una copia de seguridad de tus datos actuales.</p>
             
             <div className="space-y-4 mb-8 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
               <label className="flex items-center gap-3 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={exportOptions.accounts} 
                   onChange={e => setExportOptions({...exportOptions, accounts: e.target.checked})}
                   className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-teal-600 focus:ring-teal-500" 
                 />
                 <div>
                    <span className="block text-white font-bold">Cuentas y Personajes</span>
                    <span className="text-xs text-slate-500">{currentAccounts.length} cuentas registradas</span>
                 </div>
               </label>
               
               <label className="flex items-center gap-3 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={exportOptions.registry} 
                   onChange={e => setExportOptions({...exportOptions, registry: e.target.checked})}
                   className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-teal-600 focus:ring-teal-500" 
                 />
                 <div>
                    <span className="block text-white font-bold">Items Manuales (Personalizados)</span>
                    <span className="text-xs text-slate-500">{Object.keys(currentItemRegistry).length} items en base de datos local</span>
                 </div>
               </label>
             </div>

             <button 
               onClick={handleExport}
               className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-auto"
             >
               <Download size={20} /> DESCARGAR DATOS
             </button>
           </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-slate-700"></div>

        {/* Import Section */}
        <div className="flex-1 flex flex-col relative group">
           <div className="absolute inset-0 bg-amber-500/5 rounded-2xl -m-4 z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10">
             <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <FileUp className="text-amber-500" /> Importar (Restaurar)
             </h2>
             <p className="text-slate-400 text-sm mb-6">Sube un archivo de backup para actualizar tus datos.</p>

             {!importFile ? (
               <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-amber-500 hover:bg-slate-800/30 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all mb-4 min-h-[200px]">
                 <Upload size={32} className="text-slate-500 mb-2" />
                 <span className="text-slate-300 font-bold">Click para subir JSON</span>
                 <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
               </label>
             ) : (
               <div className="space-y-4 mb-4">
                  <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded-xl flex items-center justify-between">
                     <span className="text-amber-200 text-sm truncate max-w-[200px]">{importFile.name}</span>
                     <button onClick={() => { setImportFile(null); setImportPreview(null); }} className="text-amber-500 hover:text-amber-400 text-xs font-bold uppercase">Cambiar</button>
                  </div>

                  {importPreview && (
                    <div className="space-y-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      {importPreview.accounts && (
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={importOptions.accounts} 
                             onChange={e => setImportOptions({...importOptions, accounts: e.target.checked})}
                             className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-amber-600 focus:ring-amber-500" 
                           />
                           <div>
                              <span className="block text-white font-bold">Restaurar Cuentas</span>
                              <span className="text-xs text-slate-500">Contiene {importPreview.accounts.length} cuentas</span>
                           </div>
                         </label>
                      )}
                      
                      {importPreview.registry && (
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={importOptions.registry} 
                             onChange={e => setImportOptions({...importOptions, registry: e.target.checked})}
                             className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-amber-600 focus:ring-amber-500" 
                           />
                           <div>
                              <span className="block text-white font-bold">Fusionar Items Manuales</span>
                              <span className="text-xs text-slate-500">Contiene {Object.keys(importPreview.registry).length} items</span>
                           </div>
                         </label>
                      )}
                    </div>
                  )}
               </div>
             )}

             <button 
               onClick={handleImport}
               disabled={!importFile || (!importOptions.accounts && !importOptions.registry)}
               className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-auto"
             >
               <RefreshCw size={20} /> RESTAURAR SELECCIÓN
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};


// --- Digitalization Bridge Component ---

const PROMPT_MAESTRO_CHAR = `Actúa como un sistema experto de digitalización de perfiles de Lineage 2.
Analiza la imagen proporcionada (captura de web estilo Lineage2.es).

Extrae los siguientes datos con precisión quirúrgica:
1. **DATOS DEL PERSONAJE**: Nombre, Raza, Clase, Clan, Ubicación.
2. **ESTADÍSTICAS**: Nivel, HP, MP, CP, SP.
3. **EQUIPADO**: Analiza la cuadrícula de iconos para equipment (weapon, chest, legs...).
4. **INVENTARIO y ALMACÉN**: Lista completa.

**FORMATO DE SALIDA (JSON ÚNICO Y VÁLIDO):**
{
  "name": "String",
  "level": Number,
  "class": "String",
  "race": "String",
  "clan": "String",
  "location": "String",
  "status": { "hp": Number, "mp": Number, "cp": Number, "maxHp": Number, "maxMp": Number, "maxCp": Number },
  "equipment": { "helmet": { "name": "...", "enchantLevel": 0 }, ... },
  "inventory": [ { "name": "...", "count": 1, "enchantLevel": 0, "type": "consumable|material|equipment" } ],
  "warehouse": [ ... ]
}`;

const PROMPT_MAESTRO_ITEMS = `Actúa como un sistema experto de digitalización de inventarios de Lineage 2.
Analiza la imagen o texto proporcionado que representa un inventario de juego.

Tu objetivo es extraer EXCLUSIVAMENTE las listas de objetos y clasificarlas según si parecen pertenecer al Inventario principal, Almacén (Warehouse) o Almacén de Clan.

**Instrucciones:**
1. Identifica nombres de items, cantidades y niveles de encantamiento (ej: +4 Draconic Bow).
2. Si la imagen muestra pestañas, usa esa info para clasificar (Inventory vs Warehouse). Si no está claro, ponlo todo en 'inventory'.
3. Ignora stats de personaje, solo importan los items.

**FORMATO DE SALIDA (JSON ÚNICO Y VÁLIDO):**
Devuelve SOLO el JSON:
{
  "inventory": [
    { "name": "String (nombre limpio sin +)", "count": Number, "enchantLevel": Number, "type": "consumable|material|equipment|quest|other" }
  ],
  "warehouse": [
    { "name": "String", "count": Number, "enchantLevel": Number, "type": "..." }
  ],
  "clanWarehouse": [
    { "name": "String", "count": Number, "enchantLevel": Number, "type": "..." }
  ]
}`;

interface DigitalizationModalProps {
   onClose: () => void;
   onImport: (data: any) => void;
   mode: 'character' | 'items';
}

const DigitalizationBridgeModal = ({ onClose, onImport, mode }: DigitalizationModalProps) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const promptText = mode === 'character' ? PROMPT_MAESTRO_CHAR : PROMPT_MAESTRO_ITEMS;
  const title = mode === 'character' ? 'Importador de Personaje' : 'Importador de Inventarios';
  const subtitle = mode === 'character' ? 'Crea un personaje nuevo desde una imagen' : 'Actualiza items existentes desde una imagen';

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = () => {
    try {
      setError(null);
      const cleanJson = jsonInput.replace(/```json/g, '').replace(/```/g, '').trim();
      
      if (!cleanJson) {
         setError("El campo está vacío.");
         return;
      }

      const parsed = JSON.parse(cleanJson);
      
      if (mode === 'character' && !parsed.name) {
         throw new Error("El JSON no contiene un nombre de personaje.");
      }
      if (mode === 'items' && (!parsed.inventory && !parsed.warehouse && !parsed.clanWarehouse)) {
         throw new Error("El JSON no contiene listas de objetos válidas (inventory, warehouse, etc).");
      }
      
      onImport(parsed);
      onClose();
    } catch (e) {
      console.error(e);
      setError("Error al procesar el JSON. Asegúrate de haber copiado solo la respuesta de la IA.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 font-sans">
       <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-50">
          <X size={32} />
       </button>
       
       <div className="w-full max-w-7xl h-full max-h-[90vh] grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          
          <div className="lg:col-span-2 lg:hidden mb-4">
             <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2">
                <Sparkles size={14} /> Puente de Digitalización IA
             </div>
             <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>

          <div className="bg-[#0f172a] rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paso 1</span>
             </div>

             <h3 className="text-4xl font-black text-white mb-2 leading-tight">
               COPIA EL <br/>
               <span className="text-emerald-400">PROMPT MAESTRO</span>
             </h3>
             <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
               {subtitle} copiando este prompt en tu IA favorita (ChatGPT, Gemini, etc) y adjuntando la captura de pantalla.
             </p>

             <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-800 p-4 mb-8 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-red-500"></div>
                   <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap pt-4 h-full overflow-y-auto opacity-70">
                   {promptText.slice(0, 400)}...
                   <br/>
                   <span className="text-slate-700 italic">[...contenido completo oculto...]</span>
                </pre>
             </div>

             <button 
               onClick={handleCopyPrompt}
               className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
             >
                {copied ? <CheckCircle2 className="text-green-600" /> : <Copy />}
                {copied ? '¡COPIADO AL PORTAPAPELES!' : 'COPIAR PROMPT'}
             </button>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl flex flex-col relative overflow-hidden">
             
             <div className="flex items-center gap-3 mb-6">
                <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paso 2</span>
             </div>

             <h3 className="text-4xl font-black text-slate-900 mb-2 leading-tight">
               IMPORTA EL <br/>
               <span className="text-emerald-600">RESULTADO</span>
             </h3>
             <p className="text-slate-500 mb-6 leading-relaxed">
               Pega aquí el código JSON generado. {mode === 'items' ? 'El sistema detectará las listas de items y actualizará el inventario actual.' : 'El sistema creará un nuevo personaje.'}
             </p>

             <div className="flex-1 relative mb-6">
                <textarea 
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Pega el código JSON aquí..."
                  className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-mono text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all placeholder-slate-300"
                />
             </div>

             {error && (
               <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <XCircle size={16} /> {error}
               </div>
             )}

             <button 
               onClick={handleProcess}
               disabled={!jsonInput}
               className="w-full bg-slate-400 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
             >
                <FileJson />
                {mode === 'character' ? 'CREAR PERSONAJE' : 'ACTUALIZAR ITEMS'}
             </button>
          </div>

       </div>
    </div>
  );
};

// 0.1 Dashboard Component (Updated to include Item DB View)
const Dashboard = ({ 
  accounts, 
  itemRegistry, 
  onAddItem 
}: { 
  accounts: Account[], 
  itemRegistry: Record<string, string>,
  onAddItem: (name: string, url: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'database'>('stats');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');

  const stats = useMemo(() => {
    let totalAdena = 0;
    let weaponsS = 0;
    let weaponsS80 = 0;
    let weaponsS84 = 0;
    let armorsS = 0;
    let armorsS80 = 0;
    let armorsS84 = 0;

    const allCharacters: Character[] = [];

    accounts.forEach(acc => {
      acc.characters.forEach(char => {
        allCharacters.push(char);

        // Calculate Adena
        const adenaItem = char.inventory.find(i => i.name.toLowerCase() === 'adena') || char.warehouse.find(i => i.name.toLowerCase() === 'adena');
        if (adenaItem) totalAdena += adenaItem.count;

        // Helper to check items
        const checkItem = (item?: Item) => {
          if (!item || !item.grade) return;
          const isWeapon = item.type === 'weapon';
          const isArmor = item.type === 'armor' || item.type === 'jewelry'; // Counting jewelry as armor for grade stats
          
          if (item.grade === 'S') {
             if (isWeapon) weaponsS += item.count || 1;
             if (isArmor) armorsS += item.count || 1;
          } else if (item.grade === 'S80') {
             if (isWeapon) weaponsS80 += item.count || 1;
             if (isArmor) armorsS80 += item.count || 1;
          } else if (item.grade === 'S84') {
             if (isWeapon) weaponsS84 += item.count || 1;
             if (isArmor) armorsS84 += item.count || 1;
          }
        };

        // Check Inventory
        char.inventory.forEach(checkItem);
        // Check Warehouse
        char.warehouse.forEach(checkItem);
        // Check Clan Warehouse (if applicable)
        char.clanWarehouse?.forEach(checkItem);
        // Check Equipment
        Object.values(char.equipment).forEach(checkItem);
      });
    });

    // Top Characters
    const topCharacters = [...allCharacters].sort((a, b) => b.level - a.level).slice(0, 5);

    // Top Clans
    const clanMap: Record<string, number> = {};
    allCharacters.forEach(c => {
       if (c.clan) {
          clanMap[c.clan] = (clanMap[c.clan] || 0) + 1;
       }
    });
    const topClans = Object.entries(clanMap)
       .map(([name, count]) => ({ name, count }))
       .sort((a, b) => b.count - a.count)
       .slice(0, 5);

    return { totalAdena, weaponsS, weaponsS80, weaponsS84, armorsS, armorsS80, armorsS84, topCharacters, topClans };
  }, [accounts]);

  // Combined List for Database View
  const combinedItemList = useMemo(() => {
     // Start with Master DB
     const list = [...MASTER_ITEM_LIST];
     
     // Add User Registry items (map to same format)
     Object.entries(itemRegistry).forEach(([name, url]) => {
        // Avoid duplicates if name exists in Master
        if (!list.find(i => i.item_name.toLowerCase() === name.toLowerCase())) {
           list.push({
             grade: 'Unknown',
             item_id: 0,
             item_name: name,
             image_url: url
           });
        }
     });
     
     if (!searchTerm) return list;
     return list.filter(i => i.item_name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [itemRegistry, searchTerm]);

  const formatAdena = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(newItemName && newItemUrl) {
      onAddItem(newItemName, newItemUrl);
      setNewItemName('');
      setNewItemUrl('');
      alert("Item añadido a la base de datos local.");
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
         <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Activity className="text-teal-500" /> DASHBOARD
         </h1>
         <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'stats' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <BarChart3 size={16} /> Resumen
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'database' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Library size={16} /> Base de Datos de Items
            </button>
         </div>
       </div>

       {activeTab === 'stats' ? (
         <>
           {/* Top Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Economy */}
              <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Coins size={64} className="text-amber-400" />
                 </div>
                 <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-1">Economía Total</h3>
                 <div className="text-4xl font-black text-white">{formatAdena(stats.totalAdena)}</div>
                 <div className="text-slate-400 text-sm mt-1">Adena en el servidor</div>
              </div>

              {/* High Grade Weapons */}
              <div className="bg-gradient-to-br from-red-900/40 to-slate-900 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Sword size={64} className="text-red-400" />
                 </div>
                 <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-1">Arsenal (Armas S+)</h3>
                 <div className="flex items-end gap-4 mt-2">
                    <div>
                       <span className="text-2xl font-bold text-white block">{stats.weaponsS}</span>
                       <span className="text-[10px] text-red-300 uppercase bg-red-900/50 px-1.5 rounded">Grade S</span>
                    </div>
                    <div>
                       <span className="text-2xl font-bold text-white block">{stats.weaponsS80}</span>
                       <span className="text-[10px] text-red-300 uppercase bg-red-900/50 px-1.5 rounded">S80</span>
                    </div>
                    <div>
                       <span className="text-2xl font-bold text-white block">{stats.weaponsS84}</span>
                       <span className="text-[10px] text-red-300 uppercase bg-red-900/50 px-1.5 rounded">S84</span>
                    </div>
                 </div>
              </div>

               {/* High Grade Armors */}
               <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Shield size={64} className="text-blue-400" />
                 </div>
                 <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-1">Armaduras (S+)</h3>
                 <div className="flex items-end gap-4 mt-2">
                    <div>
                       <span className="text-2xl font-bold text-white block">{stats.armorsS}</span>
                       <span className="text-[10px] text-blue-300 uppercase bg-blue-900/50 px-1.5 rounded">Grade S</span>
                    </div>
                    <div>
                       <span className="text-2xl font-bold text-white block">{stats.armorsS80}</span>
                       <span className="text-[10px] text-blue-300 uppercase bg-blue-900/50 px-1.5 rounded">S80</span>
                    </div>
                    <div>
                       <span className="text-2xl font-bold text-white block">{stats.armorsS84}</span>
                       <span className="text-[10px] text-blue-300 uppercase bg-blue-900/50 px-1.5 rounded">S84</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Rankings Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Level */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} /> Top Personajes (Nivel)
                 </h3>
                 <div className="space-y-3">
                    {stats.topCharacters.map((char, idx) => (
                       <div key={char.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800/50">
                          <div className="flex items-center gap-4">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-slate-400 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                {idx + 1}
                             </div>
                             <div>
                                <div className="font-bold text-white">{char.name}</div>
                                <div className="text-xs text-slate-500">{char.class}</div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-yellow-500 font-bold text-lg">{char.level}</div>
                             <div className="text-[10px] text-slate-600 uppercase">Level</div>
                          </div>
                       </div>
                    ))}
                    {stats.topCharacters.length === 0 && <div className="text-slate-500 italic text-center py-4">Sin datos</div>}
                 </div>
              </div>

              {/* Top Clans */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Crown className="text-purple-500" size={20} /> Top Clanes (Miembros)
                 </h3>
                 <div className="space-y-3">
                    {stats.topClans.map((clan, idx) => (
                       <div key={clan.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800/50">
                          <div className="flex items-center gap-4">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-400`}>
                                {idx + 1}
                             </div>
                             <div>
                                <div className="font-bold text-white">{clan.name}</div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-purple-400 font-bold text-lg">{clan.count}</div>
                             <div className="text-[10px] text-slate-600 uppercase">Miembros</div>
                          </div>
                       </div>
                    ))}
                     {stats.topClans.length === 0 && <div className="text-slate-500 italic text-center py-4">Sin datos</div>}
                 </div>
              </div>
           </div>
         </>
       ) : (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Database View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Add New Item Form */}
              <div className="lg:col-span-1">
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <Plus size={20} className="text-teal-500" /> Agregar Item Manual
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">
                       Si un item no aparece en la base de datos maestra (`items_db.ts`), puedes agregarlo temporalmente aquí.
                    </p>
                    <form onSubmit={handleManualAdd} className="space-y-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Exacto del Item</label>
                          <input 
                            type="text" 
                            value={newItemName}
                            onChange={e => setNewItemName(e.target.value)}
                            placeholder="Ej: Arcana Mace"
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL de la Imagen</label>
                          <input 
                            type="text" 
                            value={newItemUrl}
                            onChange={e => setNewItemUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                          />
                       </div>
                       <button type="submit" disabled={!newItemName || !newItemUrl} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                          Guardar Item
                       </button>
                    </form>
                 </div>
              </div>

              {/* Item List */}
              <div className="lg:col-span-2 space-y-4">
                 <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <Search className="text-slate-500" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Buscar en la base de datos..."
                      className="bg-transparent border-none outline-none text-white w-full"
                    />
                 </div>
                 
                 <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 min-h-[500px]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                       {combinedItemList.map((item, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col items-center text-center gap-2 hover:border-slate-600 transition-colors">
                             <div className="w-12 h-12 rounded bg-black/50 border border-slate-700 overflow-hidden">
                                <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=?')} />
                             </div>
                             <div className="text-xs font-bold text-slate-300 truncate w-full" title={item.item_name}>
                                {item.item_name}
                             </div>
                             {item.grade && item.grade !== 'Unknown' && (
                                <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase">
                                   {item.grade}
                                </span>
                             )}
                          </div>
                       ))}
                       {combinedItemList.length === 0 && (
                          <div className="col-span-full text-center py-10 text-slate-500 italic">
                             No se encontraron items.
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
         </div>
       )}
    </div>
  );
};

// 1. Web Source Importer
const WebSourceImporter = ({ onImport }: { onImport: (data: Record<string, string>) => void }) => {
  const [htmlInput, setHtmlInput] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://lineage2.es');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'processing'>('idle');
  const [extractedCount, setExtractedCount] = useState(0);

  const handleExtract = () => {
    if (!htmlInput.trim()) return;
    setStatus('processing');
    
    setTimeout(() => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlInput, 'text/html');
        const images = doc.querySelectorAll('img');
        
        let newItems: Record<string, string> = {};
        let count = 0;

        images.forEach((img) => {
          let name = img.getAttribute('title') || img.getAttribute('alt') || img.getAttribute('data-original-title');
          const rawSrc = img.getAttribute('src');

          if (!name || name.trim() === '') {
             const parent = img.parentElement; 
             if (parent) {
                if (parent.textContent && parent.textContent.trim().length > 1) {
                    name = parent.textContent.trim();
                } 
                else if (parent.nextElementSibling && parent.nextElementSibling.textContent) {
                    name = parent.nextElementSibling.textContent.trim();
                }
             }
          }

          if (rawSrc && name && name.trim().length >= 2) { 
             const lowerName = name.toLowerCase();
             if (lowerName.includes('button') || lowerName.includes('spacer') || lowerName.includes('lineage 2') || lowerName.includes('logo')) return;

             let finalUrl = rawSrc;
             if (finalUrl.startsWith('/')) {
                const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                finalUrl = `${cleanBase}${rawSrc}`;
             } else if (!finalUrl.startsWith('http') && !finalUrl.startsWith('data:')) {
                const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                finalUrl = `${cleanBase}/${rawSrc}`;
             }

             const cleanName = name
                .replace(/\(\+\d+\)/g, '') 
                .replace(/^(\+\d+\s)/, '') 
                .replace(/x\d+$/, '')      
                .trim();

             if (!newItems[cleanName] && cleanName.length > 0) {
               newItems[cleanName] = finalUrl;
               count++;
             }
          }
        });

        if (count === 0) throw new Error("No se encontraron imágenes.");

        onImport(newItems);
        setExtractedCount(count);
        setStatus('success');
        setHtmlInput('');
        
        setTimeout(() => { setStatus('idle'); setExtractedCount(0); }, 5000);
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    }, 500); 
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 font-sans">
      <div className="bg-[#0f172a] rounded-3xl p-8 relative overflow-hidden border border-slate-800 shadow-2xl">
         {/* ... Importer UI ... */}
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-6">
              <h2 className="text-3xl font-black text-white mb-2 leading-tight">EXTRACTOR <br /><span className="text-teal-400">INTELIGENTE</span></h2>
              {/* ... */}
           </div>
           <div className="lg:col-span-2 flex flex-col gap-4">
              <textarea 
                 value={htmlInput}
                 onChange={(e) => setHtmlInput(e.target.value)}
                 placeholder='Pega aquí el código HTML...'
                 className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
              />
              <button onClick={handleExtract} disabled={status === 'processing'} className="py-4 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold">
                {status === 'processing' ? 'Analizando...' : 'Importar Datos'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// 2. Account List Sidebar
const AccountList = ({ accounts, selectedId, onSelect, isCollapsed, onToggle, onAddAccountClick, onHomeClick, onDataManageClick }: any) => {
  return (
    <div className={`flex flex-col h-full bg-slate-900 border-r border-slate-800 flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-full md:w-80'}`}>
      <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 flex items-center justify-between h-16">
        {isCollapsed ? (
           <button onClick={onToggle} className="mx-auto text-teal-500 hover:text-teal-400 p-2 rounded hover:bg-slate-800"><Users size={24} /></button>
        ) : (
          <>
            <h2 className="text-lg font-bold text-teal-400 flex items-center gap-2"><Users size={20} /> Cuentas</h2>
            <button onClick={onToggle} className="text-slate-500 hover:text-white"><ChevronLeft size={18} /></button>
          </>
        )}
      </div>
      
      {/* Home Button */}
      <div className="p-2">
         <button 
            onClick={onHomeClick}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${!selectedId ? 'bg-teal-950/40 text-teal-400 border border-teal-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
         >
            <Home size={20} className={isCollapsed ? "mx-auto" : ""} />
            {!isCollapsed && <span className="font-bold">Inicio / Dashboard</span>}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <h3 className={`text-xs font-bold text-slate-600 uppercase px-2 mb-1 ${isCollapsed ? 'hidden' : 'block'}`}>Cuentas</h3>
        {accounts.map((acc: Account) => {
          const isSelected = selectedId === acc.id;
          if (isCollapsed) return (
             <button key={acc.id} onClick={() => onSelect(acc.id)} className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-teal-500 text-teal-300' : 'border-slate-700 text-slate-500'}`}>{acc.username.charAt(0).toUpperCase()}</button>
          );
          return (
            <button key={acc.id} onClick={() => onSelect(acc.id)} className={`w-full text-left p-3 rounded-md border ${isSelected ? 'bg-teal-950/30 border-teal-500' : 'bg-slate-800/50 border-slate-700'}`}>
              <div className="font-medium truncate text-slate-200">{acc.username}</div>
              <div className="text-xs text-slate-500">{acc.characters.length} Personajes</div>
            </button>
          );
        })}
      </div>
      <div className="p-3 border-t border-slate-800 bg-slate-900 space-y-2">
        <button onClick={onAddAccountClick} className="flex items-center justify-center gap-2 w-full py-2 rounded border border-dashed border-slate-700 text-slate-400 hover:border-teal-500 hover:text-teal-400">
          <Plus size={isCollapsed ? 24 : 16} /> {!isCollapsed && "Agregar Cuenta"}
        </button>
        <button onClick={onDataManageClick} className="flex items-center justify-center gap-2 w-full py-3 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700">
          <HardDrive size={isCollapsed ? 24 : 16} /> {!isCollapsed && "Gestión de Datos"}
        </button>
      </div>
    </div>
  );
};

// 3. Character List Sidebar
const CharacterList = ({ characters, selectedId, onSelect, isCollapsed, onToggle, onAddCharacterClick }: any) => {
  return (
    <div className={`flex flex-col h-full bg-slate-900/50 border-r border-slate-800 flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-full md:w-72'}`}>
      <div className="p-4 border-b border-slate-800 sticky top-0 z-10 bg-slate-900 flex items-center justify-between h-16">
         {isCollapsed ? (
           <button onClick={onToggle} className="mx-auto text-teal-500 hover:text-teal-400 p-2 rounded hover:bg-slate-800"><Shield size={24} /></button>
        ) : (
          <>
            <h2 className="text-lg font-bold text-teal-400 flex items-center gap-2"><Shield size={20} /> Personajes</h2>
            <button onClick={onToggle} className="text-slate-500 hover:text-white"><ChevronLeft size={18} /></button>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {characters.map((char: Character) => {
          const isSelected = selectedId === char.id;
          if (isCollapsed) return <button key={char.id} onClick={() => onSelect(char.id)} className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center border ${isSelected ? 'border-teal-500 text-teal-300' : 'border-slate-700 text-slate-500'}`}>{char.name.charAt(0)}</button>;
          return (
            <button key={char.id} onClick={() => onSelect(char.id)} className={`w-full text-left p-3 rounded-lg border ${isSelected ? 'bg-teal-950/20 border-teal-500' : 'bg-slate-800/30 border-slate-700'}`}>
              <div className="font-bold text-slate-200">{char.name}</div>
              <div className="text-xs text-slate-400">Lv {char.level} - {char.class}</div>
            </button>
          );
        })}
      </div>
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <button onClick={onAddCharacterClick} className="flex items-center justify-center gap-2 w-full py-2 rounded border border-dashed border-slate-700 text-slate-400 hover:border-teal-500 hover:text-teal-400">
          <Plus size={isCollapsed ? 24 : 16} /> {!isCollapsed && "Crear Personaje (I.A.)"}
        </button>
      </div>
    </div>
  );
};

// 4. Equipment Grid Item
const EquipmentSlot = ({ item, slotName, itemRegistry }: { item?: Item, slotName: string, itemRegistry: Record<string, string> }) => {
  return (
    <div className="relative group aspect-square bg-black/40 border border-slate-700/50 rounded flex items-center justify-center hover:border-teal-500/50 transition-colors">
      {item ? (
        <>
          <img src={getItemIcon(item, itemRegistry)} alt={item.name} className="w-full h-full object-cover rounded opacity-80 group-hover:opacity-100 transition-opacity" />
          {item.enchantLevel ? <span className="absolute top-0.5 left-1 text-[10px] font-bold text-yellow-400 drop-shadow-md">+{item.enchantLevel}</span> : null}
        </>
      ) : (
        <span className="text-[9px] uppercase text-slate-700 select-none text-center px-1">{slotName}</span>
      )}
    </div>
  );
};

// 5. Character Profile
const InfoRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="flex justify-between items-center text-sm py-0.5 min-h-[28px]">
    <span className="text-white font-semibold flex-shrink-0 mr-4">{label}</span>
    <span className="text-slate-300 text-right truncate">{value}</span>
  </div>
);

const SectionCard: React.FC<{ title: string; children?: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-lg flex flex-col h-full hover:border-slate-700 transition-colors relative">
    <div className="flex items-center justify-between mb-3">
        <h3 className="text-amber-500 text-xs font-bold uppercase tracking-widest text-center flex-1">{title}</h3>
        {action && <div className="absolute right-0 top-0">{action}</div>}
    </div>
    <div className="flex-1 space-y-1">
      {children}
    </div>
  </div>
);

// --- Subclass Card Component (Replaces direct render in CharacterProfile) ---

const SubclassCard: React.FC<{ 
  subclass: Subclass | undefined;
  index: number;
  onSave: (data: Subclass) => void;
}> = ({ 
  subclass, 
  index, 
  onSave 
}) => {
  const [isLocked, setIsLocked] = useState(true);
  
  // Editing State
  const [editLevel, setEditLevel] = useState(subclass?.level || 40);
  const [editDate, setEditDate] = useState(subclass?.creationDate.split(' ')[0] || new Date().toISOString().split('T')[0]);
  
  // For Class selection, we need a "Race filter" logic similar to Image 2,
  // even if subclass doesn't store race.
  const [editRaceFilter, setEditRaceFilter] = useState('Human');
  const [editClass, setEditClass] = useState(subclass?.class || '');

  // Reset state when subclass prop changes or when unlocking empty slot
  useEffect(() => {
    if (subclass) {
      setEditLevel(subclass.level);
      setEditClass(subclass.class);
      setEditDate(subclass.creationDate.split(' ')[0]);
    } else {
      // Defaults for new subclass
      setEditLevel(40);
      setEditDate(new Date().toISOString().split('T')[0]);
      setEditClass('');
    }
    setIsLocked(true);
  }, [subclass]);

  const handleToggleLock = () => {
    if (!isLocked) {
      // Save changes
      // Validate
      if (!editClass) {
        alert("Debes seleccionar una clase.");
        return; // Don't close lock
      }
      
      const newSub: Subclass = {
        id: subclass?.id || Date.now(),
        level: Number(editLevel),
        class: editClass,
        creationDate: editDate,
        // Mock stats for new subs
        hp: subclass?.hp || 1000,
        maxHp: subclass?.maxHp || 1000,
        mp: subclass?.mp || 1000,
        maxMp: subclass?.maxMp || 1000,
        sp: subclass?.sp || 0
      };
      onSave(newSub);
    }
    setIsLocked(!isLocked);
  };

  return (
    <SectionCard 
      title={`Subclase ${index + 1}`}
      action={
        <button 
           onClick={handleToggleLock}
           className={`p-1.5 rounded-full transition-all ${!isLocked ? 'bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/50' : 'text-slate-500 hover:text-white'}`}
           title={isLocked ? "Desbloquear para editar" : "Bloquear y guardar cambios"}
        >
           {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
      }
    >
      {!isLocked ? (
        <div className="space-y-3 py-1 animate-in fade-in">
           {/* Race Filter (Visual helper only) */}
           <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-semibold text-xs">Filtro Raza</span>
              <select 
                value={editRaceFilter} 
                onChange={e => {
                   setEditRaceFilter(e.target.value);
                   const classes = L2_CLASSES_BY_RACE[e.target.value];
                   if (classes && classes.length > 0) setEditClass(classes[0]);
                }}
                className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-32 outline-none focus:border-teal-500"
              >
                 {L2_RACES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
           </div>

           {/* Class Selector */}
           <div className="flex justify-between items-center text-sm">
              <span className="text-white font-semibold">Clase</span>
              <select 
                value={editClass} 
                onChange={e => setEditClass(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-32 outline-none focus:border-teal-500"
              >
                 {(L2_CLASSES_BY_RACE[editRaceFilter] || []).map(c => <option key={c} value={c}>{c}</option>)}
                 {!editClass && <option value="">Seleccionar...</option>}
              </select>
           </div>

           {/* Level Input */}
           <div className="flex justify-between items-center text-sm">
              <span className="text-white font-semibold">Nivel</span>
              <input 
                 type="number" 
                 value={editLevel} 
                 onChange={e => setEditLevel(Number(e.target.value))}
                 className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-32 outline-none focus:border-teal-500 text-right"
              />
           </div>

            {/* Date Input */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-white font-semibold">Fecha</span>
              <input 
                 type="date" 
                 value={editDate} 
                 onChange={e => setEditDate(e.target.value)}
                 className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-32 outline-none focus:border-teal-500 text-right"
              />
           </div>

           <div className="text-[10px] text-amber-500 text-center italic mt-2">
              <Unlock size={10} className="inline mr-1"/> Editando Subclase
           </div>
        </div>
      ) : (
        subclass ? (
           <>
             <InfoRow label="Clase" value={<span className="text-teal-200">{subclass.class}</span>} />
             <InfoRow label="Nivel" value={subclass.level} />
             <InfoRow label="Fecha" value={subclass.creationDate.split(' ')[0]} />
           </>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs italic gap-2 opacity-50">
             <Plus size={24} />
             <span>Vacío</span>
           </div>
        )
      )}
    </SectionCard>
  );
};


const ItemList = ({ items, itemRegistry, emptyMessage = "Vacío" }: { items: Item[], itemRegistry: Record<string, string>, emptyMessage?: string }) => {
  if (!items || items.length === 0) return <div className="p-8 text-center text-slate-500 text-sm italic border border-dashed border-slate-800 rounded">{emptyMessage}</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, idx) => (
        <div key={`${item.id}-${idx}`} className="flex items-center gap-3 bg-slate-900/40 p-2 rounded border border-slate-800/50 hover:border-slate-700 hover:bg-slate-800/40 transition-all">
          <div className="relative w-10 h-10 flex-shrink-0 bg-black/50 rounded border border-slate-700 overflow-hidden">
             <img src={getItemIcon(item, itemRegistry)} alt={item.name} className="w-full h-full object-cover opacity-80" />
             {item.enchantLevel ? <span className="absolute top-0 right-0 text-[9px] font-bold text-yellow-400 bg-black/80 px-1 rounded-bl shadow-sm">+{item.enchantLevel}</span> : null}
          </div>
          <div className="min-w-0 flex-1">
             <div className="text-xs font-bold text-slate-300 truncate">{item.name}</div>
             <div className="flex justify-between items-center text-[10px] text-slate-500 mt-0.5">
                <span className="capitalize text-slate-600">{item.type}</span>
                {item.count > 1 && <span className="text-teal-500/80 font-mono bg-teal-950/30 px-1 rounded">{item.count.toLocaleString()}</span>}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CharacterProfile = ({ 
  character, 
  itemRegistry, 
  onUpdateCharacter,
  onImportItemsClick
}: { 
  character: Character, 
  itemRegistry: Record<string, string>, 
  onUpdateCharacter: (updatedChar: Character) => void,
  onImportItemsClick: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'warehouse' | 'clanWarehouse' | 'quests' | 'pets'>('inventory');
  
  // Lock state: Default Locked (true)
  const [isLocked, setIsLocked] = useState(true);

  // Editing State
  const [editName, setEditName] = useState(character.name);
  const [editLevel, setEditLevel] = useState(character.level);
  const [editRace, setEditRace] = useState(character.race);
  const [editClass, setEditClass] = useState(character.class);
  const [editClan, setEditClan] = useState(character.clan || '');
  const [editLocation, setEditLocation] = useState(character.location);

  // Sync state when character prop changes, resets lock
  useEffect(() => {
    setEditName(character.name);
    setEditLevel(character.level);
    setEditRace(character.race);
    setEditClass(character.class);
    setEditClan(character.clan || '');
    setEditLocation(character.location);
    setIsLocked(true); 
  }, [character]);

  const handleToggleLock = () => {
    if (!isLocked) {
       // We are closing the lock, so SAVE changes
       onUpdateCharacter({
         ...character,
         name: editName,
         level: Number(editLevel),
         race: editRace,
         class: editClass,
         clan: editClan,
         location: editLocation
       });
    }
    setIsLocked(!isLocked);
  };

  const handleUpdateSubclass = (index: number, newSubData: Subclass) => {
    const currentSubs = character.subclasses || [];
    const newSubs = [...currentSubs];
    
    // Ensure array is big enough if adding new sub
    while(newSubs.length <= index) {
      // fill gaps if any, though unlikely in this UI
      // Actually we just set the index
      newSubs[index] = newSubData;
    }
    newSubs[index] = newSubData;
    
    onUpdateCharacter({
      ...character,
      subclasses: newSubs
    });
  };

  const tabs = [
    { id: 'inventory', icon: Box, label: 'Inventario' },
    { id: 'warehouse', icon: Database, label: 'Almacén' },
    { id: 'clanWarehouse', icon: Crown, label: 'Alm. Clan' },
    { id: 'quests', icon: ScrollText, label: 'Misiones' },
    { id: 'pets', icon: Dog, label: 'Mascotas' },
  ];

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-start gap-4">
           <div className="w-24 md:w-28 flex-shrink-0 flex flex-col">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-lg flex items-center justify-center shadow-lg relative group overflow-hidden">
                <span className="text-5xl font-bold text-teal-600/50 group-hover:text-teal-500/60 transition-colors">{character.name.charAt(0)}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
              </div>
           </div>
           
           <div className="flex-1 pt-2">
              {!isLocked ? (
                 <div className="flex flex-col gap-2 max-w-md">
                    <label className="text-xs text-slate-500 font-bold uppercase">Nombre del Personaje</label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-2xl font-bold text-white w-full focus:border-teal-500 outline-none"
                    />
                 </div>
              ) : (
                 <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm">{character.name}</h1>
              )}
              
              <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                 <span className="text-teal-400 font-medium px-2 py-0.5 bg-teal-950/30 rounded border border-teal-900/50">{character.race}</span>
                 <span className="text-slate-300 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">{character.class}</span>
                 {!isLocked ? (
                    <div className="flex items-center gap-1">
                       <span className="text-amber-500 font-bold px-2 py-0.5 bg-amber-950/20 rounded border border-amber-900/50">Lvl</span>
                       <input 
                         type="number"
                         value={editLevel}
                         onChange={e => setEditLevel(Number(e.target.value))}
                         className="w-16 bg-slate-900 border border-slate-700 rounded px-1 text-sm text-white focus:border-teal-500 outline-none"
                       />
                    </div>
                 ) : (
                    <span className="text-amber-500 font-bold px-2 py-0.5 bg-amber-950/20 rounded border border-amber-900/50">Lvl {character.level}</span>
                 )}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                Último acceso {character.lastAccess}
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <SectionCard 
             title="Datos del Personaje" 
             action={
               <button 
                  onClick={handleToggleLock}
                  className={`p-1.5 rounded-full transition-all ${!isLocked ? 'bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/50' : 'text-slate-500 hover:text-white'}`}
                  title={isLocked ? "Desbloquear para editar" : "Bloquear y guardar cambios"}
               >
                  {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
               </button>
             }
          >
             {!isLocked ? (
                <div className="space-y-3 py-1 animate-in fade-in">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white font-semibold">Raza</span>
                      <select 
                        value={editRace} 
                        onChange={e => {
                           setEditRace(e.target.value);
                           const classes = L2_CLASSES_BY_RACE[e.target.value];
                           if (classes && classes.length > 0) setEditClass(classes[0]);
                           else setEditClass('Unknown');
                        }}
                        className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-36 outline-none focus:border-teal-500"
                      >
                         {L2_RACES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white font-semibold">Clase</span>
                      <select 
                        value={editClass} 
                        onChange={e => setEditClass(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-36 outline-none focus:border-teal-500"
                      >
                         {(L2_CLASSES_BY_RACE[editRace] || []).map(c => <option key={c} value={c}>{c}</option>)}
                         <option value="Unknown">Unknown</option>
                      </select>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white font-semibold">Clan</span>
                      <input 
                         type="text" 
                         value={editClan} 
                         onChange={e => setEditClan(e.target.value)}
                         className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-36 outline-none focus:border-teal-500 text-right"
                      />
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white font-semibold">Ubicación</span>
                      <input 
                         type="text" 
                         value={editLocation} 
                         onChange={e => setEditLocation(e.target.value)}
                         className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-36 outline-none focus:border-teal-500 text-right"
                      />
                   </div>
                   <div className="text-[10px] text-amber-500 text-center italic mt-2">
                      <Unlock size={10} className="inline mr-1"/> Editando Datos
                   </div>
                </div>
             ) : (
               <>
                 <InfoRow label="Raza" value={character.race} />
                 <InfoRow label="Clase" value={character.class} />
                 <InfoRow label="Clan" value={<span className="text-teal-300">{character.clan || 'Sin Clan'}</span>} />
                 <InfoRow label="Fecha creación" value={character.creationDate || '-'} />
                 <InfoRow label="Ubicación" value={character.location} />
               </>
             )}
          </SectionCard>

          {/* Subclasses rendered via new Component */}
          {[0, 1, 2].map((idx) => {
             const sub = character.subclasses && character.subclasses[idx];
             return (
               <SubclassCard 
                 key={idx} 
                 index={idx} 
                 subclass={sub} 
                 onSave={(newData) => handleUpdateSubclass(idx, newData)} 
               />
             );
          })}
        </div>

        {/* Equipment & Inventory */}
        <div className="flex flex-col xl:flex-row gap-6 items-start pb-8">
           <div className="w-full xl:w-72 flex-shrink-0 bg-slate-900/20 border border-slate-800 rounded-lg p-4">
              <h3 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4 text-center">Equipado</h3>
              <div className="grid grid-cols-3 gap-3">
                 <EquipmentSlot item={character.equipment.helmet} slotName="Head" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.chest} slotName="Chest" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.legs} slotName="Legs" itemRegistry={itemRegistry} />
                 
                 <EquipmentSlot item={character.equipment.gloves} slotName="Gloves" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.shirt} slotName="Shirt" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.boots} slotName="Boots" itemRegistry={itemRegistry} />
                 
                 <EquipmentSlot item={character.equipment.cloak} slotName="Cloak" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.belt} slotName="Belt" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.shield} slotName="Shield" itemRegistry={itemRegistry} />

                 <EquipmentSlot item={character.equipment.weapon} slotName="Wpn" itemRegistry={itemRegistry} />
                 <div className="bg-transparent" />
                 <div className="bg-transparent" />
                 
                 <EquipmentSlot item={character.equipment.earring1} slotName="Ear" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.earring2} slotName="Ear" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.necklace} slotName="Neck" itemRegistry={itemRegistry} />
                 
                 <EquipmentSlot item={character.equipment.ring1} slotName="Ring" itemRegistry={itemRegistry} />
                 <EquipmentSlot item={character.equipment.ring2} slotName="Ring" itemRegistry={itemRegistry} />
                 <div className="bg-transparent" />
              </div>
           </div>

           <div className="flex-1 min-w-0 w-full">
              <div className="flex items-end justify-between border-b border-slate-800 mb-4 overflow-x-auto scrollbar-hide">
                <div className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-teal-500 text-teal-400 bg-teal-900/10'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={onImportItemsClick}
                  className="mb-1 mr-1 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-bold uppercase rounded border border-slate-700 transition-colors"
                  title="Importar inventario mediante IA"
                >
                  <Download size={14} /> Importar Items
                </button>
              </div>

              <div className="bg-slate-900/20 rounded-lg p-2 min-h-[300px] border border-slate-800/50">
                {activeTab === 'inventory' && (
                  <ItemList items={character.inventory} itemRegistry={itemRegistry} />
                )}
                {activeTab === 'warehouse' && (
                  <ItemList items={character.warehouse} itemRegistry={itemRegistry} emptyMessage="Almacén vacío" />
                )}
                {activeTab === 'clanWarehouse' && (
                  <ItemList items={character.clanWarehouse || []} itemRegistry={itemRegistry} emptyMessage={character.clan ? "Almacén de Clan vacío" : "El personaje no pertenece a ningún clan"} />
                )}
                {/* Quests and Pets would go here */}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [selectedAccId, setSelectedAccId] = useState<string | null>(null); // Null by default to show Dashboard
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [itemRegistry, setItemRegistry] = useState<Record<string, string>>({});
  
  const [modal, setModal] = useState<'account' | 'character' | 'import_char' | 'import_items' | 'data_management' | null>(null);

  // View State: 'dashboard' or 'profile'
  const [view, setView] = useState<'dashboard' | 'profile'>('dashboard');

  const selectedAccount = useMemo(() => accounts.find(a => a.id === selectedAccId), [accounts, selectedAccId]);
  const selectedCharacter = useMemo(() => selectedAccount?.characters.find(c => c.id === selectedCharId), [selectedAccount, selectedCharId]);

  // Handler for Account Selection
  const handleAccountSelect = (id: string) => {
     setSelectedAccId(id);
     // Auto-select first character if available
     const acc = accounts.find(a => a.id === id);
     if (acc && acc.characters.length > 0) {
        setSelectedCharId(acc.characters[0].id);
     } else {
        setSelectedCharId(null);
     }
     setView('profile');
  };

  const handleHomeClick = () => {
     setSelectedAccId(null);
     setSelectedCharId(null);
     setView('dashboard');
  };

  const handleAddItemToRegistry = (name: string, url: string) => {
     setItemRegistry(prev => ({ ...prev, [name]: url }));
  };

  const handleRestoreData = (restoredAccounts?: Account[], restoredRegistry?: Record<string, string>) => {
    if (restoredAccounts) {
      setAccounts(restoredAccounts);
    }
    if (restoredRegistry) {
      setItemRegistry(prev => ({ ...prev, ...restoredRegistry }));
    }
    alert("Datos restaurados correctamente.");
  };

  const handleAddAccount = (username: string, ip: string) => {
     const newAcc: Account = {
        id: `acc-${Date.now()}`,
        username,
        email: `${username}@example.com`,
        ip,
        lastAccess: 'Just now',
        status: 'active',
        characters: []
     };
     setAccounts([...accounts, newAcc]);
     setSelectedAccId(newAcc.id);
     setView('profile');
     setModal(null);
  };

  const handleAddCharacter = (name: string, level: number, charClass: string, race: string) => {
     if(!selectedAccount) return;
     const newChar: Character = {
        id: `char-${Date.now()}`,
        name, level, class: charClass, race,
        location: 'Starting Village',
        status: { hp: 100, maxHp: 100, mp: 100, maxMp: 100, cp: 0, maxCp: 0 },
        equipment: {}, inventory: [], warehouse: [], pets: [],
        questTracking: { isFinished: false, isRewardCollected: false, bosses: { emeraldHorn: false, dustRider: false, bleedingFly: false, blackdaggerWing: false, shadowSummoner: false, spikeSlasher: false, muscleBomber: false } },
        online: false, lastAccess: 'Just now'
     };
     const updatedAcc = { ...selectedAccount, characters: [...selectedAccount.characters, newChar] };
     setAccounts(accounts.map(a => a.id === selectedAccount.id ? updatedAcc : a));
     setSelectedCharId(newChar.id);
     setModal(null);
  };
  
  const handleImportCharacter = (data: Partial<Character>) => {
     if(!selectedAccount) return;
     const newChar: Character = {
        id: `char-imp-${Date.now()}`,
        name: data.name || 'Imported',
        level: data.level || 85,
        class: data.class || 'Unknown',
        race: data.race || 'Unknown',
        location: data.location || 'Unknown',
        clan: data.clan,
        status: { hp: 1000, maxHp: 1000, mp: 1000, maxMp: 1000, cp: 0, maxCp: 0, ...data.status },
        equipment: data.equipment as any || {}, 
        inventory: data.inventory as any || [], 
        warehouse: data.warehouse as any || [], 
        clanWarehouse: data.clanWarehouse as any || [],
        pets: [],
        questTracking: { isFinished: false, isRewardCollected: false, bosses: { emeraldHorn: false, dustRider: false, bleedingFly: false, blackdaggerWing: false, shadowSummoner: false, spikeSlasher: false, muscleBomber: false } },
        online: false, lastAccess: 'Just now'
     };
     
     const updatedAcc = { ...selectedAccount, characters: [...selectedAccount.characters, newChar] };
     setAccounts(accounts.map(a => a.id === selectedAccount.id ? updatedAcc : a));
     setSelectedCharId(newChar.id);
     setModal(null);
  };

  const handleImportItems = (data: any) => {
    if (!selectedAccount || !selectedCharacter) return;

    // Merge logic: If data exists in JSON, replace current list.
    const updatedChar = { ...selectedCharacter };
    if (data.inventory) updatedChar.inventory = data.inventory;
    if (data.warehouse) updatedChar.warehouse = data.warehouse;
    if (data.clanWarehouse) updatedChar.clanWarehouse = data.clanWarehouse;

    handleUpdateCharacter(updatedChar);
    setModal(null);
  };

  const handleUpdateCharacter = (updated: Character) => {
     if(!selectedAccount) return;
     const updatedChars = selectedAccount.characters.map(c => c.id === updated.id ? updated : c);
     const updatedAcc = { ...selectedAccount, characters: updatedChars };
     setAccounts(accounts.map(a => a.id === selectedAccount.id ? updatedAcc : a));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-teal-500/30 selection:text-teal-200">
       <AccountList 
         accounts={accounts} 
         selectedId={view === 'profile' ? selectedAccId : null} 
         onSelect={handleAccountSelect} 
         isCollapsed={collapsed} 
         onToggle={() => setCollapsed(!collapsed)}
         onAddAccountClick={() => setModal('account')}
         onHomeClick={handleHomeClick}
         onDataManageClick={() => setModal('data_management')}
       />
       
       {/* If we are in profile view and have an account selected, show Char List */}
       {view === 'profile' && selectedAccount && (
         <CharacterList 
            characters={selectedAccount.characters} 
            selectedId={selectedCharId} 
            onSelect={setSelectedCharId}
            isCollapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
            onAddCharacterClick={() => setModal('import_char')}
         />
       )}
       
       <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
          
          {view === 'dashboard' ? (
             <Dashboard 
               accounts={accounts} 
               itemRegistry={itemRegistry}
               onAddItem={handleAddItemToRegistry}
             />
          ) : (
            <>
               <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
                  <div className="flex items-center gap-4 text-slate-500">
                      <Search size={18} />
                      <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm w-32 md:w-64 text-slate-200 placeholder-slate-600" />
                  </div>
                  <div className="flex items-center gap-3">
                      <button onClick={() => setModal('import_char')} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                        <Sparkles size={14} /> Importar Personaje
                      </button>
                  </div>
                </div>

                {selectedCharacter ? (
                   <CharacterProfile 
                     character={selectedCharacter} 
                     itemRegistry={itemRegistry} 
                     onUpdateCharacter={handleUpdateCharacter}
                     onImportItemsClick={() => setModal('import_items')}
                   />
                ) : (
                   <div className="flex-1 flex items-center justify-center text-slate-600">
                     <div className="text-center">
                       <Shield size={64} className="mx-auto mb-4 opacity-20" />
                       <p>Selecciona un personaje</p>
                     </div>
                   </div>
                )}
            </>
          )}
       </div>

       {modal === 'account' && <AddAccountModal onClose={() => setModal(null)} onAdd={handleAddAccount} />}
       {modal === 'character' && <AddCharacterModal onClose={() => setModal(null)} onAdd={handleAddCharacter} />}
       {modal === 'import_char' && <DigitalizationBridgeModal onClose={() => setModal(null)} onImport={handleImportCharacter} mode="character" />}
       {modal === 'import_items' && <DigitalizationBridgeModal onClose={() => setModal(null)} onImport={handleImportItems} mode="items" />}
       
       {modal === 'data_management' && (
         <DataManagementModal 
            onClose={() => setModal(null)} 
            currentAccounts={accounts} 
            currentItemRegistry={itemRegistry}
            onRestore={handleRestoreData}
         />
       )}
    </div>
  );
};

export default App;