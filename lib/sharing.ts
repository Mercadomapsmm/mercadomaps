import { ShoppingList, ShoppingItem } from '@/types/shopping';
import LZString from 'lz-string';

export interface SharedDataPayload {
  lists: ShoppingList[];
  sharedByName: string;
}

/**
 * Codifica TODAS as listas criadas para inclusão ultra-compacta e segura na URL
 * Utiliza compressão LZ-String para garantir que nunca seja truncada pelo WhatsApp
 */
export function encodeListsForUrl(lists: ShoppingList[], sharedByName: string): string {
  try {
    if (!lists || lists.length === 0) return '';

    const compactLists = lists.map(l => ({
      id: l.id,
      name: l.name,
      color: l.color || '#059669',
      icon: l.icon || '🛒',
      items: (l.items || []).map(i => ({
        id: i.id,
        name: i.name,
        quantity: typeof i.quantity === 'number' ? i.quantity : 1,
        unit: i.unit || 'un',
        category: i.category || 'outros',
        estimatedPrice: typeof i.estimatedPrice === 'number' ? i.estimatedPrice : undefined,
        isBought: Boolean(i.isBought),
      })),
    }));

    const payload = JSON.stringify({
      v: 2,
      by: sharedByName || 'Usuário',
      t: Date.now(),
      lists: compactLists,
    });

    const compressed = LZString.compressToEncodedURIComponent(payload);
    return `lz_${compressed}`;
  } catch (err) {
    console.error('Falha ao codificar listas para compartilhamento:', err);
    return '';
  }
}

/**
 * Extrai o parâmetro shared_data da URL atual em qualquer formato (search, hash ou href)
 */
