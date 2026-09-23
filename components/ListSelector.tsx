'use client';

import React, { useState } from 'react';
import { ShoppingList, FontSizeOption, ContrastThemeId } from '@/types/shopping';
import { Plus, List, Mic, Trash2, Edit2, Check, X, FolderPlus } from 'lucide-react';
import { playAddSound, playVoiceStartSound } from '@/lib/sound';
import { CONTRAST_THEMES } from '@/lib/contrastThemes';

interface ListSelectorProps {
  lists: ShoppingList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (id: string) => void;
  fontSize: FontSizeOption;
  highContrast: boolean;
  contrastTheme?: ContrastThemeId;
  soundEnabled: boolean;
}

export const ListSelector: React.FC<ListSelectorProps> = ({
  lists,
  activeListId,
  onSelectList,
  onCreateList,
  onDeleteList,
  fontSize,
  highContrast,
  contrastTheme,
  soundEnabled,
}) => {
  const currentThemeId = contrastTheme || (highContrast ? 'amarelo-preto' : 'padrao');
  const activeTheme = CONTRAST_THEMES[currentThemeId] || CONTRAST_THEMES.padrao;
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isListeningForListName, setIsListeningForListName] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    onCreateList(newListName.trim());
    if (soundEnabled) playAddSound();
    setNewListName('');
    setIsCreating(false);
  };

  const handleVoiceCreateList = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition: new () => any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: new () => any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Reconhecimento de voz não suportado neste navegador. Digite o nome da lista.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningForListName(true);
        if (soundEnabled) playVoiceStartSound();
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript.trim();
        if (spoken) {
          // Clean prefixes like "criar lista", "lista de"
          let cleanedName = spoken
            .replace(/^criar lista (de |da )?/i, '')
            .replace(/^lista (de |da )?/i, '')
            .replace(/^nova lista (de |da )?/i, '');
          cleanedName = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);

          onCreateList(cleanedName);
          if (soundEnabled) playAddSound();
          setIsCreating(false);
        }
      };

      recognition.onerror = () => {
        setIsListeningForListName(false);
      };

      recognition.onend = () => {
        setIsListeningForListName(false);
      };

      recognition.start();
    } catch {
      setIsListeningForListName(false);
    }
  };

  const listTitleFontSize = {
    normal: 'text-sm sm:text-base font-bold',
    large: 'text-base sm:text-lg font-extrabold',
    extra: 'text-lg sm:text-xl font-black',
  }[fontSize];

  return (
    <nav
      id="list-selector-nav"
      aria-label="Minhas Listas de Compras"
      className="space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className={`text-xs sm:text-sm font-black tracking-wider uppercase flex items-center gap-1.5 ${
          highContrast || (contrastTheme && contrastTheme !== 'padrao')
            ? activeTheme.titleColor
            : 'text-slate-600 dark:text-slate-400'
        }`}>
          <List className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Suas Listas de Compras</span>
        </h2>

        {!isCreating && (
          <button
            id="create-new-list-button"
            type="button"
            onClick={() => setIsCreating(true)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${
              highContrast || (contrastTheme && contrastTheme !== 'padrao')
                ? `${activeTheme.bgButtonPrimary} ${activeTheme.textButtonPrimary}`
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Lista</span>
          </button>
        )}
      </div>

      {/* Inline Create List Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center gap-2 ${
            highContrast
              ? 'bg-black border-white'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
          }`}
        >
          <input
            id="new-list-name-input"
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Nome da nova lista (Ex: Feira de Domingo, Farmácia...)"
            autoFocus
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 text-sm sm:text-base font-semibold focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button
              id="voice-create-list-button"
              type="button"
              onClick={handleVoiceCreateList}
              disabled={isListeningForListName}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all ${
                isListeningForListName
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Falar o nome da nova lista"
            >
              <Mic className="w-4 h-4" />
              <span>{isListeningForListName ? 'Ouvindo...' : 'Falar'}</span>
            </button>

            <button
              id="save-new-list-button"
              type="submit"
              disabled={!newListName.trim()}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
              <span>Salvar</span>
            </button>

            <button
              id="cancel-create-list-button"
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Cancelar criação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Horizontal Scrollable Tabs / Cards for Lists */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {lists.map((list) => {
          const isActive = list.id === activeListId;
          const pendingItems = list.items.filter(i => !i.isBought).length;

          return (
            <div
              key={list.id}
              className={`group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap active:scale-98 ${
                isActive
                  ? `${activeTheme.bgButtonPrimary} ${activeTheme.textButtonPrimary} border-transparent shadow-md font-extrabold ring-2 ring-current`
                  : `${activeTheme.bgCard} ${activeTheme.borderCard} ${activeTheme.textPrimary} hover:opacity-90`
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <span className="text-base sm:text-lg">{list.icon || '🛒'}</span>
              <span className={listTitleFontSize}>{list.name}</span>

              {/* Pending count badge */}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 ${
                  isActive
                    ? 'bg-emerald-800 text-emerald-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {pendingItems > 0 ? `${pendingItems} restantes` : 'Concluída'}
              </span>

              {/* Delete list button (if more than 1 list exists) */}
              {lists.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Tem certeza que deseja excluir a lista "${list.name}"?`)) {
                      onDeleteList(list.id);
                    }
                  }}
                  className={`p-1 rounded-md opacity-70 hover:opacity-100 hover:text-rose-500 transition-opacity ${
                    isActive ? 'text-emerald-100 hover:text-white' : 'text-slate-400'
                  }`}
                  title={`Excluir lista ${list.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
