import { User, StoredUserAccount } from '@/types/auth';

const STORAGE_USERS_KEY = 'lista_compras_domestica_users';
const STORAGE_CURRENT_USER_KEY = 'lista_compras_domestica_current_user';
const STORAGE_AUTO_LOGIN_KEY = 'lista_compras_domestica_auto_login';
const STORAGE_HAS_CREATED_KEY = 'lista_compras_user_created_account';

/**
 * Retorna se o usuário já criou seu usuário e senha neste navegador/dispositivo.
 */
export function hasUserCreatedAccount(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const hasCreatedFlag = localStorage.getItem(STORAGE_HAS_CREATED_KEY) === 'true';
    if (hasCreatedFlag) return true;
    const accounts = getStoredAccounts();
    return accounts.length > 0;
  } catch {
    return false;
  }
}

/**
 * Retorna se o login automático está ativo (padrão é true após criar a conta).
 */
export function isAutoLoginEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_AUTO_LOGIN_KEY);
    // Se ainda não foi definido, o padrão é true
    if (raw === null) return true;
    return raw === 'true';
  } catch {
    return true;
  }
}

/**
 * Define se o login automático está ativo.
 */
export function setAutoLoginEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_AUTO_LOGIN_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore
  }
}

/**
 * Obtém a lista de contas salvas no dispositivo.
 */
export function getStoredAccounts(): StoredUserAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) return [];
    const accounts: StoredUserAccount[] = JSON.parse(raw);
    if (!Array.isArray(accounts)) return [];
    return accounts;
  } catch {
    return [];
  }
}

/**
 * Obtém a sessão do usuário atual.
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * Define a sessão do usuário atual.
 */
export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch {
    // Ignore
  }
}

/**
 * Tenta resolver o usuário para login automático.
 * Se o usuário já criou usuário e senha e o auto-login estiver ativo,
 * retorna a conta para entrar direto sem solicitar dados.
 */
export function resolveAutoLoginUser(): User | null {
  if (typeof window === 'undefined') return null;
  if (!isAutoLoginEnabled()) return null;

  // 1. Verifica se há uma sessão ativa salva
  const current = getCurrentUser();
  if (current) return current;

  // 2. Se não houver sessão ativa, mas já existe conta criada, usa a última conta registrada
  const accounts = getStoredAccounts();
  if (accounts.length > 0) {
    const lastAccount = accounts[accounts.length - 1];
    const autoUser: User = {
      id: lastAccount.id,
      username: lastAccount.username,
      name: lastAccount.name,
      createdAt: lastAccount.createdAt,
    };
    setCurrentUser(autoUser);
    return autoUser;
  }

  return null;
}

/**
 * Autentica o usuário com usuário e senha.
 */
export function loginUser(
  usernameInput: string,
  passwordInput: string,
  rememberAutoLogin: boolean = true
): { success: boolean; user?: User; error?: string } {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanUsername) {
    return { success: false, error: 'Por favor, informe seu usuário ou e-mail.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Por favor, informe sua senha.' };
  }

  const accounts = getStoredAccounts();
  const account = accounts.find(
    (acc) => acc.username.toLowerCase() === cleanUsername
  );

  if (!account) {
    return { success: false, error: 'Usuário não encontrado. Crie sua conta primeiro.' };
  }

  if (account.passwordHash !== cleanPassword) {
    return { success: false, error: 'Senha incorreta. Tente novamente.' };
  }

  const user: User = {
    id: account.id,
    username: account.username,
    name: account.name,
    createdAt: account.createdAt,
  };

  setCurrentUser(user);
  setAutoLoginEnabled(rememberAutoLogin);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_HAS_CREATED_KEY, 'true');
  }

  return { success: true, user };
}

/**
 * Cria um novo usuário e senha e já realiza o login automático.
 */
export function registerUser(
  nameInput: string,
  usernameInput: string,
  passwordInput: string
): { success: boolean; user?: User; error?: string } {
  const cleanName = nameInput.trim();
  const cleanUsername = usernameInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanName) {
    return { success: false, error: 'Por favor, digite seu nome ou apelido.' };
  }
  if (!cleanUsername) {
    return { success: false, error: 'Por favor, escolha um nome de usuário.' };
  }
  if (cleanUsername.length < 3) {
    return { success: false, error: 'O nome de usuário deve ter no mínimo 3 caracteres.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Por favor, crie uma senha.' };
  }
  if (cleanPassword.length < 3) {
    return { success: false, error: 'A senha deve conter no mínimo 3 caracteres.' };
  }

  const accounts = getStoredAccounts();
  const exists = accounts.some(
    (acc) => acc.username.toLowerCase() === cleanUsername
  );

  if (exists) {
    return { success: false, error: 'Este nome de usuário já está em uso. Por favor, escolha outro.' };
  }

  const newAccount: StoredUserAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    username: cleanUsername,
    name: cleanName,
    passwordHash: cleanPassword,
    createdAt: Date.now(),
  };

  accounts.push(newAccount);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
      localStorage.setItem(STORAGE_HAS_CREATED_KEY, 'true');
      localStorage.setItem(STORAGE_AUTO_LOGIN_KEY, 'true');
    } catch {
      // Ignore
    }
  }

  const user: User = {
    id: newAccount.id,
    username: newAccount.username,
    name: newAccount.name,
    createdAt: newAccount.createdAt,
  };

  setCurrentUser(user);
  return { success: true, user };
}

/**
 * Desconecta o usuário atual e desativa temporariamente o auto-login.
 */
export function logoutUser(): void {
  setCurrentUser(null);
  setAutoLoginEnabled(false);
}

/**
 * Realiza login ou cadastro direto com o padrão de Conta do Google.
 */
export function loginWithGoogleAccount(
  email: string = 'mercadomapsmm@gmail.com',
  name: string = 'Mercado Maps'
): User {
  const accounts = getStoredAccounts();
  const existing = accounts.find((acc) => acc.username.toLowerCase() === email.toLowerCase());

  if (existing) {
    const user: User = {
      id: existing.id,
      username: existing.username,
      name: existing.name,
      createdAt: existing.createdAt,
    };
    setCurrentUser(user);
    setAutoLoginEnabled(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_HAS_CREATED_KEY, 'true');
    }
    return user;
  }

  const newAccount: StoredUserAccount = {
    id: `user-google-${Date.now()}`,
    username: email.toLowerCase(),
    name: name,
    passwordHash: 'google_session_auth',
    createdAt: Date.now(),
  };

  accounts.push(newAccount);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
      localStorage.setItem(STORAGE_HAS_CREATED_KEY, 'true');
      localStorage.setItem(STORAGE_AUTO_LOGIN_KEY, 'true');
    } catch {
      // Ignore
    }
  }

  const user: User = {
    id: newAccount.id,
    username: newAccount.username,
    name: newAccount.name,
    createdAt: newAccount.createdAt,
  };

  setCurrentUser(user);
  return user;
}
