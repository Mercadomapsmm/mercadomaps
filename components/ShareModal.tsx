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
  QrCode,
  CheckCircle2,
  Wifi,
} from 'lucide-react';
import {
  encodeListsForUrl,
  formatAllListsWhatsAppMessage,
  formatAllListsEmailMessage,
} from '@/lib/sharing';
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
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [whatsappConnectionRequested, setWhatsappConnectionRequested] = useState(false);
  const [showConnectInstructions, setShowConnectInstructions] = useState(false);

  // Gera o link de sincronização contendo TODAS as listas criadas
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !lists || lists.length === 0) return '';
    const encoded = encodeListsForUrl(lists, userName);
    return `${window.location.origin}${window.location.pathname}?shared_data=${encoded}`;
  }, [lists, userName]);

  if (!isOpen) return null;

  const totalListsCount = lists.length;
  let totalItemsCount = 0;
  let totalPendingCount = 0;
  lists.forEach((l) => {
    l.items.forEach((item) => {
      totalItemsCount++;
      if (!item.isBought) totalPendingCount++;
    });
  });

  // Compartilhamento direto no WhatsApp de TODAS as listas
  const handleShareWhatsApp = () => {
    const text = formatAllListsWhatsAppMessage(lists, shareUrl, userName);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (soundEnabled) playAddSound();
    setWhatsappConnectionRequested(true);
    window.open(whatsappUrl, '_blank');
  };

  // Solicitar conexão com o WhatsApp Web (caso não esteja conectado)
  const handleConnectWhatsApp = () => {
    if (soundEnabled) playAddSound();
    setShowConnectInstructions(true);
    window.open('https://web.whatsapp.com', '_blank');
  };

  // Enviar por E-mail contendo TODAS as listas do app para o e-mail informado
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const email = recipientEmail.trim();

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

    const { subject, body } = formatAllListsEmailMessage(lists, shareUrl, userName);
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
        className={`w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl border transition-all max-h-[92vh] overflow-y-auto ${
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
                <span>Compartilhar Todas as Listas</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalListsCount} {totalListsCount === 1 ? 'lista' : 'listas'} criadas ({totalPendingCount} itens a comprar de {totalItemsCount})
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

        {/* Informação sobre manter listas existentes no destino */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>Preservação garantida:</strong> Ao receber o compartilhamento, todas as listas já existentes no destino serão mantidas intactas.
          </span>
        </div>

        {/* Share Options: WhatsApp & E-mail */}
        <div className="mt-4 space-y-4">
          {/* 1. SEÇÃO WHATSAPP COM SOLICITAÇÃO DE CONEXÃO */}
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
                  Envia todas as {totalListsCount} listas completas formatadas com link direto para sincronização.
                </p>
              </div>
            </div>

            {/* Aviso e Verificação de Conexão com o WhatsApp */}
            <div className="my-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Wifi className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Conexão com o WhatsApp necessária</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Se o WhatsApp não estiver conectado neste navegador ou aplicativo, conecte seu aparelho através do WhatsApp Web para enviar a mensagem.
              </p>
              <button
                type="button"
                onClick={handleConnectWhatsApp}
                className="self-start inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-900 cursor-pointer"
              >
                <QrCode className="w-3 h-3" />
                <span>Solicitar conexão / Conectar WhatsApp Web (QR Code)</span>
              </button>
            </div>

            {/* Instruções de conexão se solicitadas ou exibidas */}
            {(showConnectInstructions || whatsappConnectionRequested) && (
              <div className="mb-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs text-slate-700 dark:text-slate-300 space-y-1 animate-in fade-in">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Como conectar seu WhatsApp:</span>
                </p>
                <ol className="list-decimal list-inside text-[11px] space-y-0.5 text-slate-600 dark:text-slate-400">
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Acesse <strong>Configurações / Opções</strong> &gt; <strong>Aparelhos Conectados</strong></li>
                  <li>Toque em <strong>Conectar um aparelho</strong> e aponte a câmera para a tela</li>
                </ol>
              </div>
            )}

            {/* Botão de envio principal */}
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <button
                id="share-whatsapp-direct-btn"
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir no WhatsApp e Enviar</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleConnectWhatsApp}
                className="px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Abrir WhatsApp Web para escanear QR Code"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Conectar WhatsApp</span>
              </button>
            </div>
          </div>

          {/* 2. SEÇÃO E-MAIL (E-mail informado, todas as listas) */}
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
                  Informe o e-mail de destino para enviar todas as {totalListsCount} listas completas.
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
            Todas as listas criadas serão enviadas com itens, quantidades, valores e o link para visualização e sincronização sem substituir as listas existentes no destino.
          </p>
        </div>
      </div>
    </div>
  );
};
