'use client';

import React, { useState } from 'react';
import { ShoppingItem, FontSizeOption, ContrastThemeId } from '@/types/shopping';
import { CheckCircle2, ShoppingBag, Trash2, Share2, Volume2, Check, Filter } from 'lucide-react';
import { CONTRAST_THEMES } from '@/lib/contrastThemes';

interface ShoppingListSummaryProps {
  items: ShoppingItem[];
  filter: 'all' | 'pending' | 'bought';
  onFilterChange: (newFilter: 'all' | 'pending' | 'bought') => void;
  onClearBought: () => void;
  onReadList: () => void;
  listName: string;
  fontSize: FontSizeOption;
  highContrast: boolean;
  contrastTheme?: ContrastThemeId;
  onOpenShare?: () => void;
}

export const ShoppingListSummary: React.FC<ShoppingListSummaryProps> = ({
  items,
  filter,
  onFilterChange,
  onClearBought,
  onReadList,
  listName,
  fontSize,
  highContrast,
  contrastTheme,
  onOpenShare,
}) => {
  const currentThemeId = contrastTheme || (highContrast ? 'amarelo-preto' : 'padrao');
  const activeTheme = CONTRAST_THEMES[currentThemeId] || CONTRAST_THEMES.padrao;
  const [copied, setCopied] = useState(false);

  const totalCount = items.length;
  const boughtCount = items.filter(i => i.isBought).length;
  const pendingCount = totalCount - boughtCount;
  const percentage = totalCount > 0 ? Math.round((boughtCount / totalCount) * 100) : 0;

  // Calculate prices
  const totalEstimated = items.reduce((acc, item) => {
    if (item.estimatedPrice) {
      return acc + item.estimatedPrice * item.quantity;
    }
    return acc;
  }, 0);

  const cartEstimated = items.reduce((acc, item) => {
    if (item.isBought && item.estimatedPrice) {
      return acc + item.estimatedPrice * item.quantity;
    }
    return acc;
  }, 0);

  const handleShareList = () => {
    if (onOpenShare) {
      onOpenShare();
      return;
    }

    if (items.length === 0) return;

    let text = `🛒 *Lista de Compras: ${listName}*\n\n`;

    const toBuy = items.filter(i => !i.isBought);
    const bought = items.filter(i => i.isBought);

    if (toBuy.length > 0) {
      text += `*A COMPRAR (${toBuy.length}):*\n`;
      toBuy.forEach(i => {
        text += `▫️ ${i.quantity} ${i.unit} ${i.name}\n`;
      });
    }

    if (bought.length > 0) {
      text += `\n*JÁ NO CARRINHO (${bought.length}):*\n`;
      bought.forEach(i => {
        text += `✅ ~${i.quantity} ${i.unit} ${i.name}~\n`;
      });
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const badgeFontSize = {
    normal: 'text-sm font-semibold',
    large: 'text-base font-bold',
    extra: 'text-lg font-black',
  }[fontSize];

  return (
    <section
      id="shopping-list-summary"
      aria-label="Resumo da Lista de Compras"
      className={`rounded-2xl p-4 sm:p-5 border transition-all ${activeTheme.bgCard} ${activeTheme.borderCard} ${activeTheme.textPrimary}`}
    >
      {/* Top row: Progress bar + Percentage */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Progresso da Compra</span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
            {boughtCount} de {totalCount} {totalCount === 1 ? 'item' : 'itens'} ({percentage}%)
          </span>
        </div>

        {/* Big Visual Progress Bar */}
        <div className="w-full h-3.5 sm:h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Financial indicator if prices added */}
      {totalEstimated > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
          <div>
            <span className="block text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              No Carrinho:
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
              R$ {cartEstimated.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Total Previsto:
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-200">
              R$ {totalEstimated.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      )}

      {/* Filter Tabs + Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
        {/* Filter Buttons with Big Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <button
            id="filter-all-button"
            type="button"
            onClick={() => onFilterChange('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${badgeFontSize} ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            id="filter-pending-button"
            type="button"
            onClick={() => onFilterChange('pending')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${badgeFontSize} ${
              filter === 'pending'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            A Comprar ({pendingCount})
          </button>
          <button
            id="filter-bought-button"
            type="button"
            onClick={() => onFilterChange('bought')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${badgeFontSize} ${
              filter === 'bought'
                ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            No Carrinho ({boughtCount})
          </button>
        </div>

        {/* Action Buttons: Share & Clear */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            id="share-list-button"
            type="button"
            onClick={handleShareList}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm transition-transform active:scale-95"
            title="Compartilhar todas as listas por WhatsApp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
          </button>

          {boughtCount > 0 && (
            <button
              id="clear-bought-button"
              type="button"
              onClick={onClearBought}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-100 text-xs sm:text-sm transition-transform active:scale-95"
              title="Remover itens marcados como comprados"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Comprados</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
