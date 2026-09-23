'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingList, ShoppingItem, AccessibilitySettings, CategoryId, UnitType } from '@/types/shopping';
import { AccessibilityBar } from '@/components/AccessibilityBar';
import { AddItemBar } from '@/components/AddItemBar';
import { ItemRow } from '@/components/ItemRow';
import { ShoppingListSummary } from '@/components/ShoppingListSummary';
import { ListSelector } from '@/components/ListSelector';
import { VoiceModal } from '@/components/VoiceModal';
import { ShareModal } from '@/components/ShareModal';
import { MercadoLivreBanner } from '@/components/MercadoLivreBanner';
import { PwaRegister } from '@/components/PwaRegister';
import { CONTRAST_THEMES } from '@/lib/contrastThemes';
import { CATEGORIES, detectCategory } from '@/lib/categories';
import { agruparItensPorTabela } from '@/lib/productTable';
import { ParsedVoiceItem, speakListItems, stopSpeaking } from '@/lib/speech';
import { playCheckSound, playUncheckSound, playCompleteSound, playAddSound } from '@/lib/sound';
import { decodeListsFromUrl } from '@/lib/sharing';
import { Mic, Search, CheckCircle, ShoppingCart, Layers, Share2 } from 'lucide-react';

const INITIAL_LISTS: ShoppingList[] = [
  {
    id: 'list-supermercado',
    name: 'Supermercado Semanal',
    icon: '🛒',
    color: '#059669',
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now(),
    items: [
      {
        id: 'item-1',
        name: 'Arroz agulhinha tipo 1',
        quantity: 1,
        unit: 'pct',
        category: 'mercearia',
        estimatedPrice: 28.50,
        isBought: false,
        createdAt: Date.now() - 50000,
      },
      {
        id: 'item-2',
        name: 'Feijão carioca',
        quantity: 1,
        unit: 'kg',
        category: 'mercearia',
        estimatedPrice: 8.90,
        isBought: false,
        createdAt: Date.now() - 40000,
      },
      {
        id: 'item-3',
        name: 'Leite integral',
        quantity: 3,
        unit: 'cx',
        category: 'laticinios',
        estimatedPrice: 5.20,
        isBought: true,
        createdAt: Date.now() - 30000,
      },
      {
        id: 'item-4',
        name: 'Ovos brancos grandes',
        quantity: 1,
        unit: 'dz',
        category: 'laticinios',
        estimatedPrice: 16.00,
        isBought: false,
        createdAt: Date.now() - 20000,
      },
      {
        id: 'item-5',
        name: 'Banana prata',
        quantity: 1,
        unit: 'dz',
        category: 'hortifruti',
        estimatedPrice: 9.50,
        isBought: false,
        createdAt: Date.now() - 15000,
      },
      {
        id: 'item-6',
        name: 'Tomate para salada',
        quantity: 1.5,
        unit: 'kg',
        category: 'hortifruti',
        estimatedPrice: 7.00,
        isBought: false,
        createdAt: Date.now() - 10000,
      },
      {
        id: 'item-7',
        name: 'Detergente de coco',
        quantity: 2,
        unit: 'un',
        category: 'limpeza',
        estimatedPrice: 2.80,
        isBought: true,
        createdAt: Date.now() - 5000,
      },
    ],
  },
  {
    id: 'list-feira',
    name: 'Feira & Frutas',
    icon: '🍎',
    color: '#d97706',
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now(),
    items: [
      {
        id: 'item-f1',
        name: 'Maçã gala',
        quantity: 1,
        unit: 'kg',
        category: 'hortifruti',
        estimatedPrice: 11.90,
        isBought: false,
        createdAt: Date.now() - 3000,
      },
      {
        id: 'item-f2',
        name: 'Batata inglesa',
        quantity: 2,
        unit: 'kg',
        category: 'hortifruti',
        estimatedPrice: 6.50,
        isBought: false,
        createdAt: Date.now() - 2000,
      },
      {
        id: 'item-f3',
        name: 'Alface americana',
        quantity: 1,
        unit: 'un',
        category: 'hortifruti',
        estimatedPrice: 4.50,
        isBought: false,
        createdAt: Date.now() - 1000,
      },
    ],
  },
  {
    id: 'list-limpeza',
    name: 'Limpeza & Casa',
    icon: '🧹',
    color: '#0d9488',
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now(),
    items: [
      {
        id: 'item-l1',
        name: 'Sabão em pó',
        quantity: 1,
        unit: 'cx',
        category: 'limpeza',
        estimatedPrice: 18.90,
        isBought: false,
        createdAt: Date.now() - 2500,
      },
      {
        id: 'item-l2',
        name: 'Água sanitária',
        quantity: 1,
        unit: 'garrafa',
        category: 'limpeza',
        estimatedPrice: 6.90,
        isBought: false,
        createdAt: Date.now() - 1500,
      },
    ],
  },
];

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  contrastTheme: 'padrao',
  soundFeedback: true,
  groupByCategory: false,
  speechSpeed: 1.0,
};

