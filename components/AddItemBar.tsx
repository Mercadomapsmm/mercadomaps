'use client';

import React, { useState } from 'react';
import { Plus, Mic, Minus, Tag, DollarSign, ChevronDown } from 'lucide-react';
import { CategoryId, UnitType, ShoppingItem, ContrastThemeId } from '@/types/shopping';
import { CATEGORIES, UNIT_OPTIONS, detectCategory } from '@/lib/categories';
import { TABELA_PRODUTOS_CATEGORIAS, normalizarNome } from '@/lib/productTable';
import { playAddSound } from '@/lib/sound';
import { CONTRAST_THEMES } from '@/lib/contrastThemes';

interface AddItemBarProps {
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'isBought'>) => void;
  onOpenVoiceModal: () => void;
  fontSize: 'normal' | 'large' | 'extra';
  highContrast: boolean;
  contrastTheme?: ContrastThemeId;
  soundEnabled: boolean;
}

export const AddItemBar: React.FC<AddItemBarProps> = ({
  onAddItem,
  onOpenVoiceModal,
  fontSize,
  highContrast,
  contrastTheme,
  soundEnabled,
}) => {
  const currentThemeId = contrastTheme || (highContrast ? 'amarelo-preto' : 'padrao');
  const activeTheme = CONTRAST_THEMES[currentThemeId] || CONTRAST_THEMES.padrao;
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<UnitType>('un');
  const [category, setCategory] = useState<CategoryId>('outros');
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim().length >= 1) {
      const detected = detectCategory(val);
      setCategory(detected);

      // Consulta a tabela para sugerir a unidade de medida padrão se encontrada
      const normalizado = normalizarNome(val);
      const itemTabela = TABELA_PRODUTOS_CATEGORIAS.find(
        (p) =>
          normalizarNome(p.nome) === normalizado ||
          p.palavrasChave.some((kw) => normalizarNome(kw) === normalizado)
      );
      if (itemTabela?.unidadePadrao) {
        setUnit(itemTabela.unidadePadrao);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const priceNum = estimatedPrice ? parseFloat(estimatedPrice.replace(',', '.')) : undefined;
    const detected = detectCategory(name.trim());
    const finalCategory = category !== 'outros' ? category : detected;

    onAddItem({
      name: name.trim().charAt(0).toUpperCase() + name.trim().slice(1),
      quantity: Math.max(0.1, quantity),
      unit,
      category: finalCategory,
      estimatedPrice: priceNum && !isNaN(priceNum) ? priceNum : undefined,
    });

    if (soundEnabled) playAddSound();

    // Reset fields
    setName('');
    setQuantity(1);
    setUnit('un');
    setCategory('outros');
    setEstimatedPrice('');
  };

  const handleQuantityIncrement = () => {
    setQuantity(prev => {
      if (unit === 'kg' || unit === 'L') {
        return Math.round((prev + 0.5) * 10) / 10;
      }
      return prev + 1;
    });
  };

  const handleQuantityDecrement = () => {
    setQuantity(prev => {
      if (unit === 'kg' || unit === 'L') {
        return Math.max(0.5, Math.round((prev - 0.5) * 10) / 10);
      }
      return Math.max(1, prev - 1);
    });
  };

  const fontInputClasses = {
    normal: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    extra: 'text-xl sm:text-2xl',
  }[fontSize];

  return (
    <section
      id="add-item-section"
      aria-label="Adicionar Itens à Lista de Compras"
      className={`rounded-2xl p-3.5 sm:p-5 shadow-sm border transition-all ${activeTheme.bgCard} ${activeTheme.borderCard} ${activeTheme.textPrimary}`}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Main Input Row: Name + Voice Button + Add Button */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              id="item-name-input"
              type="text"
              list="produtos-supermercado-list"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="O que você precisa comprar? (Ex: Leite, Arroz, Pão...)"
              className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border ${activeTheme.bgInput} ${activeTheme.borderInput} text-current focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all ${fontInputClasses}`}
              required
            />
            <datalist id="produtos-supermercado-list">
              {TABELA_PRODUTOS_CATEGORIAS.map((prod) => (
                <option key={prod.nome} value={prod.nome}>
                  {prod.departamento}
                </option>
              ))}
            </datalist>
          </div>

          <div className="flex items-center gap-2">
            {/* Big Voice Command Button */}
            <button
              id="voice-command-bar-button"
              type="button"
              onClick={onOpenVoiceModal}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-xl ${activeTheme.bgButtonSecondary} ${activeTheme.textButtonSecondary} ${activeTheme.borderButtonSecondary} border font-bold transition-transform active:scale-95 shadow-sm`}
              title="Adicionar por comando de voz"
            >
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              <span className="text-sm sm:text-base">Falar</span>
            </button>

            {/* Submit Add Button */}
            <button
              id="add-item-submit-button"
              type="submit"
              disabled={!name.trim()}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-3 sm:py-3.5 rounded-xl ${activeTheme.bgButtonPrimary} ${activeTheme.textButtonPrimary} font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none`}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base">Adicionar</span>
            </button>
          </div>
        </div>

        {/* Second Row: Quantity controls + Unit + Category */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">
              Qtd:
            </span>
            <button
              id="qty-decrement-button"
              type="button"
              onClick={handleQuantityDecrement}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-200 active:scale-90"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              id="item-quantity-input"
              type="number"
              step="any"
              min="0.1"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              className="w-14 sm:w-16 text-center font-extrabold text-base sm:text-lg bg-transparent text-slate-900 dark:text-white focus:outline-none"
              aria-label="Quantidade"
            />
            <button
              id="qty-increment-button"
              type="button"
              onClick={handleQuantityIncrement}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-200 active:scale-90"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Unit Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="item-unit-select" className="sr-only">Unidade</label>
            <select
              id="item-unit-select"
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitType)}
              className="px-3 py-2 rounded-xl border bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 font-semibold text-sm sm:text-base focus:ring-2 focus:ring-emerald-500"
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.fullLabel} ({opt.label})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="item-category-select" className="sr-only">Categoria</label>
            <select
              id="item-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="px-3 py-2 rounded-xl border bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 font-semibold text-sm sm:text-base focus:ring-2 focus:ring-emerald-500"
            >
              {Object.values(CATEGORIES).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Price / Advanced */}
          <button
            id="toggle-price-advanced-btn"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1 ml-auto"
          >
            <DollarSign className="w-4 h-4" />
            <span>{showAdvanced ? 'Ocultar preço' : '+ Adicionar preço estimado'}</span>
          </button>
        </div>

        {/* Optional Price Field */}
        {showAdvanced && (
          <div className="pt-2 flex items-center gap-2">
            <div className="relative w-44">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                R$
              </span>
              <input
                id="estimated-price-input"
                type="text"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="0,00"
                className="w-full pl-9 pr-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (Opcional - para calcular o total da compra)
            </span>
          </div>
        )}
      </form>
    </section>
  );
};
