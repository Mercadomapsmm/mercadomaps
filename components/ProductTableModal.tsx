'use client';

import React, { useState, useMemo } from 'react';
import { TABELA_PRODUTOS_CATEGORIAS, ProductClassification, normalizarNome } from '@/lib/productTable';
import { CATEGORIES } from '@/lib/categories';
import { CategoryId } from '@/types/shopping';
import { X, Search, Plus, BookOpen, Check } from 'lucide-react';

interface ProductTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct?: (name: string, category: CategoryId, unit?: string) => void;
  highContrast?: boolean;
}

export function ProductTableModal({
  isOpen,
  onClose,
  onAddProduct,
  highContrast = false,
}: ProductTableModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'todas'>('todas');
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const term = normalizarNome(searchTerm);
    return TABELA_PRODUTOS_CATEGORIAS.filter((prod) => {
      const matchCategory =
        selectedCategory === 'todas' || prod.categoria === selectedCategory;

      if (!matchCategory) return false;

      if (!term) return true;

      const matchNome = normalizarNome(prod.nome).includes(term);
      const matchDep = normalizarNome(prod.departamento).includes(term);
      const matchKw = prod.palavrasChave.some((kw) =>
        normalizarNome(kw).includes(term)
      );

      return matchNome || matchDep || matchKw;
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  const handleAdd = (prod: ProductClassification) => {
    if (onAddProduct) {
      onAddProduct(prod.nome, prod.categoria, prod.unidadePadrao);
      setAddedItemName(prod.nome);
      setTimeout(() => {
        setAddedItemName(null);
      }, 1500);
    }
  };

  const categoriesList: { id: CategoryId | 'todas'; label: string }[] = [
    { id: 'todas', label: 'Todos os Setores' },
    { id: 'hortifruti', label: 'Hortifrúti' },
    { id: 'carnes', label: 'Carnes & Peixes' },
    { id: 'laticinios', label: 'Laticínios & Ovos' },
    { id: 'padaria', label: 'Padaria & Massas' },
    { id: 'mercearia', label: 'Mercearia & Grãos' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'limpeza', label: 'Limpeza da Casa' },
    { id: 'higiene', label: 'Higiene & Cuidados' },
    { id: 'congelados', label: 'Congelados' },
  ];

  return (
    <div
      id="product-table-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${
          highContrast
            ? 'bg-black text-white border-yellow-400'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            highContrast
              ? 'border-yellow-400 bg-zinc-900'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Tabela de Classificação de Produtos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tabela de referência usada para a categorização e o agrupamento automático
              </p>
            </div>
          </div>
          <button
            id="close-product-table-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-product-table-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por produto, departamento ou palavra-chave..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm font-semibold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              Exibindo <span className="font-bold text-emerald-600">{filteredProducts.length}</span> de{' '}
              {TABELA_PRODUTOS_CATEGORIAS.length} produtos
            </div>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.id
                    ? highContrast
                      ? 'bg-yellow-400 text-black border-yellow-300 font-extrabold'
                      : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table Content */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[55vh]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-base font-semibold">Nenhum produto encontrado</p>
              <p className="text-xs text-slate-500 mt-1">Tente pesquisar por outro nome ou selecione outro departamento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr
                    className={`border-b text-xs font-bold uppercase tracking-wider ${
                      highContrast
                        ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                        : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <th className="py-3 px-4">Produto</th>
                    <th className="py-3 px-4">Classificação / Departamento</th>
                    <th className="py-3 px-3">Unid. Típica</th>
                    <th className="py-3 px-4 hidden md:table-cell">Termos & Palavras-Chave</th>
                    <th className="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map((prod) => {
                    const catInfo = CATEGORIES[prod.categoria] || CATEGORIES.outros;
                    const isJustAdded = addedItemName === prod.nome;

                    return (
                      <tr
                        key={prod.nome}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {prod.nome}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-semibold ${
                              highContrast
                                ? 'bg-black text-yellow-300 border-yellow-400'
                                : `${catInfo.bgColor} ${catInfo.color} ${catInfo.borderColor}`
                            }`}
                          >
                            {prod.departamento}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {prod.unidadePadrao || 'un'}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {prod.palavrasChave.slice(0, 4).map((kw) => (
                              <span
                                key={kw}
                                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]"
                              >
                                {kw}
                              </span>
                            ))}
                            {prod.palavrasChave.length > 4 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{prod.palavrasChave.length - 4}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleAdd(prod)}
                            disabled={isJustAdded}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
                            }`}
                            title={`Adicionar ${prod.nome} à lista de compras`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Adicionado!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Adicionar</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between text-xs ${
            highContrast
              ? 'border-yellow-400 bg-zinc-900 text-yellow-300'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
          }`}
        >
          <span>
            Ao adicionar um item, o app consulta esta tabela para classificar e organizar o agrupamento automaticamente.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