export default function ShoppingListPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lists, setLists] = useState<ShoppingList[]>(INITIAL_LISTS);
  const [activeListId, setActiveListId] = useState<string>('list-supermercado');
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  const [filter, setFilter] = useState<'all' | 'pending' | 'bought'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedImportPrompt, setSharedImportPrompt] = useState<{
    lists: ShoppingList[];
    sharedByName: string;
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Alternância de posições entre bans-01 e bani-01 a cada 30 segundos
  const [topBannerId, setTopBannerId] = useState<'bans-01' | 'bani-01'>('bans-01');
  const bottomBannerId: 'bans-01' | 'bani-01' = topBannerId === 'bans-01' ? 'bani-01' : 'bans-01';

  useEffect(() => {
    const bannerSwapInterval = setInterval(() => {
      setTopBannerId((prev) => (prev === 'bans-01' ? 'bani-01' : 'bans-01'));
    }, 30000);

    return () => clearInterval(bannerSwapInterval);
  }, []);

  // Load from localStorage on mount only to prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedLists = localStorage.getItem('lista_compras_domestica_lists');
        if (savedLists) {
          const parsed = JSON.parse(savedLists);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLists(parsed);
          }
        }

        const savedActiveId = localStorage.getItem('lista_compras_domestica_active_id');
        if (savedActiveId) {
          setActiveListId(savedActiveId);
        }
        const savedSettings = localStorage.getItem('lista_compras_domestica_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }

        // Verifica se há dados de listas compartilhadas na URL (?shared_data=)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const sharedData = params.get('shared_data');
          if (sharedData) {
            const decoded = decodeListsFromUrl(sharedData);
            if (decoded && decoded.lists.length > 0) {
              setSharedImportPrompt(decoded);
            }
          }
        }
      } catch {
        // Ignore
      }
      setHasMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage when state updates after mount
  useEffect(() => {
    if (!hasMounted) return;
    try {
      localStorage.setItem('lista_compras_domestica_lists', JSON.stringify(lists));
      localStorage.setItem('lista_compras_domestica_settings', JSON.stringify(settings));
      localStorage.setItem('lista_compras_domestica_active_id', activeListId);
    } catch {
      // Ignore
    }
  }, [lists, settings, activeListId, hasMounted]);

  const activeList = lists.find(l => l.id === activeListId) || lists[0];

  const handleUpdateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleSelectList = (id: string) => {
    setActiveListId(id);
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleCreateList = (name: string) => {
    const newList: ShoppingList = {
      id: `list-${Date.now()}`,
      name,
      icon: '🛒',
      color: '#059669',
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLists(prev => [newList, ...prev]);
    setActiveListId(newList.id);
  };

  const handleDeleteList = (id: string) => {
    if (lists.length <= 1) return;
    const remaining = lists.filter(l => l.id !== id);
    setLists(remaining);
    if (activeListId === id) {
      setActiveListId(remaining[0].id);
    }
  };

  const handleAddItem = (itemData: Omit<ShoppingItem, 'id' | 'createdAt' | 'isBought'>) => {
    // Classifica automaticamente de acordo com as categorias de supermercado se for 'outros' ou não especificado
    const detected = detectCategory(itemData.name);
    const finalCategory = (!itemData.category || itemData.category === 'outros') ? detected : itemData.category;

    const newItem: ShoppingItem = {
      ...itemData,
      category: finalCategory,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      isBought: false,
    };

    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: [newItem, ...l.items],
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleAddMultipleVoiceItems = (parsedItems: ParsedVoiceItem[]) => {
    const newItems: ShoppingItem[] = parsedItems.map((p, idx) => {
      const detected = detectCategory(p.name);
      const finalCategory = (!p.category || p.category === 'outros') ? detected : p.category;
      return {
        id: `item-${Date.now()}-${idx}`,
        name: p.name,
        quantity: p.quantity,
        unit: p.unit as UnitType,
        category: finalCategory as CategoryId,
        estimatedPrice: p.estimatedPrice !== undefined && p.estimatedPrice > 0 ? p.estimatedPrice : undefined,
        isBought: false,
        createdAt: Date.now() + idx,
      };
    });

    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: [...newItems, ...l.items],
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleToggleBought = (itemId: string) => {
    let nowCompleted = false;

    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          const updatedItems = l.items.map(item => {
            if (item.id === itemId) {
              const newBought = !item.isBought;
              if (settings.soundFeedback) {
                if (newBought) {
                  playCheckSound();
                } else {
                  playUncheckSound();
                }
              }
              return { ...item, isBought: newBought };
            }
            return item;
          });

          // Check if all items are now bought!
          const allBought = updatedItems.length > 0 && updatedItems.every(i => i.isBought);
          if (allBought) {
            nowCompleted = true;
          }

          return { ...l, items: updatedItems, updatedAt: Date.now() };
        }
        return l;
      })
    );

    if (nowCompleted) {
      if (settings.soundFeedback) playCompleteSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: l.items.filter(i => i.id !== itemId),
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: l.items.map(item =>
              item.id === itemId ? { ...item, quantity: Math.max(0.1, newQty) } : item
            ),
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleUpdateCategory = (itemId: string, newCategory: CategoryId) => {
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: l.items.map(item =>
              item.id === itemId ? { ...item, category: newCategory } : item
            ),
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleUpdatePrice = (itemId: string, newPrice: number) => {
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: l.items.map(item =>
              item.id === itemId ? { ...item, estimatedPrice: Math.max(0, newPrice) } : item
            ),
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleUpdateUnit = (itemId: string, newUnit: UnitType) => {
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: l.items.map(item =>
              item.id === itemId ? { ...item, unit: newUnit } : item
            ),
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleConfirmSharedImport = () => {
    if (!sharedImportPrompt) return;
    setLists(sharedImportPrompt.lists);
    if (sharedImportPrompt.lists[0]) {
      setActiveListId(sharedImportPrompt.lists[0].id);
    }
    setSharedImportPrompt(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('shared_data');
      window.history.replaceState({}, document.title, url.pathname);
    }
    if (settings.soundFeedback) playAddSound();
  };

  const handleImportLists = (newLists: ShoppingList[]) => {
    setLists(newLists);
    if (newLists[0]) {
      setActiveListId(newLists[0].id);
    }
  };

  const handleClearBought = () => {
    if (!confirm('Deseja remover todos os itens que já foram colocados no carrinho?')) return;
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeListId) {
          return {
            ...l,
            items: l.items.filter(i => !i.isBought),
            updatedAt: Date.now(),
          };
        }
        return l;
      })
    );
  };

  const handleReadList = () => {
    if (!activeList) return;
    setIsSpeaking(true);
    speakListItems(activeList.items, settings.speechSpeed);

    // Watch when speech ends
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const checkInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setIsSpeaking(false);
          clearInterval(checkInterval);
        }
      }, 500);
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  // Filter items
  const filteredItems = (activeList?.items || []).filter(item => {
    if (filter === 'pending' && item.isBought) return false;
    if (filter === 'bought' && !item.isBought) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const catName = CATEGORIES[item.category]?.name.toLowerCase() || '';
      const matchCat = catName.includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  const pendingItems = (activeList?.items || []).filter(i => !i.isBought);
  const boughtItems = (activeList?.items || []).filter(i => i.isBought);

  // Agrupamento dos produtos utilizando a Tabela de Produtos e Classificação de Categorias
  const groupedItems = React.useMemo(() => {
    if (!settings.groupByCategory) return null;
    return agruparItensPorTabela(filteredItems);
  }, [filteredItems, settings.groupByCategory]);

  const containerPaddingClass = {
    normal: 'p-4 sm:p-6',
    large: 'p-5 sm:p-7',
    extra: 'p-6 sm:p-8',
  }[settings.fontSize];

  const currentThemeId = settings.contrastTheme || (settings.highContrast ? 'amarelo-preto' : 'padrao');
  const activeTheme = CONTRAST_THEMES[currentThemeId] || CONTRAST_THEMES.padrao;

  // Carregamento inicial rápido para sincronizar estado e evitar hydration mismatch
  if (!hasMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 animate-pulse mb-3">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Carregando Lista de Compras...</p>
      </div>
    );
  }

  return (
    <div
      id="app-root"
      suppressHydrationWarning
      className={`min-h-screen transition-colors ${activeTheme.bgPage}`}
    >
      {/* Banner Mercado Livre Superior (alterna com o inferior a cada 30 segundos: bans-01 <-> bani-01) */}
      <div id="top-banner-wrapper" className="w-full">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-1.5 transition-all duration-500">
          <MercadoLivreBanner
            key={`top-${topBannerId}`}
            position="top"
            internalName={topBannerId}
            highContrast={settings.highContrast}
          />
        </div>
      </div>

      {/* Barra de Acessibilidade */}
      <AccessibilityBar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onReadList={handleReadList}
        isSpeaking={isSpeaking}
        onStopSpeaking={handleStopSpeaking}
        remainingCount={pendingItems.length}
      />

      {/* Header Principal do App com Título sempre em Destaque e Ações */}
      <header className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 sm:w-3 h-8 sm:h-9 rounded-full ${activeTheme.accentBar}`}
            aria-hidden="true"
          />
          <h1
            id="app-main-title"
            className={`text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none ${activeTheme.titleColor}`}
          >
            Lista de Compras
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
          {/* Compartilhar o Aplicativo e Listas */}
          <button
            id="header-share-app-btn"
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs sm:text-sm ${activeTheme.bgButtonSecondary} ${activeTheme.textButtonSecondary} ${activeTheme.borderButtonSecondary} border`}
            title="Compartilhar o aplicativo e suas listas com outras pessoas"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>

          {/* Quick Voice Command CTA Banner */}
          <button
            id="header-voice-cta-button"
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs sm:text-sm ${activeTheme.bgButtonPrimary} ${activeTheme.textButtonPrimary}`}
            title="Ditar itens para a lista usando a voz"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            <span>Adicionar por Voz</span>
          </button>
        </div>
      </header>

      {/* ÁREA FIXA NA TELA: Suas Listas de Compras */}
      <div
        id="fixed-screen-area"
        className={`sticky top-0 z-30 w-full transition-colors border-none shadow-sm backdrop-blur-md ${activeTheme.bgStickyHeader}`}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
          {/* List Navigation Tabs */}
          <ListSelector
            lists={lists}
            activeListId={activeListId}
            onSelectList={handleSelectList}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
            fontSize={settings.fontSize}
            highContrast={settings.highContrast}
            contrastTheme={currentThemeId}
            soundEnabled={settings.soundFeedback}
          />
        </div>
      </div>

      {/* Main Container */}
      <main className={`max-w-4xl mx-auto ${containerPaddingClass} pt-4 pb-12 space-y-5 sm:space-y-6`}>
        {/* Banner de Importação de Listas Compartilhadas Recebidas */}
        {sharedImportPrompt && (
          <div
            id="shared-list-import-banner"
            className="p-4 rounded-2xl bg-emerald-700 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">
                  Listas de Compras Compartilhadas Recebidas!
                </h3>
                <p className="text-xs text-emerald-100">
                  {sharedImportPrompt.sharedByName} compartilhou {sharedImportPrompt.lists.length}{' '}
                  {sharedImportPrompt.lists.length === 1 ? 'lista' : 'listas'} com{' '}
                  {sharedImportPrompt.lists.reduce((acc, l) => acc + l.items.length, 0)} itens com você.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="confirm-import-shared-btn"
                type="button"
                onClick={handleConfirmSharedImport}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white text-emerald-900 font-extrabold text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-xs active:scale-95"
              >
                Importar para o Meu App
              </button>
              <button
                id="cancel-import-shared-btn"
                type="button"
                onClick={() => {
                  setSharedImportPrompt(null);
                  if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('shared_data');
                    window.history.replaceState({}, document.title, url.pathname);
                  }
                }}
                className="px-3 py-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-colors"
              >
                Ignorar
              </button>
            </div>
          </div>
        )}

        {/* Add Item Form / Quick Staples (retirado da parte fixa conforme solicitado) */}
        <AddItemBar
          onAddItem={handleAddItem}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          fontSize={settings.fontSize}
          highContrast={settings.highContrast}
          contrastTheme={currentThemeId}
          soundEnabled={settings.soundFeedback}
        />

        {/* Shopping Progress & Summary Card */}
        {activeList && (
          <ShoppingListSummary
            items={activeList.items}
            filter={filter}
            onFilterChange={setFilter}
            onClearBought={handleClearBought}
            onReadList={handleReadList}
            listName={activeList.name}
            fontSize={settings.fontSize}
            highContrast={settings.highContrast}
            contrastTheme={currentThemeId}
            onOpenShare={() => setIsShareModalOpen(true)}
          />
        )}

        {/* Search Bar & Group by Categories Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-items-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar item ou categoria nesta lista..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${activeTheme.bgInput} ${activeTheme.borderInput} text-current text-sm sm:text-base font-semibold focus:ring-2 focus:ring-emerald-500`}
            />
          </div>

          {/* Botão para agrupar por categorias */}
          <button
            id="group-by-category-button"
            type="button"
            onClick={() => handleUpdateSettings({ groupByCategory: !settings.groupByCategory })}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-95 ${
              settings.groupByCategory
                ? `${activeTheme.bgButtonPrimary} ${activeTheme.textButtonPrimary} border-transparent ring-2 ring-current`
                : `${activeTheme.bgCard} ${activeTheme.borderCard} ${activeTheme.textPrimary}`
            }`}
            title="Agrupar os produtos da lista por categorias de supermercado"
          >
            <Layers className="w-4 h-4" />
            <span>{settings.groupByCategory ? 'Agrupado por Categorias' : 'Agrupar por Categorias'}</span>
          </button>
        </div>

        {/* Items Listing Section */}
        <section
          id="items-list-container"
          aria-label="Itens da lista de compras"
          className="space-y-2.5"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                {activeList?.items.length === 0
                  ? 'Sua lista está vazia!'
                  : 'Nenhum item encontrado no filtro atual.'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {activeList?.items.length === 0
                  ? 'Adicione itens escrevendo no campo acima ou toque em "Adicionar por Voz" para ditar sua lista.'
                  : 'Mude os filtros para "Todos" ou limpe o termo de busca.'}
              </p>
            </div>
          ) : settings.groupByCategory && groupedItems ? (
            <div className="space-y-4">
              {groupedItems.map(group => {
                const boughtInGroup = group.items.filter(i => i.isBought).length;

                return (
                  <div
                    key={group.categoryId}
                    id={`category-group-${group.categoryId}`}
                    className="space-y-2"
                  >
                    {/* Category Header Banner */}
                    <div
                      className={`flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold ${
                        settings.highContrast || (settings.contrastTheme && settings.contrastTheme !== 'padrao')
                          ? `${activeTheme.bgCard} ${activeTheme.borderCard} ${activeTheme.titleColor}`
                          : `${group.category.bgColor} ${group.category.color} ${group.category.borderColor}`
                      }`}
                    >
                      <span className="uppercase tracking-wider font-extrabold">
                        {group.category.name}
                      </span>
                      <span className="text-xs font-semibold opacity-90">
                        {group.items.length} {group.items.length === 1 ? 'item' : 'itens'}
                        {boughtInGroup > 0 && ` (${boughtInGroup} no carrinho)`}
                      </span>
                    </div>

                    {/* Category Products */}
                    <div className="space-y-2">
                      {group.items.map(item => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          onToggleBought={handleToggleBought}
                          onDelete={handleDeleteItem}
                          onUpdateQuantity={handleUpdateQuantity}
                          onUpdateCategory={handleUpdateCategory}
                          onUpdatePrice={handleUpdatePrice}
                          onUpdateUnit={handleUpdateUnit}
                          fontSize={settings.fontSize}
                          highContrast={settings.highContrast}
                          contrastTheme={currentThemeId}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onToggleBought={handleToggleBought}
                  onDelete={handleDeleteItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdateCategory={handleUpdateCategory}
                  onUpdatePrice={handleUpdatePrice}
                  onUpdateUnit={handleUpdateUnit}
                  fontSize={settings.fontSize}
                  highContrast={settings.highContrast}
                  contrastTheme={currentThemeId}
                />
              ))}
            </div>
          )}
        </section>

        {/* Banner Mercado Livre no rodapé (alterna com o superior a cada 30 segundos: bani-01 <-> bans-01) */}
        <div id="footer-banner-wrapper" className="pt-2">
          <div className="transition-all duration-500">
            <MercadoLivreBanner
              key={`bottom-${bottomBannerId}`}
              position="bottom"
              internalName={bottomBannerId}
              highContrast={settings.highContrast}
            />
          </div>
        </div>
      </main>

      {/* Voice Recognition Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddItems={handleAddMultipleVoiceItems}
        fontSize={settings.fontSize}
        highContrast={settings.highContrast}
        soundEnabled={settings.soundFeedback}
      />

      {/* Modal de Compartilhamento do Aplicativo & Listas */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        lists={lists}
        activeList={activeList || lists[0]}
        userName="Usuário"
        highContrast={settings.highContrast}
        soundEnabled={settings.soundFeedback}
        onImportLists={handleImportLists}
      />

      {/* Service Worker Cleanup (Desregistra qualquer versão anterior de PWA) */}
      <PwaRegister />
    </div>
  );
}
