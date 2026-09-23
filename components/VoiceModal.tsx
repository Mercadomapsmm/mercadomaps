'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, AlertCircle, Plus } from 'lucide-react';
import { ParsedVoiceItem, parseSpokenShoppingText } from '@/lib/speech';
import { CATEGORIES, UNIT_OPTIONS } from '@/lib/categories';
import { CategoryId, UnitType } from '@/types/shopping';
import { playVoiceStartSound, playAddSound } from '@/lib/sound';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: ParsedVoiceItem[]) => void;
  fontSize: 'normal' | 'large' | 'extra';
  highContrast: boolean;
  soundEnabled: boolean;
}

// Define interface for browser SpeechRecognition
interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: { [key: number]: { [key: number]: { transcript: string } }; length: number } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onAddItems,
  fontSize,
  highContrast,
  soundEnabled,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedVoiceItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const recognitionRef = useRef<IWindowSpeechRecognition | null>(null);

  const startListening = React.useCallback(() => {
    setErrorMessage(null);
    setTranscript('');
    setInterimText('');
    setParsedItems([]);

    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition: new () => IWindowSpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: new () => IWindowSpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage('Reconhecimento de voz não suportado neste navegador. Use a caixa de texto abaixo.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        if (soundEnabled) playVoiceStartSound();
      };

      recognition.onresult = (event) => {
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res && res[0]) {
            const text = res[0].transcript;
            currentFinal += text;
          }
        }

        const fullText = currentFinal.trim();
        setTranscript(fullText);
        setInterimText('');

        // Parse in real-time with quantity, unit, price, and category
        if (fullText) {
          const items = parseSpokenShoppingText(fullText);
          setParsedItems(items);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Permissão de microfone negada. Verifique as configurações do navegador ou digite abaixo.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('Nenhuma fala foi detectada. Toque no microfone e tente falar novamente.');
        } else {
          setErrorMessage(`Aviso: ${event.error}. Você pode digitar a lista abaixo.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech:', err);
      setErrorMessage('Não foi possível iniciar o microfone. Use a caixa de texto manual.');
      setIsListening(false);
    }
  }, [soundEnabled]);

  const stopListening = React.useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListening(false);
    setTranscript('');
    setInterimText('');
    setParsedItems([]);
    setErrorMessage(null);
    setManualText('');
    onClose();
  }, [onClose]);

  // Stop or start recognition on modal open/close
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      return;
    }

    const timer = setTimeout(() => {
      startListening();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen, startListening]);

  // Handle manual input typing
  const handleManualTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualText(val);
    if (val.trim()) {
      const items = parseSpokenShoppingText(val);
      setParsedItems(items);
    } else {
      setParsedItems([]);
    }
  };

  const handleUpdateItemName = (idx: number, name: string) => {
    setParsedItems(prev => prev.map((item, i) => (i === idx ? { ...item, name } : item)));
  };

  const handleUpdateItemQuantity = (idx: number, quantity: number) => {
    setParsedItems(prev => prev.map((item, i) => (i === idx ? { ...item, quantity: Math.max(0.1, quantity) } : item)));
  };

  const handleUpdateItemUnit = (idx: number, unit: UnitType) => {
    setParsedItems(prev => prev.map((item, i) => (i === idx ? { ...item, unit } : item)));
  };

  const handleUpdateItemPrice = (idx: number, estimatedPrice?: number) => {
    setParsedItems(prev => prev.map((item, i) => (i === idx ? { ...item, estimatedPrice } : item)));
  };

  const handleUpdateItemCategory = (idx: number, category: CategoryId) => {
    setParsedItems(prev => prev.map((item, i) => (i === idx ? { ...item, category } : item)));
  };

  const handleAddNewItem = () => {
    setParsedItems(prev => [
      ...prev,
      {
        name: '',
        quantity: 1,
        unit: 'un',
        category: 'mercearia',
        estimatedPrice: undefined,
      },
    ]);
  };

  const handleConfirmAdd = () => {
    const validItems = parsedItems.filter(i => i.name.trim().length > 0);
    if (validItems.length === 0) return;
    onAddItems(validItems);
    if (soundEnabled) playAddSound();
    handleCloseModal();
  };

  const handleRemoveParsedItem = (index: number) => {
    setParsedItems(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const fontClasses = {
    normal: 'text-base',
    large: 'text-lg',
    extra: 'text-xl',
  }[fontSize];

  return (
    <div
      id="voice-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
      onClick={handleCloseModal}
    >
      <div
        id="voice-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl p-4 sm:p-6 shadow-2xl border transition-all max-h-[92vh] flex flex-col ${
          highContrast
            ? 'bg-black text-white border-white'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Adicionar por Voz
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Informe nome, quantidade, unidade, preço e categoria
              </p>
            </div>
          </div>
          <button
            id="close-voice-modal-button"
            type="button"
            onClick={handleCloseModal}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            aria-label="Fechar janela de voz"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 py-3 pr-0.5 space-y-4">
          {/* Center: Microphone Visual & Status */}
          <div className="py-2 sm:py-4 flex flex-col items-center text-center">
            <div className="relative mb-3">
              {/* Animated Pulse Ring */}
              {isListening && (
                <>
                  <span className="absolute -inset-3 rounded-full bg-emerald-400/30 dark:bg-emerald-500/30 animate-ping opacity-75" />
                  <span className="absolute -inset-6 rounded-full bg-emerald-300/20 dark:bg-emerald-500/20 animate-pulse" />
                </>
              )}

              <button
                id="toggle-mic-listening-btn"
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-300 dark:ring-rose-900 animate-bounce-subtle'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                }`}
                title={isListening ? 'Toque para parar de ouvir' : 'Toque para falar'}
                aria-label={isListening ? 'Gravando voz. Toque para parar.' : 'Toque para falar'}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-8 h-8 sm:w-10 sm:h-10 mb-0.5" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Parar</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 sm:w-10 sm:h-10 mb-0.5" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Falar</span>
                  </>
                )}
              </button>
            </div>

            <p className={`font-bold transition-all ${fontClasses} ${isListening ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {isListening ? 'Ouvindo você... pode falar!' : 'Toque no microfone para começar a falar'}
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1">
              Ex: <span className="italic font-semibold text-slate-800 dark:text-slate-200">&ldquo;2 quilos de alcatra 45 reais carnes e 3 caixas de leite 4 reais laticínios&rdquo;</span>
            </p>
          </div>

          {/* Live Spoken Text Box */}
          {(transcript || interimText) && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Você disse:
              </span>
              <p className={`font-medium text-slate-900 dark:text-white ${fontClasses}`}>
                {transcript} {interimText && <span className="opacity-50 italic">{interimText}</span>}
              </p>
            </div>
          )}

          {/* Error message / Warning */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Manual typing fallback */}
          <div>
            <label htmlFor="voice-manual-input" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ou digite sua frase com quantidade, unidade, preço e categoria:
            </label>
            <input
              id="voice-manual-input"
              type="text"
              value={manualText}
              onChange={handleManualTextChange}
              placeholder="Ex: 2 kg de alcatra 45 reais carnes, 1 sabão em pó 15 reais limpeza"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm sm:text-base`}
            />
          </div>

          {/* Identified / Configured items list with quantity, unit, price, and category */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Itens para adicionar ({parsedItems.length}):
              </span>
              <button
                type="button"
                onClick={handleAddNewItem}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar mais um
              </button>
            </div>

            {parsedItems.length === 0 ? (
              <div className="p-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-400">
                Nenhum produto identificado ainda. Fale ou digite acima para gerar os itens.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto p-1">
                {parsedItems.map((item, idx) => {
                  return (
                    <div
                      key={`parsed-item-${idx}`}
                      className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
                    >
                      {/* Item Name & Remove Button */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                            placeholder="Nome do produto"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveParsedItem(idx)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                          title="Remover este item"
                          aria-label="Remover item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Detail Fields: Quantidade, Unidade, Preço, Categoria */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {/* Quantidade */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            step={item.unit === 'kg' || item.unit === 'L' ? '0.1' : '1'}
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemQuantity(idx, parseFloat(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Unidade de Medida */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Unidade
                          </label>
                          <select
                            value={item.unit}
                            onChange={(e) => handleUpdateItemUnit(idx, e.target.value as UnitType)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                          >
                            {UNIT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label} ({opt.fullLabel})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Preço (R$) */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Preço (R$)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              value={item.estimatedPrice !== undefined && item.estimatedPrice > 0 ? item.estimatedPrice : ''}
                              onChange={(e) =>
                                handleUpdateItemPrice(
                                  idx,
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Categoria */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Categoria
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) => handleUpdateItemCategory(idx, e.target.value as CategoryId)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                          >
                            {Object.entries(CATEGORIES).map(([catId, catInfo]) => (
                              <option key={catId} value={catId}>
                                {catInfo.icon} {catInfo.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            id="cancel-voice-button"
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            id="confirm-voice-items-button"
            type="button"
            onClick={handleConfirmAdd}
            disabled={parsedItems.filter(i => i.name.trim().length > 0).length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-sm sm:text-base"
          >
            <Check className="w-5 h-5" />
            Adicionar à Lista ({parsedItems.filter(i => i.name.trim().length > 0).length})
          </button>
        </div>
      </div>
    </div>
  );
};