export function extractSharedDataFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. URLSearchParams padrão
    if (window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      const val = sp.get('shared_data');
      if (val) return val;
    }

    // 2. Expressão regular na URL completa (href)
    const href = window.location.href;
    const match = href.match(/[?&#]shared_data=([^&#\s]+)/);
    if (match && match[1]) {
      return match[1];
    }

    // 3. Hash da URL caso tenha sido roteado via hash
    if (window.location.hash) {
      const hashMatch = window.location.hash.match(/shared_data=([^&#\s]+)/);
      if (hashMatch && hashMatch[1]) {
        return hashMatch[1];
      }
    }
  } catch (e) {
    console.error('Erro ao extrair shared_data da URL:', e);
  }
  return null;
}

/**
 * Decodifica as listas a partir do parâmetro da URL de forma altamente resiliente
 * Compatível com LZ-String comprimido, Base64 legado, caracteres especiais e percent-encoding
 */
export function decodeListsFromUrl(encoded: string): SharedDataPayload | null {
  try {
    if (!encoded) return null;
    let cleanStr = encoded.trim();

    // Remove artefatos de final de URL (barras extras, pontos, hashtags soltas)
    cleanStr = cleanStr.replace(/[/.#]+$/, '');

    let jsonStr: string | null = null;

    if (cleanStr.startsWith('lz_')) {
      const lzData = cleanStr.slice(3);
      // Tentativa 1: direta
      jsonStr = LZString.decompressFromEncodedURIComponent(lzData);

      // Tentativa 2: decodificando percent-encoding
      if (!jsonStr) {
        try {
          jsonStr = LZString.decompressFromEncodedURIComponent(decodeURIComponent(lzData));
        } catch {
          // Ignore
        }
      }

      // Tentativa 3: restaurando espaços que eram '+'
      if (!jsonStr && lzData.includes(' ')) {
        try {
          jsonStr = LZString.decompressFromEncodedURIComponent(lzData.replace(/ /g, '+'));
        } catch {
          // Ignore
        }
      }

      // Tentativa 4: percent-encoded + restaura espaços
      if (!jsonStr) {
        try {
          const dec = decodeURIComponent(lzData).replace(/ /g, '+');
          jsonStr = LZString.decompressFromEncodedURIComponent(dec);
        } catch {
          // Ignore
        }
      }
    }

    // Fallback para Base64 se não for LZ ou se a descompressão LZ não retornar
    if (!jsonStr) {
      let b64Str = cleanStr.startsWith('lz_') ? cleanStr.slice(3) : cleanStr;
      try {
        if (b64Str.includes('%')) {
          b64Str = decodeURIComponent(b64Str);
        }
      } catch {
        // Ignora erro de URI
      }

      b64Str = b64Str.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/');
      while (b64Str.length % 4 !== 0) {
        b64Str += '=';
      }

      try {
        const binary = atob(b64Str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        jsonStr = new TextDecoder().decode(bytes);
      } catch {
        // Ignore
      }
    }

    if (!jsonStr) return null;
    const data = JSON.parse(jsonStr);

    if (data && Array.isArray(data.lists) && data.lists.length > 0) {
      const hydratedLists: ShoppingList[] = data.lists.map((l: any, idx: number) => ({
        id: l.id || `imported-list-${Date.now()}-${idx}`,
        name: l.name || `Lista Compartilhada ${idx + 1}`,
        color: l.color || '#059669',
        icon: l.icon || '🛒',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        items: Array.isArray(l.items)
          ? l.items.map((i: any, itemIdx: number) => ({
              id: i.id || `imported-item-${Date.now()}-${itemIdx}`,
              name: i.name || 'Produto',
              quantity: typeof i.quantity === 'number' ? i.quantity : 1,
              unit: i.unit || 'un',
              category: i.category || 'outros',
              estimatedPrice: typeof i.estimatedPrice === 'number' ? i.estimatedPrice : undefined,
              isBought: Boolean(i.isBought),
              createdAt: Date.now() + itemIdx,
            }))
          : [],
      }));

      return {
        lists: hydratedLists,
        sharedByName: data.by || 'Usuário',
      };
    }
    return null;
  } catch (err) {
    console.error('Falha ao decodificar listas da URL:', err);
    return null;
  }
}

/**
 * Instala e adiciona as listas compartilhadas com sucesso no destino:
 * - Se o destino for um novo usuário ou tiver apenas as listas demo iniciais, substitui pelas listas reais compartilhadas.
 * - Se o destino já tiver listas personalizadas, ADICIONA cada lista compartilhada com segurança (adicionando sufixo se houver duplicidade de nome) e ativa a primeira lista adicionada.
 */
export function installSharedLists(
  incomingLists: ShoppingList[],
  existingLists: ShoppingList[],
  isNewOrUntouched: boolean
): { merged: ShoppingList[]; targetActiveId: string; addedCount: number } {
  if (!incomingLists || incomingLists.length === 0) {
    return {
      merged: existingLists || [],
      targetActiveId: existingLists && existingLists[0] ? existingLists[0].id : '',
      addedCount: 0,
    };
  }

  // Se o destino for novo usuário ou tiver apenas as listas demo iniciais não modificadas:
  // instala as listas compartilhadas diretamente como as listas principais do app!
  if (isNewOrUntouched || !existingLists || existingLists.length === 0) {
    const targetActiveId = incomingLists[0] ? incomingLists[0].id : '';
    return {
      merged: incomingLists,
      targetActiveId,
      addedCount: incomingLists.length,
    };
  }

  // Se o usuário já possui listas criadas, ADICIONA as listas compartilhadas à coleção existente
  const merged = [...existingLists];
  const existingNames = new Set(existingLists.map((l) => l.name.trim().toLowerCase()));
  let firstTargetId = '';

  incomingLists.forEach((incoming, idx) => {
    let finalName = incoming.name.trim();
    // Se o nome já existir no destino, adiciona um indicador claro para não confundir
    if (existingNames.has(finalName.toLowerCase())) {
      finalName = `${finalName} (Compartilhada)`;
    }
    existingNames.add(finalName.toLowerCase());

    const uniqueId = `list-shared-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`;
    const newList: ShoppingList = {
      ...incoming,
      id: uniqueId,
      name: finalName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: (incoming.items || []).map((item, itemIdx) => ({
        ...item,
        id: `item-shared-${Date.now()}-${idx}-${itemIdx}`,
      })),
    };

    merged.push(newList);
    if (!firstTargetId) {
      firstTargetId = uniqueId;
    }
  });

  return {
    merged,
    targetActiveId: firstTargetId || (merged[0] ? merged[0].id : ''),
    addedCount: incomingLists.length,
  };
}

// Alias para compatibilidade
export const mergeIncomingListsWithExisting = (
  incoming: ShoppingList[],
  existing: ShoppingList[]
) => installSharedLists(incoming, existing, false);

/**
 * Gera texto formatado para envio no WhatsApp contendo o ícone e a descrição do app com todas as listas
 */
export function formatAllListsWhatsAppMessage(lists: ShoppingList[], appUrl: string, userName?: string): string {
  const totalLists = lists.length;
  let totalItemsCount = 0;
  lists.forEach(l => {
    totalItemsCount += (l.items || []).length;
  });

  let msg = `🛒 *Lista de Compras*\n`;
  msg += `App acessível e prático de lista de compras doméstica com comando de voz, fontes legíveis e organização por categorias de supermercado.\n\n`;
  if (appUrl) {
    msg += `📲 *Você recebeu uma atualização com ${totalLists} ${totalLists === 1 ? 'lista' : 'listas'} (${totalItemsCount} itens). Abra o link abaixo e confirme para continuar:* \n${appUrl}`;
  }
  return msg;
}

/**
 * Gera texto formatado para envio no WhatsApp (para lista única)
 */
export function formatWhatsAppMessage(list: ShoppingList, appUrl: string): string {
  let msg = `🛒 *Lista de Compras*\n`;
  msg += `App acessível e prático de lista de compras doméstica com comando de voz, fontes legíveis e organização por categorias de supermercado.\n\n`;
  if (appUrl) {
    msg += `📲 *Abra o link abaixo para instalar a lista "${list.name}":*\n${appUrl}`;
  }
  return msg;
}

/**
 * Gera assunto e corpo de e-mail formatados para envio de TODAS as listas do app
 */
export function formatAllListsEmailMessage(lists: ShoppingList[], appUrl: string, userName?: string): { subject: string; body: string } {
  const totalLists = lists.length;
  let totalItemsCount = 0;
  lists.forEach(l => {
    totalItemsCount += (l.items || []).length;
  });

  const subject = `Lista de Compras (${totalLists} ${totalLists === 1 ? 'lista' : 'listas'})`;

  let body = '';
  if (userName && userName !== 'Usuário') {
    body += `${userName} compartilhou com você todas as ${totalLists} listas de compras do aplicativo.\n\n`;
  } else {
    body += `Estou compartilhando com você todas as ${totalLists} listas de compras do aplicativo.\n\n`;
  }

  if (appUrl) {
    body += `Clique no link abaixo para sincronizar todas as ${totalLists} listas no seu aparelho:\n${appUrl}\n\n`;
  }

  body += `Enviado através do aplicativo Lista de Compras.`;

  return { subject, body };
}

/**
 * Gera assunto e corpo de e-mail formatados para envio da lista única
 */
export function formatEmailMessage(list: ShoppingList, appUrl: string): { subject: string; body: string } {
  const subject = `Lista de Compras: ${list.name}`;
  let body = `Estou compartilhando com você a lista "${list.name}".\n\n`;
  if (appUrl) {
    body += `Para abrir e sincronizar esta lista, clique no link abaixo:\n${appUrl}\n\n`;
  }
  body += `Enviado através do aplicativo Lista de Compras.`;
  return { subject, body };
}
