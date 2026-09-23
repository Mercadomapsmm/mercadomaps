'use client';

import React, { useState } from 'react';
import { User } from '@/types/auth';
import {
  loginUser,
  registerUser,
  loginWithGoogleAccount,
  hasUserCreatedAccount,
  getStoredAccounts,
} from '@/lib/auth';
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { playAddSound } from '@/lib/sound';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  soundEnabled: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  highContrast,
  onToggleHighContrast,
  soundEnabled,
}) => {
  // Inicializações preguiçosas para evitar hydration cascading renders
  const [hasCreatedAccount, setHasCreatedAccount] = useState<boolean>(() => {
    return hasUserCreatedAccount();
  });
  const [savedAccounts] = useState<Array<{ id: string; username: string; name: string }>>(() => {
    return getStoredAccounts();
  });
  const [tab, setTab] = useState<'login' | 'register'>(() => {
    const hasAccount = hasUserCreatedAccount();
    const accounts = getStoredAccounts();
    return (!hasAccount || accounts.length === 0) ? 'register' : 'login';
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState(() => {
    const accounts = getStoredAccounts();
    return accounts.length > 0 ? accounts[accounts.length - 1].username : '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const result = loginUser(loginUsername, loginPassword, rememberMe);
    setIsLoading(false);

    if (result.success && result.user) {
      if (soundEnabled) playAddSound();
      setSuccessMessage(`Bem-vindo, ${result.user.name}!`);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 300);
    } else {
      setErrorMessage(result.error || 'Não foi possível encontrar sua conta.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim();
    if (!fullName) {
      setErrorMessage('Digite seu nome e sobrenome.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('As senhas não coincidem. Tente novamente.');
      return;
    }

    setIsLoading(true);
    const result = registerUser(fullName, regUsername, regPassword);
    setIsLoading(false);

    if (result.success && result.user) {
      if (soundEnabled) playAddSound();
      setHasCreatedAccount(true);
      setSuccessMessage('Conta criada com sucesso! O login será automático.');
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 400);
    } else {
      setErrorMessage(result.error || 'Erro ao criar conta.');
    }
  };

  // Login direto com Conta do Google (Padrão Google Sign-In)
  const handleGoogleSignIn = () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const user = loginWithGoogleAccount('mercadomapsmm@gmail.com', 'Mercado Maps');
      setIsLoading(false);
      if (soundEnabled) playAddSound();
      setSuccessMessage('Conectado com a Conta do Google!');
      setTimeout(() => {
        onLoginSuccess(user);
      }, 300);
    } catch {
      setIsLoading(false);
      setErrorMessage('Falha ao conectar com o Google. Tente novamente.');
    }
  };

  // Preenchimento de teste rápido
  const handleQuickDemo = () => {
    setRegFirstName('Família');
    setRegLastName('Silva');
    setRegUsername('usuario');
    setRegPassword('123456');
    setRegConfirmPassword('123456');
    const result = registerUser('Família Silva', 'usuario', '123456');
    if (result.success && result.user) {
      if (soundEnabled) playAddSound();
      onLoginSuccess(result.user);
    } else {
      const log = loginUser('usuario', '123456', true);
      if (log.success && log.user) {
        if (soundEnabled) playAddSound();
        onLoginSuccess(log.user);
      }
    }
  };

  return (
    <div
      id="google-auth-container"
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors font-sans ${
        highContrast
          ? 'bg-black text-white'
          : 'bg-[#f0f4f9] dark:bg-[#131314] text-[#1f1f1f] dark:text-[#e3e3e3]'
      }`}
    >
      {/* Top Accessibility Contrast Toggle */}
      <div className="w-full max-w-[450px] flex justify-end mb-3">
        <button
          id="auth-toggle-contrast-btn"
          type="button"
          onClick={onToggleHighContrast}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
            highContrast
              ? 'bg-yellow-400 text-black border-yellow-300 font-extrabold ring-2 ring-yellow-400'
              : 'bg-white dark:bg-[#1e1f20] text-[#444746] dark:text-[#c4c7c5] border-[#dadce0] dark:border-[#444746] hover:bg-slate-50'
          }`}
        >
          {highContrast ? '✓ Alto Contraste Ativado' : 'Alternar Alto Contraste'}
        </button>
      </div>

      {/* Main Google Material Card */}
      <div
        id="google-auth-card"
        className={`w-full max-w-[450px] rounded-[28px] p-8 sm:p-10 transition-all ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-white shadow-none'
            : 'bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#444746] shadow-sm'
        }`}
      >
        {/* Google 4-Color Logo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              id="google-logo-svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              aria-label="Google"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Lista de Compras
            </span>
          </div>
        </div>

        {/* Title & Subtitle in Google Typography */}
        <div className="mb-6">
          <h1
            id="google-auth-heading"
            className="text-2xl sm:text-[26px] font-normal tracking-tight text-[#1f1f1f] dark:text-[#e3e3e3]"
          >
            {tab === 'login' ? 'Fazer login' : 'Criar uma Conta'}
          </h1>
          <p className="text-sm sm:text-base text-[#444746] dark:text-[#c4c7c5] mt-1 font-normal">
            {!hasCreatedAccount && tab === 'register'
              ? 'Crie seu usuário e senha para continuar. O login será automático.'
              : 'para continuar no app Lista de Compras'}
          </p>
        </div>

        {/* Botão Oficial: Fazer Login com o Google */}
        <div className="mb-5">
          <button
            id="btn-google-official-signin"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-full border flex items-center justify-center gap-3 text-sm font-medium transition-all active:scale-[0.99] ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-400 hover:bg-zinc-800'
                : 'bg-white dark:bg-[#1e1f20] border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-[#f8fafd] dark:hover:bg-[#2b2c2e]'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Fazer login com o Google</span>
          </button>
        </div>

        {/* Divisor "ou" no padrão Google */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#dadce0] dark:bg-[#444746]" />
          <span className="text-xs text-[#747775] dark:text-[#8e918f] font-medium uppercase tracking-wider">
            ou com usuário e senha
          </span>
          <div className="flex-1 h-px bg-[#dadce0] dark:bg-[#444746]" />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            id="google-auth-error-alert"
            className="mb-5 p-3 rounded-lg bg-[#fce8e6] dark:bg-[#371b19] border border-[#f5c2c7] dark:border-[#5c2420] text-[#c5221f] dark:text-[#f28b82] text-xs sm:text-sm font-medium flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div
            id="google-auth-success-alert"
            className="mb-5 p-3 rounded-lg bg-[#e6f4ea] dark:bg-[#132c1c] border border-[#a8dab5] dark:border-[#1d4d29] text-[#137333] dark:text-[#81c995] text-xs sm:text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. LOGIN FORM - GOOGLE STANDARD */}
        {tab === 'login' && (
          <form id="google-login-form" onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Campo E-mail ou Smartphone / Usuário */}
            <div>
              <div className="relative">
                <input
                  id="google-login-identifier"
                  name="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="E-mail ou nome de usuário"
                  className={`w-full px-3.5 py-3.5 rounded-lg border text-base font-normal transition-all outline-none ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-white focus:ring-2 focus:ring-yellow-400'
                      : 'bg-transparent border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] focus:border-2 focus:border-[#0b57d0] dark:focus:border-[#a8c7fa]'
                  }`}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="relative">
                <input
                  id="google-login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className={`w-full px-3.5 py-3.5 rounded-lg border text-base font-normal transition-all outline-none ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-white focus:ring-2 focus:ring-yellow-400'
                      : 'bg-transparent border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] focus:border-2 focus:border-[#0b57d0] dark:focus:border-[#a8c7fa]'
                  }`}
                />
              </div>
            </div>

            {/* Checkbox "Mostrar senha" - Padrão do Google */}
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="google-show-password-login"
                className="flex items-center gap-2.5 text-sm text-[#1f1f1f] dark:text-[#c4c7c5] cursor-pointer select-none"
              >
                <input
                  id="google-show-password-login"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0b57d0] border-[#747775] focus:ring-[#0b57d0]"
                />
                <span>Mostrar senha</span>
              </label>

              {/* Manter conectado / auto-login */}
              <label
                htmlFor="google-remember-login"
                className="flex items-center gap-2 text-xs text-[#444746] dark:text-[#a8c7fa] cursor-pointer select-none"
              >
                <input
                  id="google-remember-login"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0b57d0] border-[#747775] focus:ring-[#0b57d0]"
                />
                <span>Manter conectado</span>
              </label>
            </div>

            {/* Bottom Actions Bar - Google Standard */}
            <div className="flex items-center justify-between pt-6 mt-4">
              <button
                id="google-switch-to-create-btn"
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMessage(null);
                }}
                className={`font-medium text-sm px-3 py-2 rounded-full transition-colors ${
                  highContrast
                    ? 'text-yellow-400 hover:bg-zinc-800'
                    : 'text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-[#0b57d0]/10'
                }`}
              >
                Criar conta
              </button>

              <button
                id="google-submit-login-btn"
                type="submit"
                disabled={isLoading}
                className={`font-medium text-sm px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-none ${
                  highContrast
                    ? 'bg-yellow-400 text-black font-extrabold hover:bg-yellow-300'
                    : 'bg-[#0b57d0] hover:bg-[#0842a0] dark:bg-[#a8c7fa] dark:hover:bg-[#8ab4f8] text-white dark:text-[#062e6f]'
                }`}
              >
                {isLoading ? 'Acessando...' : 'Avançar'}
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER FORM - GOOGLE STANDARD */}
        {tab === 'register' && (
          <form id="google-register-form" onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Nome e Sobrenome (padrão Google Criar Conta) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  id="google-register-firstname"
                  name="firstName"
                  type="text"
                  required
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="Nome"
                  className={`w-full px-3.5 py-3.5 rounded-lg border text-base font-normal transition-all outline-none ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-white focus:ring-2 focus:ring-yellow-400'
                      : 'bg-transparent border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] focus:border-2 focus:border-[#0b57d0] dark:focus:border-[#a8c7fa]'
                  }`}
                />
              </div>
              <div>
                <input
                  id="google-register-lastname"
                  name="lastName"
                  type="text"
                  required
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="Sobrenome"
                  className={`w-full px-3.5 py-3.5 rounded-lg border text-base font-normal transition-all outline-none ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-white focus:ring-2 focus:ring-yellow-400'
                      : 'bg-transparent border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] focus:border-2 focus:border-[#0b57d0] dark:focus:border-[#a8c7fa]'
                  }`}
                />
              </div>
            </div>

            {/* Nome de Usuário */}
            <div>
              <div className="relative">
                <input
                  id="google-register-username"
                  name="username"
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Nome de usuário"
                  className={`w-full px-3.5 py-3.5 rounded-lg border text-base font-normal transition-all outline-none ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-white focus:ring-2 focus:ring-yellow-400'
                      : 'bg-transparent border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] focus:border-2 focus:border-[#0b57d0] dark:focus:border-[#a8c7fa]'
                  }`}
                />
              </div>
              <p className="text-xs text-[#747775] dark:text-[#8e918f] mt-1 ml-1 font-normal">
                Você pode usar letras e números
              </p>
            </div>

            {/* Senha e Confirmação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  id="google-register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Senha"
                  className={`w-full px-3.5 py-3.5 rounded-lg border text-base font-normal transition-all outline-none ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-white focus:ring-2 focus:ring-yellow-400'
                      : 'bg-transparent border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] focus:border-2 focus:border-[#0b57d0] dark:focus:border-[#a8c7fa]'
                  }`}
                />
              </div>
              <div>
                <input
                  id="google-register-confirm"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirmar"
                  className={`w-full px-3.5 py-3.5 rounded-lg border text-base font-normal transition-all outline-none ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-white focus:ring-2 focus:ring-yellow-400'
                      : 'bg-transparent border-[#747775] dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] focus:border-2 focus:border-[#0b57d0] dark:focus:border-[#a8c7fa]'
                  }`}
                />
              </div>
            </div>

            {/* Checkbox "Mostrar senha" */}
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="google-show-password-reg"
                className="flex items-center gap-2.5 text-sm text-[#1f1f1f] dark:text-[#c4c7c5] cursor-pointer select-none"
              >
                <input
                  id="google-show-password-reg"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0b57d0] border-[#747775] focus:ring-[#0b57d0]"
                />
                <span>Mostrar senha</span>
              </label>
            </div>

            {/* Aviso de Login Automático */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-[#444746] dark:text-[#c4c7c5]">
              Ao criar a conta, o login será salvo automaticamente neste aparelho.
            </div>

            {/* Bottom Actions Bar - Google Standard */}
            <div className="flex items-center justify-between pt-4 mt-2">
              <button
                id="google-switch-to-login-btn"
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage(null);
                }}
                className={`font-medium text-sm px-3 py-2 rounded-full transition-colors ${
                  highContrast
                    ? 'text-yellow-400 hover:bg-zinc-800'
                    : 'text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-[#0b57d0]/10'
                }`}
              >
                Fazer login em vez disso
              </button>

              <button
                id="google-submit-register-btn"
                type="submit"
                disabled={isLoading}
                className={`font-medium text-sm px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-none ${
                  highContrast
                    ? 'bg-yellow-400 text-black font-extrabold hover:bg-yellow-300'
                    : 'bg-[#0b57d0] hover:bg-[#0842a0] dark:bg-[#a8c7fa] dark:hover:bg-[#8ab4f8] text-white dark:text-[#062e6f]'
                }`}
              >
                {isLoading ? 'Criando...' : 'Avançar'}
              </button>
            </div>

            {/* Atalho de teste rápido */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-xs text-[#747775] hover:text-[#0b57d0] font-normal underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#0b57d0]" />
                <span>Preencher com dados de teste rápido</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Google Footer (Idioma, Ajuda, Privacidade, Termos) */}
      <footer
        id="google-auth-footer"
        className="w-full max-w-[450px] mt-4 flex items-center justify-between text-xs text-[#747775] dark:text-[#8e918f] px-4 select-none"
      >
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#1f1f1f] dark:hover:text-[#e3e3e3] transition-colors">
          <span>Português (Brasil)</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-5">
          <span className="cursor-pointer hover:text-[#1f1f1f] dark:hover:text-[#e3e3e3] transition-colors">
            Ajuda
          </span>
          <span className="cursor-pointer hover:text-[#1f1f1f] dark:hover:text-[#e3e3e3] transition-colors">
            Privacidade
          </span>
          <span className="cursor-pointer hover:text-[#1f1f1f] dark:hover:text-[#e3e3e3] transition-colors">
            Termos
          </span>
        </div>
      </footer>
    </div>
  );
};
