export type UnitType = 'un' | 'kg' | 'g' | 'L' | 'ml' | 'pct' | 'cx' | 'dz' | 'lata' | 'garrafa';

export type CategoryId = 
  | 'hortifruti'
  | 'carnes'
  | 'laticinios'
  | 'mercearia'
  | 'padaria'
  | 'bebidas'
  | 'limpeza'
  | 'higiene'
  | 'congelados'
  | 'outros';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: UnitType;
  category: CategoryId;
  estimatedPrice?: number;
  isBought: boolean;
  notes?: string;
  createdAt: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
}

export interface HistoryItem {
  id: string;
  name: string;
  category: CategoryId;
  quantity: number;
  unit: UnitType;
  estimatedPrice?: number;
  lastAction: 'comprado' | 'removido';
  timestamp: number;
  timesUsed: number;
  notes?: string;
}

export type FontSizeOption = 'normal' | 'large' | 'extra';

export type ContrastThemeId =
  | 'padrao'
  | 'amarelo-preto'
  | 'azul-noturno'
  | 'verde-esmeralda'
  | 'preto-branco'
  | 'ambar-dourado'
  | 'magenta-neon'
  | 'roxo-eletrico'
  | 'laranja-solar'
  | 'solar-creme'
  | 'ciano-neon'
  | 'verde-lima';

export interface AccessibilitySettings {
  fontSize: FontSizeOption;
  highContrast: boolean;
  contrastTheme: ContrastThemeId;
  soundFeedback: boolean;
  groupByCategory: boolean;
  speechSpeed: number;
}
