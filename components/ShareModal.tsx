'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingList } from '@/types/shopping';
import {
  X,
  Share2,
  Mail,
  ExternalLink,
  MessageCircle,
  Send,
  AlertCircle,
} from 'lucide-react';
import { encodeListsForUrl, formatWhatsAppMessage, formatEmailMessage } from '@/lib/sharing';
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
  activeList,
  userName = 'Usuário',
  highContrast,
  soundEnabled,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Lista atual selecionada para compartilhamento
  const targetList = activeList || lists[0];

  // Gera o link de sincronização da lista atual
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !targetList) return '';
    const encoded = encodeListsForUrl([targetList], userName);
    return `${window.location.origin}${window.location.pathname}?shared_data=${encoded}`;
  }, [targetList, userName]);

  if (!isOpen || !targetList) return null;

  const totalItems = targetList.items.length;
  const pendingItems = targetList.items.filter((i) => !i.isBought).length;

  // Compartilhamento direto no WhatsApp (da lista atual, sem copiar mensagem)
  const handleShareWhatsApp = () => {
    const text = formatWhatsAppMessage(targetList, shareUrl);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (soundEnabled) playAddSound();
    window.open(whatsappUrl, '_blank');
  };

  // Enviar por E-mail (da lista atual para o e-mail informado, sem copiar texto)
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const email = recipientEmail.trim();

    // Validação do e-mail a ser informado
    if (!email) {
      setEmailError('Por favor, informe o e-mail de destino.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, insira um formato de e-mail válido.');
      return;
    }

    setEmailError(null);
    if (soundEnabled) playAddSound();

    const { subject, body } = formatEmailMessage(targetList, shareUrl);
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
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
        className={`w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl border transition-all max-h-[92vh] overflow-y-auto ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-1.5">
                <span>{targetList.icon || '🛒'}</span>
                <span>{targetList.name}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compartilhando a lista atual ({pendingItems} itens a comprar de {totalItems})
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

        {/* Exclusive Share Options: WhatsApp & E-mail (Sem botões de copiar) */}
        <div className="mt-5 space-y-4">
          {/* 1. SEÇÃO WHATSAPP */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              highContrast
                ? 'border-yellow-400 bg-zinc-950 text-white'
                : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-emerald-900 dark:text-emerald-300">
                  Compartilhar no WhatsApp
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Envia a lista &ldquo;{targetList.name}&rdquo; diretamente pelo WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-3">
              <button
                id="share-whatsapp-direct-btn"
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir no WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. SEÇÃO E-MAIL (E-mail a ser informado) */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              highContrast
                ? 'border-yellow-400 bg-zinc-950 text-white'
                : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-blue-950 dark:text-blue-300">
                  Compartilhar por E-mail
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Informe o e-mail de destino para enviar a lista &ldquo;{targetList.name}&rdquo;.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendEmail} className="mt-3 space-y-2">
              <div>
                <label
                  htmlFor="recipient-email-input"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
                >
                  E-mail do destinatário: <span className="text-rose-500">*</span>
                </label>
                <input
                  id="recipient-email-input"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="exemplo@email.com"
                  required
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    emailError
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div className="pt-1">
                <button
                  id="share-email-direct-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar por E-mail</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Rodapé explicativo */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            A lista compartilhada contém os itens, quantidades, valores e o link para visualização e sincronização no aplicativo.
          </p>
        </div>
      </div>
    </div>
  );
};
