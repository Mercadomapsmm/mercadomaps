'use client';

import React, { useState, useMemo } from 'react';
import { HistoryItem, ShoppingItem, FontSizeOption } from '@/types/shopping';
import { CATEGORIES } from '@/lib/categories';
import { formatRelativeTime } from '@/lib/history';
import {
  History,
  Plus,
  Check,
  Search,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  RotateCcw,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface HistorySectionProps {
  history: HistoryItem[];
  activeListItems: ShoppingItem[];
  onAddItemToList: (item: HistoryItem) => void;
  onAddMultipleToList?: (items: HistoryItem[]) => void;
  onRemoveFromHistory: (id: string) => void;
  onClearHistory: () => void;
  fontSize: FontSizeOption;
  highContrast: boolean;
  soundEnabled: boolean;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  activeListItems,
  onAddItemToList,
  onAddMultipleToList,
  onRemoveFromHistory,
  onClearHistory,
  fontSize,
  highContrast,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'frequent' | 'bought' | 'removed'>('frequent');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Set of normalized names currently in the active list
  const activeItemNames = useMemo(() => {
    return new Set(activeListItems.map(i => i.name.trim().toLowerCase()));
  }, [activeListItems]);

  // Filtered and sorted history items
  const filteredHistory = useMemo(() => {
    let result = [...history];

    // Filter by tab
    if (activeTab === 'frequent') {
      // Sort by timesUsed descending, only items with at least 2 uses or highest
      result.sort((a, b) => b.timesUsed - a.timesUsed);
    } else if (activeTab === 'bought') {
      result = result.filter(h => h.lastAction === 'comprado');
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (activeTab === 'removed') {
      result = result.filter(h => h.lastAction === 'removido');
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      // 'all'
      result.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(h => {
        const matchName = h.name.toLowerCase().includes(q);
        const catInfo = CATEGORIES[h.category];
        const matchCat = catInfo ? catInfo.name.toLowerCase().includes(q) : false;
        return matchName || matchCat;
      });
    }

    return result;
  }, [history, activeTab, searchQuery]);

  // Top 5 most frequent items
  const topFrequentItems = useMemo(() => {
    return [...history]
      .sort((a, b) => b.timesUsed - a.timesUsed)
      .slice(0, 5);
  }, [history]);

  const handleAddSingle = (item: HistoryItem) => {
    onAddItemToList(item);
    setRecentlyAddedId(item.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  const handleAddTopFrequent = () => {
    if (onAddMultipleToList && topFrequentItems.length > 0) {
      onAddMultipleToList(topFrequentItems);
    } else {
      topFrequentItems.forEach(item => onAddItemToList(item));
    }
  };

  // Font size responsive classes
  const titleSizeClass = {
    normal: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    extra: 'text-xl sm:text-2xl',
  }[fontSize];

  const itemNameSizeClass = {
    normal: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg',
    extra: 'text-lg sm:text-xl',
  }[fontSize];

  return (
    <section
      id="shopping-history-section"
      aria-label="Histórico de compras e itens recorrentes"
      className={`rounded-2xl border transition-all ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      {/* Header Bar with Toggle */}
      <div
        className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        aria-controls="history-content-panel"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
              highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
            }`}
          >
            <History className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-black tracking-tight ${titleSizeClass}`}>
                Histórico & Itens Recorrentes
              </h2>
              <span
                id="history-total-count-badge"
                className={`px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                  highContrast
                    ? 'bg-yellow-400 text-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {history.length} {history.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Itens comprados anteriormente ou removidos da lista para recompra rápida
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="toggle-history-section-btn"
            type="button"
            className={`p-2 rounded-xl transition-colors ${
              highContrast
                ? 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            aria-label={isExpanded ? 'Recolher histórico' : 'Expandir histórico'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Panel */}
      {isExpanded && (
        <div
          id="history-content-panel"
          className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4"
        >
          {/* Quick Action: Add Top Frequent Banner */}
          {topFrequentItems.length > 0 && (
            <div
              id="top-frequent-recommendation-card"
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                highContrast
                  ? 'bg-zinc-950 border-yellow-400 text-white'
                  : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200">
                    Abastecer Itens Mais Frequentes
                  </h4>
                  <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-300">
                    Adicione rapidamente os {topFrequentItems.length} produtos que você mais compra ({topFrequentItems.map(i => i.name).slice(0, 3).join(', ')}...)
                  </p>
                </div>
              </div>

              <button
                id="add-all-top-frequent-btn"
                type="button"
                onClick={handleAddTopFrequent}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Top {topFrequentItems.length} à Lista</span>
              </button>
            </div>
          )}

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="history-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produto no histórico..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border focus:ring-2 focus:ring-emerald-500 ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-white placeholder-zinc-400'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                id="history-filter-frequent-tab"
                type="button"
                onClick={() => setActiveTab('frequent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'frequent'
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Mais Frequentes</span>
              </button>

              <button
                id="history-filter-bought-tab"
                type="button"
                onClick={() => setActiveTab('bought')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'bought'
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Comprados</span>
              </button>

              <button
                id="history-filter-removed-tab"
                type="button"
                onClick={() => setActiveTab('removed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'removed'
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Removidos</span>
              </button>

              <button
                id="history-filter-all-tab"
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Todos ({history.length})
              </button>
            </div>
          </div>

          {/* Items Grid/List */}
          {filteredHistory.length === 0 ? (
            <div className="py-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Nenhum produto encontrado neste filtro
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Conforme você marca itens como comprados ou os remove da lista, eles aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredHistory.map((item) => {
                const isAlreadyInActiveList = activeItemNames.has(item.name.trim().toLowerCase());
                const isJustAdded = recentlyAddedId === item.id;
                const catInfo = CATEGORIES[item.category] || CATEGORIES.outros;

                return (
                  <div
                    key={item.id}
                    id={`history-item-${item.id}`}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      highContrast
                        ? 'bg-zinc-900 border-zinc-700 text-white hover:border-yellow-400'
                        : isAlreadyInActiveList
                        ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    {/* Left Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Category Badge */}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 whitespace-nowrap ${
                            highContrast
                              ? 'bg-black text-yellow-400 border-yellow-400'
                              : `${catInfo.bgColor} ${catInfo.color} ${catInfo.borderColor}`
                          }`}
                        >
                          <span>{catInfo.icon}</span>
                          <span>{catInfo.name}</span>
                        </span>

                        {/* Recurrence Badge */}
                        {item.timesUsed > 1 && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 whitespace-nowrap ${
                              highContrast
                                ? 'bg-zinc-800 text-yellow-300'
                                : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                            }`}
                            title={`Item comprado ou utilizado ${item.timesUsed} vezes`}
                          >
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>{item.timesUsed}x</span>
                          </span>
                        )}

                        {/* Action status tag */}
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {item.lastAction === 'comprado' ? 'Comprado' : 'Removido'} {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h4
                        className={`font-bold tracking-tight truncate mt-1 ${itemNameSizeClass} ${
                          highContrast ? 'text-white' : 'text-slate-900 dark:text-white'
                        }`}
                        title={item.name}
                      >
                        {item.name}
                      </h4>

                      {/* Quantity & Price Info */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          Padrão: {item.quantity} {item.unit}
                        </span>
                        {item.estimatedPrice && item.estimatedPrice > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              R$ {item.estimatedPrice.toFixed(2).replace('.', ',')}
                            </span>
                          </>
                        )}
                        {isAlreadyInActiveList && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold whitespace-nowrap">
                            Já na lista
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Add button */}
                      <button
                        id={`add-history-item-${item.id}-btn`}
                        type="button"
                        onClick={() => handleAddSingle(item)}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap shadow-xs ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white scale-105'
                            : highContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                            : isAlreadyInActiveList
                            ? 'bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title={
                          isAlreadyInActiveList
                            ? 'Adicionar mais 1 deste item à lista atual'
                            : 'Adicionar este produto à lista atual com 1 clique'
                        }
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Adicionado!</span>
                          </>
                        ) : isAlreadyInActiveList ? (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+1</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Adicionar</span>
                          </>
                        )}
                      </button>

                      {/* Remove from history button */}
                      <button
                        id={`delete-history-item-${item.id}-btn`}
                        type="button"
                        onClick={() => onRemoveFromHistory(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remover do histórico"
                        aria-label={`Remover ${item.name} do histórico`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* History Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Total de {history.length} produtos gravados no histórico
            </span>

            {history.length > 0 && (
              <button
                id="clear-all-history-btn"
                type="button"
                onClick={() => {
                  if (confirm('Tem certeza de que deseja limpar todo o histórico de compras?')) {
                    onClearHistory();
                  }
                }}
                className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold hover:underline"
              >
                Limpar Histórico
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
