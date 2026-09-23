import { CategoryId, ShoppingItem, UnitType } from '@/types/shopping';
import { detectCategory } from './categories';
import { TABELA_PRODUTOS_CATEGORIAS, normalizarNome } from './productTable';

// Number words to digits in Portuguese
const NUMBER_WORDS: Record<string, number> = {
  'zero': 0,
  'um': 1,
  'uma': 1,
  'dois': 2,
  'duas': 2,
  'três': 3,
  'tres': 3,
  'quatro': 4,
  'cinco': 5,
  'seis': 6,
  'sete': 7,
  'oito': 8,
  'nove': 9,
  'dez': 10,
  'onze': 11,
  'doze': 12,
  'quinze': 15,
  'vinte': 20,
  'trinta': 30,
  'quarenta': 40,
  'cinquenta': 50,
  'cem': 100,
  'cento': 100,
  'duzentos': 200,
  'quinhentos': 500,
};

export interface ParsedVoiceItem {
  name: string;
  quantity: number;
  unit: UnitType;
  category: CategoryId;
  estimatedPrice?: number;
}

// Map of category aliases spoken by users to standard CategoryId
const CATEGORY_ALIASES: Record<string, CategoryId> = {
  'hortifruti': 'hortifruti',
  'hortifrutti': 'hortifruti',
  'fruta': 'hortifruti',
  'frutas': 'hortifruti',
  'verdura': 'hortifruti',
  'verduras': 'hortifruti',
  'legume': 'hortifruti',
  'legumes': 'hortifruti',
  'feira': 'hortifruti',
  'carnes': 'carnes',
  'carne': 'carnes',
  'açougue': 'carnes',
  'acougue': 'carnes',
  'peixaria': 'carnes',
  'peixe': 'carnes',
  'peixes': 'carnes',
  'frango': 'carnes',
  'aves': 'carnes',
  'laticinios': 'laticinios',
  'laticínios': 'laticinios',
  'frios': 'laticinios',
  'queijos': 'laticinios',
  'queijo': 'laticinios',
  'leites': 'laticinios',
  'leite': 'laticinios',
  'padaria': 'padaria',
  'panificadora': 'padaria',
  'pães': 'padaria',
  'paes': 'padaria',
  'massas': 'padaria',
  'bebidas': 'bebidas',
  'bebida': 'bebidas',
  'adega': 'bebidas',
  'refrigerante': 'bebidas',
  'refrigerantes': 'bebidas',
  'sucos': 'bebidas',
  'suco': 'bebidas',
  'cervejas': 'bebidas',
  'cerveja': 'bebidas',
  'limpeza': 'limpeza',
  'produtos de limpeza': 'limpeza',
  'lavanderia': 'limpeza',
  'higiene': 'higiene',
  'perfumaria': 'higiene',
  'cuidados pessoais': 'higiene',
  'farmacia': 'higiene',
  'farmácia': 'higiene',
  'mercearia': 'mercearia',
  'mantimentos': 'mercearia',
  'despensa': 'mercearia',
  'grãos': 'mercearia',
  'graos': 'mercearia',
  'congelados': 'congelados',
  'congelado': 'congelados',
  'sorvetes': 'congelados',
  'sorvete': 'congelados',
  'outros': 'outros',
  'geral': 'outros',
  'diversos': 'outros',
};

/**
 * Parses natural Portuguese voice transcript into individual shopping items.
 * Example: "2 quilos de alcatra 45 reais categoria carnes e 3 leites 4 reais laticínios"
 */
