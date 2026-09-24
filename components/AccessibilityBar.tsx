'use client';

import React from 'react';
import { AccessibilitySettings } from '@/types/shopping';
import { Volume2, VolumeX, Volume } from 'lucide-react';
import { CONTRAST_THEMES } from '@/lib/contrastThemes';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  onReadList: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  remainingCount: number;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  onUpdateSettings,
  onReadList,
  isSpeaking,
  onStopSpeaking,
  remainingCount,
}) => {
  const currentThemeId = settings.contrastTheme || (settings.highContrast ? 'amarelo-preto' : 'padrao');
  const activeTheme = CONTRAST_THEMES[currentThemeId] || CONTRAST_THEMES.padrao;

  return (
    <aside
      id="accessibility-bar"
      aria-label="Ajustes de Acessibilidade e Visualização"
      className={`w-full transition-colors border-none ${activeTheme.bgAccessibility}`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-sm">
        {/* Paleta de Cores: apenas as 2 cores padrão mais utilizadas com botão para alternar entre elas */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="toggle-theme-palette-btn"
            type="button"
            onClick={() => {
              const nextTheme = currentThemeId === 'padrao' ? 'amarelo-preto' : 'padrao';
              onUpdateSettings({
                contrastTheme: nextTheme,
                highContrast: nextTheme !== 'padrao',
              });
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-current/25 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all cursor-pointer select-none active:scale-95 text-xs sm:text-sm font-bold"
            title={`Alternar Cor: ${
              currentThemeId === 'padrao'
                ? 'Claro Padrão (Clique para Amarelo & Preto)'
                : 'Amarelo & Preto (Clique para Claro Padrão)'
            }`}
            aria-label="Alternar entre as duas cores padrão mais utilizadas"
          >
            <span>
              {currentThemeId === 'padrao' ? 'Claro' : 'Amarelo & Preto'}
            </span>

            {/* Indicadores visuais das duas cores padrão */}
            <div className="flex items-center gap-1.5 ml-1 p-1 rounded-full bg-black/10 dark:bg-white/10">
              {/* Cor 1: Claro Padrão */}
              <span
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  currentThemeId === 'padrao'
                    ? 'ring-2 ring-emerald-500 ring-offset-1 scale-110'
                    : 'opacity-40'
                }`}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#94A3B8' }}
                title="Claro Padrão"
              />
              {/* Cor 2: Amarelo & Preto */}
              <span
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  currentThemeId === 'amarelo-preto'
                    ? 'ring-2 ring-emerald-500 ring-offset-1 scale-110'
                    : 'opacity-40'
                }`}
                style={{ backgroundColor: '#FACC15', borderColor: '#000000' }}
                title="Amarelo & Preto"
              />
            </div>
          </button>
        </div>

        {/* Som & Leitura da Lista */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Sound Toggle */}
          <button
            id="toggle-sound-feedback"
            type="button"
            onClick={() => onUpdateSettings({ soundFeedback: !settings.soundFeedback })}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              settings.soundFeedback
                ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border-emerald-500'
                : 'bg-black/10 dark:bg-white/10 border-current/30 opacity-70'
            }`}
            title={settings.soundFeedback ? 'Sons ativados' : 'Sons desativados'}
          >
            {settings.soundFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Sons</span>
          </button>

          {/* Read List Aloud */}
          {isSpeaking ? (
            <button
              id="stop-reading-button"
              type="button"
              onClick={onStopSpeaking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs sm:text-sm animate-pulse hover:bg-rose-700 cursor-pointer"
              title="Parar leitura em voz alta"
            >
              <VolumeX className="w-4 h-4" />
              Parar Leitura
            </button>
          ) : (
            <button
              id="read-list-button"
              type="button"
              onClick={onReadList}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer"
              title="Ouvir lista de compras em voz alta"
            >
              <Volume className="w-4 h-4" />
              <span>Ouvir Lista</span>
              {remainingCount > 0 && (
                <span className="bg-emerald-900 text-white text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                  {remainingCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
