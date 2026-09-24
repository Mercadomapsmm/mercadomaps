'use client';

import React, { useMemo, useState } from 'react';
import { ShoppingList } from '@/types/shopping';
import { X, MessageCircle, ExternalLink, ShoppingCart, Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  // Gera o link de sincronização contendo as listas criadas
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !lists || lists.length === 0) return '';
    const encoded = encodeListsForUrl(lists, userName);
    let origin = window.location.origin;
    // Se estiver rodando no preview de desenvolvimento (ais-dev-), converte para a URL pública (ais-pre-)
    if (origin.includes('ais-dev-')) {
      origin = origin.replace('ais-dev-', 'ais-pre-');
    }
    return `${origin}${window.location.pathname}?shared_data=${encoded}`;
  }, [lists, userName]);

  const textToShare = useMemo(() => {
    return formatAllListsWhatsAppMessage(lists, shareUrl, userName);
  }, [lists, shareUrl, userName]);

  const whatsappUrl = useMemo(() => {
    if (!shareUrl) return '#';
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
  }, [textToShare, shareUrl]);

  if (!isOpen) return null;

  // Compartilhamento robusto com suporte a Web Share (mobile) e WhatsApp direto
  const handleShareClick = async (e: React.MouseEvent) => {
    if (soundEnabled) playAddSound();

    // Copia para área de transferência como garantia
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToShare).catch(() => {});
    }

    // Se o dispositivo tiver suporte nativo a compartilhamento (celulares Android/iOS)
    if (typeof navigator !== 'undefined' && navigator.share) {
      e.preventDefault();
      try {
        await navigator.share({
          title: 'Lista de Compras',
          text: textToShare,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        return;
      } catch (err: any) {
        // Se o usuário apenas cancelou, ignora. Se falhou, continua para abrir WhatsApp
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: abre o link do WhatsApp
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyOnly = async () => {
    if (soundEnabled) playAddSound();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // Fallback manual
      }
    }
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

        {/* Notificação de link copiado se acionado */}
        {copied && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Link copiado e pronto para compartilhar!</span>
          </div>
        )}

        {/* Botão de compartilhamento direto no WhatsApp */}
        <div className="mt-4 space-y-2">
          <a
            id="share-whatsapp-direct-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShareClick}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-center"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Compartilhar no WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            id="copy-share-link-fallback-btn"
            type="button"
            onClick={handleCopyOnly}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar link de compartilhamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
