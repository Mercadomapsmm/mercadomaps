import { HistoryItem, CategoryId, UnitType } from '@/types/shopping';

const STORAGE_KEY_PREFIX = 'shopping_history_items_v1';

export const INITIAL_HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 'seed-hist-1',
    name: 'Leite Integral',
    category: 'laticinios',
    quantity: 2,
    unit: 'L',
    estimatedPrice: 5.2,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1, // Ontem
    timesUsed: 9,
  },
  {
    id: 'seed-hist-2',
    name: 'Pão Francês',
    category: 'padaria',
    quantity: 6,
    unit: 'un',
    estimatedPrice: 0.9,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // Há 2 dias
    timesUsed: 12,
  },
  {
    id: 'seed-hist-3',
    name: 'Café em Pó 500g',
    category: 'mercearia',
    quantity: 1,
    unit: 'pct',
    estimatedPrice: 17.5,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // Há 3 dias
    timesUsed: 7,
  },
  {
    id: 'seed-hist-4',
    name: 'Ovos Brancos',
    category: 'laticinios',
    quantity: 1,
    unit: 'dz',
    estimatedPrice: 12.0,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    timesUsed: 8,
  },
  {
    id: 'seed-hist-5',
    name: 'Arroz Branco 5kg',
    category: 'mercearia',
    quantity: 1,
    unit: 'pct',
    estimatedPrice: 28.9,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // Há 1 semana
    timesUsed: 6,
  },
  {
    id: 'seed-hist-6',
    name: 'Feijão Carioca 1kg',
    category: 'mercearia',
    quantity: 1,
    unit: 'kg',
    estimatedPrice: 8.5,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
    timesUsed: 6,
  },
  {
    id: 'seed-hist-7',
    name: 'Óleo de Soja 900ml',
    category: 'mercearia',
    quantity: 1,
    unit: 'garrafa',
    estimatedPrice: 6.8,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
    timesUsed: 5,
  },
  {
    id: 'seed-hist-8',
    name: 'Detergente Líquido',
    category: 'limpeza',
    quantity: 2,
    unit: 'un',
    estimatedPrice: 2.5,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12,
    timesUsed: 6,
  },
  {
    id: 'seed-hist-9',
    name: 'Açúcar Refinado 1kg',
    category: 'mercearia',
    quantity: 1,
    unit: 'kg',
    estimatedPrice: 4.6,
    lastAction: 'comprado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15,
    timesUsed: 4,
  },
  {
    id: 'seed-hist-10',
    name: 'Sabão em Pó',
    category: 'limpeza',
    quantity: 1,
    unit: 'cx',
    estimatedPrice: 14.9,
    lastAction: 'removido',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    timesUsed: 3,
  },
];

export function normalizeItemKey(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Adiciona ou atualiza um item no histórico preservando contagem de recorrência
 */
export function addItemToHistory(
  currentHistory: HistoryItem[],
  item: {
    name: string;
    category?: CategoryId;
    quantity?: number;
    unit?: UnitType;
    estimatedPrice?: number;
    notes?: string;
  },
  action: 'comprado' | 'removido'
): HistoryItem[] {
  if (!item.name || !item.name.trim()) return currentHistory;

  const key = normalizeItemKey(item.name);
  const existingIndex = currentHistory.findIndex(h => normalizeItemKey(h.name) === key);

  const updated = [...currentHistory];

  if (existingIndex >= 0) {
    const existing = updated[existingIndex];
    const newTimesUsed = existing.timesUsed + 1;

    const mergedItem: HistoryItem = {
      ...existing,
      name: item.name.trim(), // Atualiza nome com capitalização mais recente
      category: item.category || existing.category,
      quantity: item.quantity && item.quantity > 0 ? item.quantity : existing.quantity,
      unit: item.unit || existing.unit,
      estimatedPrice:
        item.estimatedPrice !== undefined && item.estimatedPrice > 0
          ? item.estimatedPrice
          : existing.estimatedPrice,
      lastAction: action,
      timestamp: Date.now(),
      timesUsed: newTimesUsed,
      notes: item.notes || existing.notes,
    };

    // Remove do local antigo e insere no topo
    updated.splice(existingIndex, 1);
    updated.unshift(mergedItem);
  } else {
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: item.name.trim(),
      category: item.category || 'outros',
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      unit: item.unit || 'un',
      estimatedPrice: item.estimatedPrice,
      lastAction: action,
      timestamp: Date.now(),
      timesUsed: action === 'comprado' ? 2 : 1,
      notes: item.notes,
    };
    updated.unshift(newItem);
  }

  // Limite razoável de até 150 itens no histórico
  return updated.slice(0, 150);
}

/**
 * Adiciona múltiplos itens ao histórico de uma vez (por exemplo ao limpar comprados)
 */
export function addMultipleItemsToHistory(
  currentHistory: HistoryItem[],
  items: Array<{
    name: string;
    category?: CategoryId;
    quantity?: number;
    unit?: UnitType;
    estimatedPrice?: number;
    notes?: string;
  }>,
  action: 'comprado' | 'removido'
): HistoryItem[] {
  let result = [...currentHistory];
  for (const item of items) {
    result = addItemToHistory(result, item, action);
  }
  return result;
}

/**
 * Remove um item individual do histórico
 */
export function removeItemFromHistory(currentHistory: HistoryItem[], id: string): HistoryItem[] {
  return currentHistory.filter(h => h.id !== id);
}

/**
 * Formata data relativa amigável em português
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 2) return 'Agora mesmo';
  if (diffMin < 60) return `Há ${diffMin} min`;
  if (diffHours === 1) return 'Há 1 hora';
  if (diffHours < 24) return `Há ${diffHours} horas`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 14) return 'Há 1 semana';
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 60) return 'Há 1 mês';
  return `Há ${Math.floor(diffDays / 30)} meses`;
}

/**
 * Carrega histórico do localStorage
 */
export function loadHistoryFromStorage(userId?: string): HistoryItem[] {
  if (typeof window === 'undefined') return INITIAL_HISTORY_ITEMS;
  try {
    const key = userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Salva itens iniciais
      saveHistoryToStorage(INITIAL_HISTORY_ITEMS, userId);
      return INITIAL_HISTORY_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_HISTORY_ITEMS;
  } catch {
    return INITIAL_HISTORY_ITEMS;
  }
}

/**
 * Salva histórico no localStorage
 */
export function saveHistoryToStorage(history: HistoryItem[], userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
    localStorage.setItem(key, JSON.stringify(history));
  } catch {
    // Ignore quota issues
  }
}
