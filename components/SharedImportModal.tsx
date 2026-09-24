'use client';

import React from 'react';
import { ShoppingList } from '@/types/shopping';
import { ShoppingCart, CheckCircle2, ShieldCheck, X, RefreshCw } from 'lucide-react';

interface SharedImportModalProps {
  isOpen: boolean;
  sharedData: {
    lists: ShoppingList[];
    sharedByName: string;
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
  highContrast: boolean;
}

export const SharedImportModal: React.FC<SharedImportModalProps> = ({
  isOpen,
  sharedData,
  onConfirm,
  onCancel,
  highContrast,
}) => {
  if (!isOpen || !sharedData) return null;

  const totalLists = sharedData.lists.length;
  const totalItems = sharedData.lists.reduce((acc, l) => acc + (l.items || []).length, 0);

  return (
    <div
      id="shared-import-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onCancel}
    >
      <div
        id="shared-import-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all max-h-[92vh] overflow-y-auto animate-in zoom-in-95 ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shared-import-title"
      >
        {/* Header do Popup */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
                Atualização Recebida
              </span>
              <h2
                id="shared-import-title"
                className="text-lg sm:text-xl font-black tracking-tight"
              >
                Você recebeu uma atualização!
              </h2>
            </div>
          </div>

          <button
            id="close-shared-import-modal-btn"
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar e ignorar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem e Conteúdo Recebido */}
        <div className="mt-5 space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {sharedData.sharedByName && sharedData.sharedByName !== 'Usuário' ? (
              <strong>{sharedData.sharedByName}</strong>
            ) : (
              'Um usuário'
            )}{' '}
            compartilhou o aplicativo com você contendo <strong>{totalLists} {totalLists === 1 ? 'lista de compras' : 'listas de compras'}</strong> e <strong>{totalItems} {totalItems === 1 ? 'item' : 'itens'}</strong> no total.
          </p>

          {/* Pergunta de Confirmação em Destaque */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <span>Deseja continuar e atualizar o seu aplicativo com estas listas?</span>
          </div>

          {/* Pré-visualização das Listas Recebidas */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Listas prontas para adicionar/atualizar:
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {sharedData.lists.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between text-xs sm:text-sm p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <div className="flex items-center gap-2 font-bold truncate">
                    <span>{l.icon || '🛒'}</span>
                    <span className="truncate">{l.name}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 shrink-0">
                    {(l.items || []).length} {(l.items || []).length === 1 ? 'item' : 'itens'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Garantia de Segurança das Listas Existentes */}
          <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="block font-bold text-slate-900 dark:text-white">Suas listas atuais estão seguras!</strong>
              Nenhuma das suas listas já existentes neste aparelho será apagada. As novas listas e novos itens serão integrados harmoniosamente.
            </div>
          </div>
        </div>

        {/* Botões de Ação do Popup */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            id="confirm-update-shared-device-btn"
            type="button"
            onClick={onConfirm}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Sim, Continuar e Atualizar</span>
          </button>

          <button
            id="cancel-update-shared-device-btn"
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Manter Como Está</span>
          </button>
        </div>
      </div>
    </div>
  );
};
