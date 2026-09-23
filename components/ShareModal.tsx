'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingList } from '@/types/shopping';
import {
  X,
  Share2,
  Mail,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { encodeListsForUrl, formatWhatsAppMessage, formatEmailMessage } from '@/lib/sharing';
import { playAddSound } from '@/lib/sound';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: ShoppingList[];
  activeList: ShoppingList;
  userName: string;
  highContrast: boolean;
  soundEnabled: boolean;
  onImportLists?: (newLists: ShoppingList[]) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lists,
  activeList,
  userName,
  highContrast,
  soundEnabled,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const encoded = encodeListsForUrl(lists, userName);
    return `${window.location.origin}${window.location.pathname}?shared_data=${encoded}`;
  }, [lists, userName]);

  if (!isOpen) return null;

  const totalItems = activeList.items.length;
  const pendingItems = activeList.items.filter((i) => !i.isBought).length;

  // Compartilhamento direto no WhatsApp
  const handleShareWhatsApp = () => {
    const text = formatWhatsAppMessage(activeList, shareUrl);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Copiar texto pronto para o WhatsApp
  const handleCopyWhatsAppText = () => {
    const text = formatWhatsAppMessage(activeList, shareUrl);
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    if (soundEnabled) playAddSound();
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  // Enviar por E-mail (mailto)
  const handleSendEmail = () => {
    const { subject, body } = formatEmailMessage(activeList, shareUrl);
    const targetEmail = recipientEmail.trim();
    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Copiar texto formatado para E-mail
  const handleCopyEmailText = () => {
    const { body } = formatEmailMessage(activeList, shareUrl);
    navigator.clipboard.writeText(body);
    setCopiedEmail(true);
    if (soundEnabled) playAddSound();
    setTimeout(() => setCopiedEmail(false), 3000);
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
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Compartilhar Lista
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lista &ldquo;{activeList.name}&rdquo; ({pendingItems} itens a comprar de {totalItems})
              </p>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exclusive Share Options: WhatsApp & E-mail */}
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
              <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-emerald-900 dark:text-emerald-300">
                  Compartilhar no WhatsApp
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Envie a lista formatada com um toque para qualquer contato ou grupo.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                id="share-whatsapp-direct-btn"
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                <span>Abrir WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                id="copy-whatsapp-text-btn"
                type="button"
                onClick={handleCopyWhatsAppText}
                className={`py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  copiedWhatsApp
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title="Copiar texto formatado para colar onde desejar no WhatsApp"
              >
                {copiedWhatsApp ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-600" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. SEÇÃO E-MAIL */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              highContrast
                ? 'border-yellow-400 bg-zinc-950 text-white'
                : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-blue-950 dark:text-blue-300">
                  Compartilhar por E-mail
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Envie a lista detalhada para seu próprio e-mail ou familiares.
                </p>
              </div>
            </div>

            {/* Email input (optional) */}
            <div className="mt-3 space-y-2">
              <div>
                <label
                  htmlFor="recipient-email-input"
                  className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1"
                >
                  E-mail do destinatário (opcional):
                </label>
                <input
                  id="recipient-email-input"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="exemplo@gmail.com (ou deixe em branco)"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  id="share-email-direct-btn"
                  type="button"
                  onClick={handleSendEmail}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar E-mail</span>
                </button>

                <button
                  id="copy-email-text-btn"
                  type="button"
                  onClick={handleCopyEmailText}
                  className={`py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    copiedEmail
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                  title="Copiar texto formatado do e-mail"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-600" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Explanatory note */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            A lista compartilhada inclui os itens a comprar, quantidades, valores e link para sincronização.
          </p>
        </div>
      </div>
    </div>
  );
};
