'use client';

import React, { useMemo } from 'react';
import { ShoppingList } from '@/types/shopping';
import { X, MessageCircle, ExternalLink, ShoppingCart } from 'lucide-react';
import { encodeListsForUrl, formatAllListsWhatsAppMessage } from '@/lib/sharing';
import { playAddSound } from '@/lib/sound';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: ShoppingList[];
  activeList?: ShoppingList;
  userName?: string;
  highContrast: boolean;
  soundEnabled: boolean;
  onImportLists?: (newLists: ShoppingList[]) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lists,
  userName = 'Usuário',
  highContrast,
  soundEnabled,
}) => {
  // Gera o link de sincronização contendo as listas criadas
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !lists || lists.length === 0) return '';
    const encoded = encodeListsForUrl(lists, userName);
    return `${window.location.origin}${window.location.pathname}?shared_data=${encoded}`;
  }, [lists, userName]);

  if (!isOpen) return null;

  // Compartilhamento no WhatsApp listando somente o ícone e a descrição do app
  const handleShareWhatsApp = () => {
    const text = formatAllListsWhatsAppMessage(lists, shareUrl, userName);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (soundEnabled) playAddSound();
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div
      id="share-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="share-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl border transition-all ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}
      >
        {/* Modal Header com o Ícone Padrão do Aplicativo */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Lista de Compras
              </h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                Compartilhar Aplicativo
              </p>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card exibindo somente o ícone e a descrição do app */}
        <div className="mt-5 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-2.5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Lista de Compras Doméstica
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            App acessível e prático de lista de compras doméstica com comando de voz, fontes legíveis e organização por categorias de supermercado.
          </p>
        </div>

        {/* Botão de compartilhamento direto no WhatsApp */}
        <div className="mt-5">
          <button
            id="share-whatsapp-direct-btn"
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Compartilhar no WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