export function parseSpokenShoppingText(rawText: string): ParsedVoiceItem[] {
  if (!rawText || !rawText.trim()) return [];

  let clean = rawText.toLowerCase().trim();

  // Remove command prefixes
  const prefixes = [
    /^adicionar\s+/i,
    /^adicione\s+/i,
    /^colocar\s+/i,
    /^coloque\s+/i,
    /^comprar\s+/i,
    /^compre\s+/i,
    /^preciso de\s+/i,
    /^anotar\s+/i,
    /^anote\s+/i,
    /^anota aí\s+/i,
    /^bota aí\s+/i,
    /^bota\s+/i,
  ];

  for (const p of prefixes) {
    clean = clean.replace(p, '');
  }

  // Normalize separators (" e ", commas, semicolons, " além de ")
  clean = clean.replace(/\s+e\s+(mais\s+)?/g, ' , ');
  clean = clean.replace(/\s+além de\s+/g, ' , ');
  clean = clean.replace(/\s+também\s+/g, ' , ');
  clean = clean.replace(/;\s*/g, ' , ');

  const rawTokens = clean
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const results: ParsedVoiceItem[] = [];

  for (const token of rawTokens) {
    const parsed = parseSingleVoicePhrase(token);
    if (parsed && parsed.name.trim().length > 0) {
      results.push(parsed);
    }
  }

  return results;
}

/**
 * Parses a single item phrase extracting:
 * 1. Preço (Price)
 * 2. Categoria (Category)
 * 3. Quantidade e Unidade de Medida (Quantity & Unit)
 * 4. Nome limpo do produto (Product Name)
 */
