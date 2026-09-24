'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingList } from '@/types/shopping';
import { Sparkles, X } from 'lucide-react';

export interface AutoInstalledNoticeData {
  lists: ShoppingList[];
  sharedByName: string;
  totalItems: number;
}

interface AutoInstalledToastProps {
  data: AutoInstalledNoticeData | null;
  onClose: () => void;
  highContrast: boolean;
}

export const AutoInstalledToast: React.FC<AutoInstalledToastProps> = ({
  data,
  onClose,
  highContrast,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 350);
    }, 9000);
    return () => clearTimeout(timer);
  }, [data, onClose]);

  if (!data) return null;

  const totalLists = data.lists.length;

  return (
    <aside
      aria-label="Notificação de listas instaladas automaticamente"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-xl transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`rounded-2xl p-4 sm:p-5 shadow-2xl border flex flex-col gap-3 ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : 'bg-emerald-800 text-white border-emerald-600 shadow-emerald-950/40'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-emerald-100">
                  ⚡ Instalação Automática
                </span>
                <span className="text-[11px] font-medium text-emerald-200">
                  Pronto para usar!
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                {totalLists === 1 ? '1 Lista Instalada!' : `${totalLists} Listas Instaladas Automaticamente!`}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar aviso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-emerald-100 leading-snug">
          {data.sharedByName && data.sharedByName !== 'Usuário' ? (
            <strong>{data.sharedByName}</strong>
          ) : (
            'O remetente'
          )}{' '}
          compartilhou as listas. Todas foram <strong>salvas diretamente no seu aparelho</strong> e suas listas anteriores continuam 100% preservadas.
        </p>

        {/* Chips das listas instaladas */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {data.lists.map((l) => (
            <span
              key={l.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-xs text-xs font-bold text-white border border-white/20"
            >
              <span>{l.icon || '🛒'}</span>
              <span className="truncate max-w-[140px]">{l.name}</span>
              <span className="text-[10px] text-emerald-200">({(l.items || []).length})</span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
