import { ShoppingList, ShoppingItem } from '@/types/shopping';

export interface SharedDataPayload {
  lists: ShoppingList[];
  sharedByName: string;
}

/**
 * Codifica as listas para inclusão segura na URL
 */
export function encodeListsForUrl(lists: ShoppingList[], sharedByName: string): string {
  try {
    const compactLists = lists.map(l => ({
      id: l.id,
      name: l.name,
      color: l.color,
      icon: l.icon,
      items: l.items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
        category: i.category,
        estimatedPrice: i.estimatedPrice,
        isBought: i.isBought,
      })),
    }));

    const payload = JSON.stringify({
      v: 1,
      by: sharedByName || 'Usuário',
      t: Date.now(),
      lists: compactLists,
    });

    if (typeof window === 'undefined') return '';

    const utf8Bytes = new TextEncoder().encode(payload);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const b64 = btoa(binary);
    return encodeURIComponent(b64);
  } catch (err) {
    console.error('Falha ao codificar listas para compartilhamento:', err);
    return '';
  }
}

/**
 * Decodifica as listas a partir do parâmetro da URL de forma resiliente
 */
export function decodeListsFromUrl(encoded: string): SharedDataPayload | null {
  try {
    if (!encoded) return null;
    let cleanStr = encoded.trim();

    // Caso a string ainda contenha percent-encoding:
    try {
      if (cleanStr.includes('%')) {
        cleanStr = decodeURIComponent(cleanStr);
      }
    } catch {
      // Ignora erro de URI e continua com a string atual
    }

    // Corrige espaços gerados pelo URLSearchParams (que converte + para espaço)
    // e normaliza caracteres URL-safe (- e _) para + e /
    cleanStr = cleanStr.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/');

    // Preenche o padding em base64 se necessário
    while (cleanStr.length % 4 !== 0) {
      cleanStr += '=';
    }

    const binary = atob(cleanStr);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
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
 * Gera texto formatado para envio no WhatsApp contendo somente o ícone e a descrição do app
 */
export function formatAllListsWhatsAppMessage(lists: ShoppingList[], appUrl: string, userName?: string): string {
  let msg = `🛒 *Lista de Compras*\n`;
  msg += `App acessível e prático de lista de compras doméstica com comando de voz, fontes legíveis e organização por categorias de supermercado.\n\n`;
  if (appUrl) {
    msg += `📱 *Acesse o aplicativo:* ${appUrl}`;
  }
  return msg;
}

/**
 * Gera assunto e corpo de e-mail formatados para envio de TODAS as listas do app
 */
export function formatAllListsEmailMessage(lists: ShoppingList[], appUrl: string, userName?: string): { subject: string; body: string } {
  const totalLists = lists.length;
  let totalItemsCount = 0;
  let totalPendingCount = 0;
  let grandTotalEstimated = 0;

  lists.forEach(l => {
    l.items.forEach(i => {
      totalItemsCount++;
      if (!i.isBought) totalPendingCount++;
      if (i.estimatedPrice) {
        grandTotalEstimated += i.estimatedPrice * i.quantity;
      }
    });
  });

  const subject = `MercadoList - Minhas Listas de Compras (${totalLists} ${totalLists === 1 ? 'lista' : 'listas'})`;

  let body = `Olá!\n\n`;
  if (userName && userName !== 'Usuário') {
    body += `${userName} compartilhou com você todas as listas de compras do aplicativo MercadoList.\n\n`;
  } else {
    body += `Estou compartilhando com você todas as listas de compras do aplicativo MercadoList.\n\n`;
  }

  body += `📱 LINK DO APP COM TODAS AS LISTAS:\n${appUrl}\n\n`;
  body += `==============================================\n`;
  body += `RESUMO DE TODAS AS LISTAS (${totalLists} ${totalLists === 1 ? 'lista' : 'listas'} | ${totalItemsCount} itens)\n`;
  body += `==============================================\n\n`;

  lists.forEach((list) => {
    const toBuy = list.items.filter(i => !i.isBought);
    const bought = list.items.filter(i => i.isBought);

    let listSubtotal = 0;
    list.items.forEach(i => {
      if (i.estimatedPrice) {
        listSubtotal += i.estimatedPrice * i.quantity;
      }
    });

    body += `[${list.icon || '🛒'}] LISTA: ${list.name} (${list.items.length} itens)\n`;

    if (toBuy.length > 0) {
      body += `--- ITENS A COMPRAR (${toBuy.length}) ---\n`;
      toBuy.forEach((i, idx) => {
        const priceStr = i.estimatedPrice && i.estimatedPrice > 0
          ? ` (R$ ${(i.estimatedPrice * i.quantity).toFixed(2).replace('.', ',')})`
          : '';
        body += `${idx + 1}. [ ] ${i.quantity} ${i.unit} - ${i.name}${priceStr}\n`;
      });
    }

    if (bought.length > 0) {
      body += `--- ITENS NO CARRINHO (${bought.length}) ---\n`;
      bought.forEach((i, idx) => {
        body += `${idx + 1}. [X] ${i.quantity} ${i.unit} - ${i.name}\n`;
      });
    }

    if (listSubtotal > 0) {
      body += `Subtotal estimado: R$ ${listSubtotal.toFixed(2).replace('.', ',')}\n`;
    }

    body += `\n----------------------------------------------\n\n`;
  });

  if (grandTotalEstimated > 0) {
    body += `VALOR TOTAL GERAL PREVISTO: R$ ${grandTotalEstimated.toFixed(2).replace('.', ',')}\n\n`;
  }

  body += `Para abrir, editar e sincronizar todas as listas, basta acessar o link do aplicativo no seu navegador:\n${appUrl}\n\n`;
  body += `Enviado através do aplicativo MercadoList.`;

  return { subject, body };
}

/**
 * Gera texto formatado para envio no WhatsApp (para lista única)
 */
export function formatWhatsAppMessage(list: ShoppingList, appUrl: string): string {
  let msg = `🛒 *Lista de Compras*\n`;
  msg += `App acessível e prático de lista de compras doméstica com comando de voz, fontes legíveis e organização por categorias de supermercado.\n\n`;
  if (appUrl) {
    msg += `📱 *Acesse o aplicativo:* ${appUrl}`;
  }
  return msg;
}

/**
 * Gera assunto e corpo de e-mail formatados para envio da lista
 */
export function formatEmailMessage(list: ShoppingList, appUrl: string): { subject: string; body: string } {
  const toBuy = list.items.filter(i => !i.isBought);
  const bought = list.items.filter(i => i.isBought);

  let totalEst = 0;
  list.items.forEach(i => {
    if (i.estimatedPrice) {
      totalEst += i.estimatedPrice * i.quantity;
    }
  });

  const subject = `MercadoList - Lista de Compras: ${list.name}`;
  let body = `Olá!\n\nAqui está a sua lista de compras "${list.name}":\n\n`;

  if (toBuy.length > 0) {
    body += `--- ITENS A COMPRAR (${toBuy.length}) ---\n`;
    toBuy.forEach((i, idx) => {
      const priceStr = i.estimatedPrice && i.estimatedPrice > 0
        ? ` (R$ ${(i.estimatedPrice * i.quantity).toFixed(2).replace('.', ',')})`
        : '';
      body += `${idx + 1}. [ ] ${i.quantity} ${i.unit} - ${i.name}${priceStr}\n`;
    });
    body += `\n`;
  }

  if (bought.length > 0) {
    body += `--- ITENS JÁ NO CARRINHO (${bought.length}) ---\n`;
    bought.forEach((i, idx) => {
      body += `${idx + 1}. [X] ${i.quantity} ${i.unit} - ${i.name}\n`;
    });
    body += `\n`;
  }

  if (totalEst > 0) {
    body += `Valor Total Estimado: R$ ${totalEst.toFixed(2).replace('.', ',')}\n\n`;
  }

  if (appUrl) {
    body += `Para abrir e sincronizar esta lista no aplicativo MercadoList, clique no link abaixo:\n${appUrl}\n\n`;
  }

  body += `Enviado através do aplicativo MercadoList.`;

  return { subject, body };
}

/**
 * Exporta todas as listas em arquivo JSON para download
 */
export function exportListsToJsonFile(lists: ShoppingList[], userName: string): void {
  const exportData = {
    appName: 'Lista de Compras Doméstica',
    exportedBy: userName,
    exportedAt: new Date().toISOString(),
    lists,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lista-de-compras-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
