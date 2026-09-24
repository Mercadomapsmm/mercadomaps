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
 * Decodifica as listas a partir do parâmetro da URL de forma resiliente
 * Compatível tanto com o formato comprimido LZ (lz_...) quanto com Base64 legado
 */
export function decodeListsFromUrl(encoded: string): SharedDataPayload | null {
  try {
    if (!encoded) return null;
    let cleanStr = encoded.trim();

    let jsonStr: string | null = null;

    if (cleanStr.startsWith('lz_')) {
      const lzData = cleanStr.slice(3);
      jsonStr = LZString.decompressFromEncodedURIComponent(lzData);
    } else {
      // Fallback legado (Base64)
      try {
        if (cleanStr.includes('%')) {
          cleanStr = decodeURIComponent(cleanStr);
        }
      } catch {
        // Ignora erro de URI
      }

      cleanStr = cleanStr.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/');
      while (cleanStr.length % 4 !== 0) {
        cleanStr += '=';
      }

      const binary = atob(cleanStr);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonStr = new TextDecoder().decode(bytes);
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
    msg += `📱 *Acesse o aplicativo com as ${totalLists} ${totalLists === 1 ? 'lista' : 'listas'} criadas (${totalItemsCount} itens):*\n${appUrl}`;
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
    msg += `📱 *Acesse o aplicativo com a lista "${list.name}":*\n${appUrl}`;
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