function parseSingleVoicePhrase(phrase: string): ParsedVoiceItem | null {
  let str = phrase.trim();
  if (!str) return null;

  let estimatedPrice: number | undefined = undefined;
  let categoryFound: CategoryId | null = null;
  let quantity = 1;
  let unit: UnitType | null = null;

  // 1. EXTRAIR PREÇO (ex: "45 reais", "preço 15,50", "por 12 reais e 50 centavos", "R$ 9,90", "15 reais cada")
  const priceRegexes = [
    // Preço explícito com "preço de", "valor de", "custa", "por", "a" + valor + reais opcionais
    /(?:preço\s+(?:de\s+)?|valor\s+(?:de\s+)?|no\s+valor\s+de\s+|custa\s+|custando\s+|por\s+|a\s+)(?:r\$\s*)?(\d+(?:[.,]\d{1,2})?)\s*(?:reais?|real|conto|pila)?(?:\s*e\s*(\d{1,2})\s*(?:centavos?)?)?(?:\s*cada|\s*o\s*quilo|\s*a\s*unidade)?/i,
    // "R$ 45,50" ou "R$ 45"
    /(?:r\$\s*)(\d+(?:[.,]\d{1,2})?)/i,
    // Valor seguido de "reais" (ex: "45 reais e 50 centavos", "15 reais")
    /(\d+(?:[.,]\d{1,2})?)\s*(?:reais|real|conto|pila)(?:\s*e\s*(\d{1,2})\s*(?:centavos?)?)?(?:\s*cada|\s*o\s*quilo|\s*a\s*unidade)?/i,
  ];

  for (const rx of priceRegexes) {
    const match = str.match(rx);
    if (match) {
      let mainVal = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(mainVal)) {
        if (match[2]) {
          const cents = parseFloat(match[2]);
          if (!isNaN(cents)) {
            // se falou "50 centavos" ou "5"
            mainVal += cents < 10 && match[2].length === 1 ? cents * 0.1 : cents * 0.01;
          }
        }
        estimatedPrice = Math.round(mainVal * 100) / 100;
        str = str.replace(match[0], ' ').trim();
        break;
      }
    }
  }

  // Preço por extenso simples: "dez reais", "cinco reais", "vinte reais"
  if (estimatedPrice === undefined) {
    const wordPriceMatch = str.match(/(?:preço\s+(?:de\s+)?|valor\s+(?:de\s+)?|por\s+|a\s+)?(um|dois|duas|três|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|quinze|vinte|trinta|quarenta|cinquenta|cem)\s+reais?(?:\s+e\s+(\d+|cinquenta|trinta|vinte)\s*(?:centavos?)?)?/i);
    if (wordPriceMatch && wordPriceMatch[1]) {
      const baseNum = NUMBER_WORDS[wordPriceMatch[1].toLowerCase()];
      if (baseNum !== undefined) {
        let finalNum = baseNum;
        if (wordPriceMatch[2]) {
          const centsWord = wordPriceMatch[2].toLowerCase();
          const centsVal = NUMBER_WORDS[centsWord] || parseFloat(centsWord);
          if (!isNaN(centsVal)) {
            finalNum += centsVal * 0.01;
          }
        }
        estimatedPrice = Math.round(finalNum * 100) / 100;
        str = str.replace(wordPriceMatch[0], ' ').trim();
      }
    }
  }

  // 2. EXTRAIR CATEGORIA (ex: "categoria carnes", "no setor hortifruti", "setor bebidas", ou palavra-chave de categoria no final)
  const categoryExplicitMatch = str.match(/(?:na\s+)?(?:categoria|setor|departamento|sess[ãa]o)\s+(?:de\s+)?([a-záéíóúãõç\s]+)/i);
  if (categoryExplicitMatch) {
    const candidate = categoryExplicitMatch[1].trim().toLowerCase();
    for (const [alias, catId] of Object.entries(CATEGORY_ALIASES)) {
      if (candidate.startsWith(alias) || candidate === alias) {
        categoryFound = catId;
        str = str.replace(categoryExplicitMatch[0], ' ').trim();
        break;
      }
    }
  }

  // Se não achou com prefixo explícito, procura palavras de categorias no final da frase
  // Ex: "2 kg de alcatra 45 reais carnes" -> "carnes"
  if (!categoryFound) {
    for (const [alias, catId] of Object.entries(CATEGORY_ALIASES)) {
      // Verifica se a frase termina com o nome da categoria ou está cercada por limites de palavra
      const regexEnd = new RegExp(`(?:\\s|^)${alias}$`, 'i');
      if (regexEnd.test(str)) {
        categoryFound = catId;
        str = str.replace(regexEnd, ' ').trim();
        break;
      }
    }
  }

  // 3. EXTRAIR QUANTIDADE E UNIDADE DE MEDIDA
  // Casos compostos comuns: "meio quilo", "meia dúzia", "uma dúzia", "duas dúzias"
  if (/^meio\s+quilo(\s+de)?\s+/i.test(str)) {
    quantity = 0.5;
    unit = 'kg';
    str = str.replace(/^meio\s+quilo(\s+de)?\s+/i, ' ');
  } else if (/^meia\s+d[uú]zia(\s+de)?\s+/i.test(str)) {
    quantity = 6;
    unit = 'un';
    str = str.replace(/^meia\s+d[uú]zia(\s+de)?\s+/i, ' ');
  } else if (/^uma\s+d[uú]zia(\s+de)?\s+/i.test(str)) {
    quantity = 1;
    unit = 'dz';
    str = str.replace(/^uma\s+d[uú]zia(\s+de)?\s+/i, ' ');
  } else if (/^duas\s+d[uú]zias(\s+de)?\s+/i.test(str)) {
    quantity = 2;
    unit = 'dz';
    str = str.replace(/^duas\s+d[uú]zias(\s+de)?\s+/i, ' ');
  } else {
    // Quantidade numérica ou palavra no início:
    // Ex: "2 quilos de alcatra", "1 pacote de arroz", "3 leites"
    const startNumMatch = str.match(/^(\d+(?:[.,]\d+)?|[a-záéíóúãõç]+)\s+/i);
    if (startNumMatch) {
      const candidate = startNumMatch[1].toLowerCase();
      let foundNum: number | null = null;

      if (/^\d+(?:[.,]\d+)?$/.test(candidate)) {
        foundNum = parseFloat(candidate.replace(',', '.'));
      } else if (candidate in NUMBER_WORDS) {
        foundNum = NUMBER_WORDS[candidate];
      }

      if (foundNum !== null && !isNaN(foundNum) && foundNum > 0) {
        quantity = foundNum;
        str = str.substring(startNumMatch[0].length).trim();
      }
    }

    // Procura unidade de medida logo após a quantidade ou no início restante
    const unitPatterns: { regex: RegExp; unit: UnitType }[] = [
      { regex: /^(quilos?|kg|kilos?|kilo)(\s+de)?\s+/i, unit: 'kg' },
      { regex: /^(gramas?|g)(\s+de)?\s+/i, unit: 'g' },
      { regex: /^(litros?|l)(\s+de)?\s+/i, unit: 'L' },
      { regex: /^(mililitros?|ml)(\s+de)?\s+/i, unit: 'ml' },
      { regex: /^(caixas?|cx|cartelas?|cartela)(\s+de)?\s+/i, unit: 'cx' },
      { regex: /^(pacotes?|pct|sacos?|saco)(\s+de)?\s+/i, unit: 'pct' },
      { regex: /^(d[úu]zias?|dz)(\s+de)?\s+/i, unit: 'dz' },
      { regex: /^(garrafas?|gf|pets?|pet)(\s+de)?\s+/i, unit: 'garrafa' },
      { regex: /^(latas?|lt)(\s+de)?\s+/i, unit: 'lata' },
      { regex: /^(unidades?|un|pe[çc]as?|pe[çc]a)(\s+de)?\s+/i, unit: 'un' },
    ];

    for (const p of unitPatterns) {
      if (p.regex.test(str)) {
        unit = p.unit;
        str = str.replace(p.regex, ' ').trim();
        break;
      }
    }
  }

  // Verifica se a quantidade e unidade estavam no final da frase (ex: "tomate 2 quilos", "cerveja 6 latas")
  if (!unit) {
    const endUnitPatterns: { regex: RegExp; unit: UnitType }[] = [
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(quilos?|kg|kilos?)$/i, unit: 'kg' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(gramas?|g)$/i, unit: 'g' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(litros?|l)$/i, unit: 'L' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(mililitros?|ml)$/i, unit: 'ml' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(caixas?|cx)$/i, unit: 'cx' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(pacotes?|pct)$/i, unit: 'pct' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(d[úu]zias?|dz)$/i, unit: 'dz' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(garrafas?|gf)$/i, unit: 'garrafa' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(latas?|lt)$/i, unit: 'lata' },
      { regex: /\s+(\d+(?:[.,]\d+)?)\s*(unidades?|un)$/i, unit: 'un' },
    ];

    for (const ep of endUnitPatterns) {
      const match = str.match(ep.regex);
      if (match) {
        quantity = parseFloat(match[1].replace(',', '.'));
        unit = ep.unit;
        str = str.replace(ep.regex, ' ').trim();
        break;
      }
    }
  }

  // 4. LIMPAR NOME DO PRODUTO
  // Remove preposições comuns no início ou fim: "de", "da", "do", "dos", "das", "para", "o", "a"
  str = str
    .replace(/^(de|da|do|dos|das|para|o|a|no|na)\s+/i, '')
    .replace(/\s+(de|da|do|dos|das)$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!str) return null;

  // Capitaliza o nome do produto
  const name = str.charAt(0).toUpperCase() + str.slice(1);

  // Se não foi informada a unidade de medida, tenta obter unidade padrão na tabela de produtos
  let finalUnit: UnitType = unit || 'un';
  if (!unit) {
    const normalizado = normalizarNome(name);
    const itemTabela = TABELA_PRODUTOS_CATEGORIAS.find(
      (p) =>
        normalizarNome(p.nome) === normalizado ||
        p.palavrasChave.some((kw) => normalizarNome(kw) === normalizado)
    );
    if (itemTabela?.unidadePadrao) {
      finalUnit = itemTabela.unidadePadrao;
    }
  }

  // Se não encontrou categoria explícita na fala, detecta automaticamente pela tabela e palavras-chave
  const finalCategory: CategoryId = categoryFound || detectCategory(name);

  return {
    name,
    quantity,
    unit: finalUnit,
    category: finalCategory,
    estimatedPrice,
  };
}

// Text to Speech List Reader - Fala somente os produtos
export function speakListItems(items: ShoppingItem[], speed: number = 1.0) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const toBuy = items.filter(i => !i.isBought);

  let textToSay = '';
  if (toBuy.length === 0) {
    textToSay = 'Nenhum produto a comprar.';
  } else {
    // Fala exclusivamente os nomes dos produtos
    textToSay = toBuy.map(i => i.name).join('. ') + '.';
  }

  const utterance = new SpeechSynthesisUtterance(textToSay);
  utterance.lang = 'pt-BR';
  utterance.rate = speed;
  utterance.pitch = 1.0;

  // Find a Portuguese voice if available
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR')) ||
                  voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) {
    utterance.voice = ptVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}
