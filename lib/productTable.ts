import { CategoryId, CategoryInfo, ShoppingItem, UnitType } from '@/types/shopping';
import { CATEGORIES } from './categories';

export interface ProductClassification {
  nome: string;
  categoria: CategoryId;
  departamento: string;
  palavrasChave: string[];
  unidadePadrao?: UnitType;
}

// Helper para normalizar textos (remover acentos, minúsculas, pontuação)
export function normalizarNome(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * TABELA DE CLASSIFICAÇÃO DE PRODUTOS DE SUPERMERCADO
 * Mapeia os produtos mais consumidos em supermercados com suas
 * respectivas categorias, departamentos e palavras-chave.
 */
export const TABELA_PRODUTOS_CATEGORIAS: ProductClassification[] = [
  // ==========================================
  // HORTIFRÚTI (Frutas, Legumes e Verduras)
  // ==========================================
  { nome: 'Banana', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['banana', 'nanica', 'prata', 'ouro', 'maca'], unidadePadrao: 'dz' },
  { nome: 'Maçã', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['maca', 'gala', 'fuji', 'verde'], unidadePadrao: 'kg' },
  { nome: 'Laranja', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['laranja', 'pera', 'lima', 'suco'], unidadePadrao: 'kg' },
  { nome: 'Limão', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['limao', 'taiti', 'siciliano'], unidadePadrao: 'kg' },
  { nome: 'Tomate', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['tomate', 'italiano', 'cereja', 'carmem'], unidadePadrao: 'kg' },
  { nome: 'Cebola', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['cebola', 'roxa', 'branca'], unidadePadrao: 'kg' },
  { nome: 'Alho', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['alho', 'dente de alho', 'cabeca de alho'], unidadePadrao: 'un' },
  { nome: 'Batata', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['batata', 'inglesa', 'monalisa', 'asterix'], unidadePadrao: 'kg' },
  { nome: 'Batata-Doce', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['batata doce', 'batata-doce'], unidadePadrao: 'kg' },
  { nome: 'Cenoura', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['cenoura'], unidadePadrao: 'kg' },
  { nome: 'Beterraba', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['beterraba'], unidadePadrao: 'kg' },
  { nome: 'Alface', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['alface', 'crespa', 'americana', 'lisa', 'roxa'], unidadePadrao: 'un' },
  { nome: 'Rúcula', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['rucula'], unidadePadrao: 'un' },
  { nome: 'Couve', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['couve', 'manteiga'], unidadePadrao: 'un' },
  { nome: 'Agrião', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['agriao'], unidadePadrao: 'un' },
  { nome: 'Espinafre', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['espinafre'], unidadePadrao: 'un' },
  { nome: 'Repolho', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['repolho', 'verde', 'roxo'], unidadePadrao: 'un' },
  { nome: 'Brócolis', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['brocolis', 'ninja'], unidadePadrao: 'un' },
  { nome: 'Couve-flor', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['couve flor', 'couve-flor'], unidadePadrao: 'un' },
  { nome: 'Abobrinha', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['abobrinha', 'italiana', 'menina'], unidadePadrao: 'kg' },
  { nome: 'Berinjela', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['berinjela'], unidadePadrao: 'kg' },
  { nome: 'Chuchu', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['chuchu'], unidadePadrao: 'kg' },
  { nome: 'Pepino', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['pepino', 'japones', 'comum'], unidadePadrao: 'kg' },
  { nome: 'Pimentão', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['pimentao', 'verde', 'vermelho', 'amarelo'], unidadePadrao: 'kg' },
  { nome: 'Mandioca', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['mandioca', 'aipim', 'macaxeira'], unidadePadrao: 'kg' },
  { nome: 'Abóbora', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['abobora', 'cabotia', 'moranga', 'japonesa'], unidadePadrao: 'kg' },
  { nome: 'Melancia', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['melancia'], unidadePadrao: 'un' },
  { nome: 'Melão', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['melao', 'amarelo', 'cantaloupe'], unidadePadrao: 'un' },
  { nome: 'Abacaxi', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['abacaxi', 'perola'], unidadePadrao: 'un' },
  { nome: 'Mamão', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['mamao', 'papaya', 'formosa'], unidadePadrao: 'un' },
  { nome: 'Manga', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['manga', 'tommy', 'palmer'], unidadePadrao: 'kg' },
  { nome: 'Uva', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['uva', 'thompson', 'crimson', 'italia', 'niagara'], unidadePadrao: 'pct' },
  { nome: 'Morango', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['morango'], unidadePadrao: 'cx' },
  { nome: 'Abacate', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['abacate', 'avocado'], unidadePadrao: 'un' },
  { nome: 'Pêra', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['pera', 'williams', 'portuguesa'], unidadePadrao: 'kg' },
  { nome: 'Pêssego', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['pessego'], unidadePadrao: 'kg' },
  { nome: 'Maracujá', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['maracuja'], unidadePadrao: 'kg' },
  { nome: 'Goiaba', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['goiaba', 'vermelha', 'branca'], unidadePadrao: 'kg' },
  { nome: 'Cheiro Verde', categoria: 'hortifruti', departamento: 'Hortifrúti', palavrasChave: ['cheiro verde', 'salsa', 'salsinha', 'cebolinha', 'coentro'], unidadePadrao: 'un' },

  // ==========================================
  // CARNES & PEIXES (Açougue e Peixaria)
  // ==========================================
  { nome: 'Picanha', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['picanha', 'bife de picanha'], unidadePadrao: 'kg' },
  { nome: 'Alcatra', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['alcatra', 'miolo de alcatra'], unidadePadrao: 'kg' },
  { nome: 'Contrafilé', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['contrafile', 'contra-file', 'chorizo'], unidadePadrao: 'kg' },
  { nome: 'Carne Moída', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['carne moida', 'moida', 'patinho moido'], unidadePadrao: 'kg' },
  { nome: 'Patinho', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['patinho', 'bife de patinho'], unidadePadrao: 'kg' },
  { nome: 'Costela Bovina', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['costela bovina', 'costela'], unidadePadrao: 'kg' },
  { nome: 'Filé Mignon', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['file mignon', 'mignon'], unidadePadrao: 'kg' },
  { nome: 'Maminha', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['maminha'], unidadePadrao: 'kg' },
  { nome: 'Fraldinha', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['fraldinha'], unidadePadrao: 'kg' },
  { nome: 'Acém', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['acem'], unidadePadrao: 'kg' },
  { nome: 'Cupim', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['cupim'], unidadePadrao: 'kg' },
  { nome: 'Músculo', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['musculo'], unidadePadrao: 'kg' },
  { nome: 'Peito de Frango', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['peito de frango', 'file de frango', 'peito frango'], unidadePadrao: 'kg' },
  { nome: 'Coxa e Sobrecoxa', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['coxa', 'sobrecoxa', 'coxa de frango'], unidadePadrao: 'kg' },
  { nome: 'Asa de Frango', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['asa de frango', 'asinha', 'tulipa'], unidadePadrao: 'kg' },
  { nome: 'Frango Inteiro', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['frango', 'frango inteiro', 'galeto'], unidadePadrao: 'un' },
  { nome: 'Coração de Frango', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['coracao de frango', 'coracao'], unidadePadrao: 'kg' },
  { nome: 'Lombo Suíno', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['lombo suino', 'lombo de porco', 'lombo'], unidadePadrao: 'kg' },
  { nome: 'Costelinha de Porco', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['costelinha', 'costela de porco', 'costelinha suina'], unidadePadrao: 'kg' },
  { nome: 'Bisteca Suína', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['bisteca', 'bisteca suina', 'bisteca de porco'], unidadePadrao: 'kg' },
  { nome: 'Linguiça Toscana', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['linguica toscana', 'linguica churrasco'], unidadePadrao: 'kg' },
  { nome: 'Linguiça Calabresa', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['calabresa', 'linguica calabresa', 'defumada'], unidadePadrao: 'kg' },
  { nome: 'Bacon', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['bacon', 'bacon fatiado', 'bacon em pedaco'], unidadePadrao: 'kg' },
  { nome: 'Salsicha', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['salsicha', 'vina'], unidadePadrao: 'kg' },
  { nome: 'Tilápia', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['tilapia', 'file de tilapia'], unidadePadrao: 'kg' },
  { nome: 'Salmão', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['salmao', 'file de salmao'], unidadePadrao: 'kg' },
  { nome: 'Bacalhau', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['bacalhau'], unidadePadrao: 'kg' },
  { nome: 'Sardinha Fresca', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['sardinha fresca', 'sardinha limpa'], unidadePadrao: 'kg' },
  { nome: 'Camarão', categoria: 'carnes', departamento: 'Carnes & Peixes', palavrasChave: ['camarao', 'camarao limpo'], unidadePadrao: 'kg' },

  // ==========================================
  // LATICÍNIOS & OVOS
  // ==========================================
  { nome: 'Leite Integral', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['leite integral', 'leite'], unidadePadrao: 'L' },
  { nome: 'Leite Desnatado', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['leite desnatado', 'semidesnatado'], unidadePadrao: 'L' },
  { nome: 'Leite em Pó', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['leite em po', 'leite ninho'], unidadePadrao: 'lata' },
  { nome: 'Ovos', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['ovo', 'ovos', 'ovo caipira', 'ovo branco', 'duzia de ovos'], unidadePadrao: 'dz' },
  { nome: 'Queijo Mussarela', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['mussarela', 'mozarela', 'queijo mussarela'], unidadePadrao: 'kg' },
  { nome: 'Queijo Prato', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['queijo prato', 'prato fatiado'], unidadePadrao: 'kg' },
  { nome: 'Queijo Minas', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['queijo minas', 'minas frescal', 'queijo branco'], unidadePadrao: 'un' },
  { nome: 'Queijo Parmesão', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['parmesao', 'queijo ralado', 'queijo parmesao'], unidadePadrao: 'pct' },
  { nome: 'Requeijão', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['requeijao', 'requeijao cremoso', 'catupiry'], unidadePadrao: 'un' },
  { nome: 'Manteiga', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['manteiga', 'manteiga com sal', 'manteiga sem sal'], unidadePadrao: 'un' },
  { nome: 'Margarina', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['margarina', 'qualy', 'doriana'], unidadePadrao: 'un' },
  { nome: 'Iogurte', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['iogurte', 'danone', 'iogurte natural', 'grego'], unidadePadrao: 'un' },
  { nome: 'Leite Fermentado', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['yakult', 'leite fermentado', 'chamyto'], unidadePadrao: 'pct' },
  { nome: 'Creme de Leite', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['creme de leite', 'creme de leite fresco'], unidadePadrao: 'cx' },
  { nome: 'Leite Condensado', categoria: 'laticinios', departamento: 'Laticínios & Ovos', palavrasChave: ['leite condensado', 'leite moca'], unidadePadrao: 'cx' },

  // ==========================================
  // PADARIA & MASSAS
  // ==========================================
  { nome: 'Pão Francês', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['pao frances', 'pao de sal', 'paozinho'], unidadePadrao: 'un' },
  { nome: 'Pão de Forma', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['pao de forma', 'pao pullman'], unidadePadrao: 'pct' },
  { nome: 'Pão Integral', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['pao integral', 'pao 7 graos'], unidadePadrao: 'pct' },
  { nome: 'Pão de Queijo', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['pao de queijo'], unidadePadrao: 'pct' },
  { nome: 'Baguete', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['baguete'], unidadePadrao: 'un' },
  { nome: 'Croissant', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['croissant'], unidadePadrao: 'un' },
  { nome: 'Torrada', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['torrada', 'bauducco'], unidadePadrao: 'pct' },
  { nome: 'Bolo', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['bolo', 'bolo caseiro', 'bolo de cenoura', 'bolo de chocolate'], unidadePadrao: 'un' },
  { nome: 'Biscoito / Bolacha', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['biscoito', 'bolacha', 'cream cracker', 'maizena', 'recheado'], unidadePadrao: 'pct' },
  { nome: 'Macarrão Espaguete', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['macarrao', 'espaguete', 'spaghetti'], unidadePadrao: 'pct' },
  { nome: 'Macarrão Parafuso', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['parafuso', 'fusilli'], unidadePadrao: 'pct' },
  { nome: 'Macarrão Penne', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['penne'], unidadePadrao: 'pct' },
  { nome: 'Massa de Lasanha', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['lasanha', 'massa de lasanha'], unidadePadrao: 'pct' },
  { nome: 'Massa de Pastel', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['massa de pastel', 'pastel de feira'], unidadePadrao: 'pct' },
  { nome: 'Farinha de Trigo', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['farinha de trigo', 'trigo'], unidadePadrao: 'kg' },
  { nome: 'Fermento Biológico / Químico', categoria: 'padaria', departamento: 'Padaria & Massas', palavrasChave: ['fermento', 'royal', 'fermento biologico', 'fermento em po'], unidadePadrao: 'un' },

  // ==========================================
  // MERCEARIA & GRÃOS (Despensa)
  // ==========================================
  { nome: 'Arroz', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['arroz', 'agulhinha', 'parboilizado', 'arroz branco'], unidadePadrao: 'pct' },
  { nome: 'Feijão Carioca', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['feijao', 'feijao carioca', 'carioquinha'], unidadePadrao: 'kg' },
  { nome: 'Feijão Preto', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['feijao preto'], unidadePadrao: 'kg' },
  { nome: 'Café em Pó', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['cafe', 'cafe em po', 'cafe torrado', 'cafe soluvel'], unidadePadrao: 'pct' },
  { nome: 'Açúcar Refinado', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['acucar', 'acucar refinado', 'uniao'], unidadePadrao: 'kg' },
  { nome: 'Açúcar Cristal', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['acucar cristal', 'demerara', 'mascavo'], unidadePadrao: 'kg' },
  { nome: 'Adoçante', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['adocante', 'sucralose', 'stevia'], unidadePadrao: 'un' },
  { nome: 'Óleo de Soja', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['oleo', 'oleo de soja', 'oleo de girassol', 'liza', 'soya'], unidadePadrao: 'garrafa' },
  { nome: 'Azeite de Oliva', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['azeite', 'azeite de oliva', 'extra virgem'], unidadePadrao: 'garrafa' },
  { nome: 'Vinagre', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['vinagre', 'vinagre de maca', 'vinagre de alcool'], unidadePadrao: 'garrafa' },
  { nome: 'Sal Refinado', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['sal', 'sal refinado', 'sal fino'], unidadePadrao: 'kg' },
  { nome: 'Sal Grosso', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['sal grosso', 'sal de churrasco'], unidadePadrao: 'kg' },
  { nome: 'Molho de Tomate', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['molho de tomate', 'extrato de tomate', 'pomarola', 'polpa de tomate'], unidadePadrao: 'pct' },
  { nome: 'Milho em Conserva', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['milho em lata', 'milho verde lata', 'milho conserva'], unidadePadrao: 'lata' },
  { nome: 'Ervilha em Conserva', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['ervilha em lata', 'ervilha conserva'], unidadePadrao: 'lata' },
  { nome: 'Atum em Lata', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['atum', 'atum em lata', 'atum solido', 'atum ralado'], unidadePadrao: 'lata' },
  { nome: 'Sardinha em Lata', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['sardinha em lata', 'sardinha molho'], unidadePadrao: 'lata' },
  { nome: 'Azeitona', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['azeitona', 'azeitona verde', 'azeitona preta', 'sem caroco'], unidadePadrao: 'un' },
  { nome: 'Maionese', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['maionese', 'hellmanns'], unidadePadrao: 'un' },
  { nome: 'Ketchup', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['ketchup', 'heinz'], unidadePadrao: 'un' },
  { nome: 'Mostarda', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['mostarda'], unidadePadrao: 'un' },
  { nome: 'Molho Shoyu', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['shoyu', 'molho shoyu', 'sakura'], unidadePadrao: 'garrafa' },
  { nome: 'Aveia em Flocos', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['aveia', 'aveia em flocos', 'farelo de aveia', 'quaker'], unidadePadrao: 'pct' },
  { nome: 'Granola', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['granola', 'cereal'], unidadePadrao: 'pct' },
  { nome: 'Achocolatado em Pó', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['achocolatado', 'nescau', 'toddy', 'chocolatto'], unidadePadrao: 'lata' },
  { nome: 'Chocolate em Barra', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['chocolate', 'barra de chocolate', 'nestle', 'lacta', 'garoto'], unidadePadrao: 'un' },
  { nome: 'Gelatina', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['gelatina', 'po de gelatina'], unidadePadrao: 'cx' },
  { nome: 'Farinha de Mandioca', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['farinha de mandioca', 'farofa', 'farofa pronta', 'yoki'], unidadePadrao: 'pct' },
  { nome: 'Amido de Milho', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['amido de milho', 'maizena'], unidadePadrao: 'cx' },
  { nome: 'Fubá', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['fuba', 'fuba mimoso'], unidadePadrao: 'pct' },
  { nome: 'Milho de Pipoca', categoria: 'mercearia', departamento: 'Mercearia & Grãos', palavrasChave: ['pipoca', 'milho de pipoca'], unidadePadrao: 'pct' },

  // ==========================================
  // BEBIDAS
  // ==========================================
  { nome: 'Água Mineral', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['agua mineral', 'agua sem gas', 'garrafao de agua'], unidadePadrao: 'garrafa' },
  { nome: 'Água com Gás', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['agua com gas'], unidadePadrao: 'garrafa' },
  { nome: 'Água de Coco', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['agua de coco', 'kero coco'], unidadePadrao: 'cx' },
  { nome: 'Refrigerante Coca-Cola', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['coca-cola', 'coca', 'coca zero', 'refrigerante'], unidadePadrao: 'garrafa' },
  { nome: 'Refrigerante Guaraná', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['guarana', 'guarana antarctica'], unidadePadrao: 'garrafa' },
  { nome: 'Suco de Frutas', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['suco', 'del valle', 'nectar', 'suco de uva', 'suco de laranja'], unidadePadrao: 'cx' },
  { nome: 'Chá Gelado', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['cha', 'matte leao', 'ice tea'], unidadePadrao: 'garrafa' },
  { nome: 'Cerveja', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['cerveja', 'heineken', 'brahma', 'skol', 'amstel', 'chopp', 'lata de cerveja', 'long neck'], unidadePadrao: 'lata' },
  { nome: 'Vinho', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['vinho', 'vinho tinto', 'vinho branco', 'espumante'], unidadePadrao: 'garrafa' },
  { nome: 'Energético', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['energetico', 'red bull', 'monster'], unidadePadrao: 'lata' },
  { nome: 'Isotônico', categoria: 'bebidas', departamento: 'Bebidas', palavrasChave: ['isotonico', 'gatorade', 'powerade'], unidadePadrao: 'garrafa' },

  // ==========================================
  // LIMPEZA DA CASA
  // ==========================================
  { nome: 'Detergente Líquido', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['detergente', 'ype', 'limpol'], unidadePadrao: 'un' },
  { nome: 'Sabão em Pó', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['sabao em po', 'omo', 'tixan', 'brilhante'], unidadePadrao: 'cx' },
  { nome: 'Sabão Líquido', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['sabao liquido', 'sabao para roupas'], unidadePadrao: 'garrafa' },
  { nome: 'Amaciante de Roupas', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['amaciante', 'comfort', 'downy', 'amaciante concentrado'], unidadePadrao: 'garrafa' },
  { nome: 'Desinfetante', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['desinfetante', 'pinho sol', 'lysoform'], unidadePadrao: 'garrafa' },
  { nome: 'Água Sanitária', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['agua sanitaria', 'candida', 'cloro'], unidadePadrao: 'garrafa' },
  { nome: 'Limpador Multiuso', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['multiuso', 'veja', 'limpador'], unidadePadrao: 'un' },
  { nome: 'Desengordurante', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['desengordurante', 'veja cozinha'], unidadePadrao: 'un' },
  { nome: 'Esponja de Cozinha', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['esponja', 'esponja de pia', 'scotch brite'], unidadePadrao: 'pct' },
  { nome: 'Palha de Aço', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['palha de aco', 'bombril', 'assolan'], unidadePadrao: 'pct' },
  { nome: 'Saco de Lixo', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['saco de lixo', 'saco lixo 30l', 'saco lixo 50l', 'saco lixo 100l'], unidadePadrao: 'pct' },
  { nome: 'Pano de Chão / Prato', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['pano de chao', 'pano de prato', 'flanela', 'pano microfibra'], unidadePadrao: 'un' },
  { nome: 'Lustra-Móveis', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['lustra moveis', 'poliflor'], unidadePadrao: 'un' },
  { nome: 'Alvejante / Tira-Manchas', categoria: 'limpeza', departamento: 'Limpeza da Casa', palavrasChave: ['alvejante', 'vanish', 'tira manchas'], unidadePadrao: 'un' },

  // ==========================================
  // HIGIENE & CUIDADOS PESSOAIS
  // ==========================================
  { nome: 'Papel Higiênico', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['papel higienico', 'neve', 'folha dupla'], unidadePadrao: 'pct' },
  { nome: 'Sabonete em Barra', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['sabonete', 'dove', 'lux', 'palmolive', 'protex'], unidadePadrao: 'un' },
  { nome: 'Sabonete Líquido', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['sabonete liquido'], unidadePadrao: 'un' },
  { nome: 'Creme Dental', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['creme dental', 'pasta de dente', 'colgate', 'sorriso', 'sensodyne'], unidadePadrao: 'un' },
  { nome: 'Escova de Dente', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['escova de dente', 'escova dental'], unidadePadrao: 'un' },
  { nome: 'Fio Dental', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['fio dental'], unidadePadrao: 'un' },
  { nome: 'Shampoo', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['shampoo', 'xampu', 'pantene', 'head shoulders', 'seda'], unidadePadrao: 'un' },
  { nome: 'Condicionador', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['condicionador'], unidadePadrao: 'un' },
  { nome: 'Desodorante', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['desodorante', 'rexona', 'dove desodorante', 'aerosol', 'rollon'], unidadePadrao: 'un' },
  { nome: 'Absorvente', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['absorvente', 'sempre livre', 'intimus'], unidadePadrao: 'pct' },
  { nome: 'Aparelho de Barbear', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['barbeador', 'gillette', 'lamina de barbear'], unidadePadrao: 'un' },
  { nome: 'Algodão / Cotonetes', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['algodao', 'cotonete', 'hastes flexiveis'], unidadePadrao: 'pct' },
  { nome: 'Lenço Umedecido', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['lenco umedecido', 'toalhinha umedecida'], unidadePadrao: 'pct' },
  { nome: 'Fralda Descartável', categoria: 'higiene', departamento: 'Higiene & Cuidados', palavrasChave: ['fralda', 'pampers', 'huggies'], unidadePadrao: 'pct' },

  // ==========================================
  // CONGELADOS
  // ==========================================
  { nome: 'Sorvete', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['sorvete', 'kibon', 'pote de sorvete', 'picole'], unidadePadrao: 'cx' },
  { nome: 'Açaí', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['acai', 'pote de acai'], unidadePadrao: 'cx' },
  { nome: 'Pizza Congelada', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['pizza congelada', 'pizza sadia', 'pizza perdigao'], unidadePadrao: 'un' },
  { nome: 'Hambúrguer', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['hamburguer', 'hamburguer congelado'], unidadePadrao: 'cx' },
  { nome: 'Nuggets de Frango', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['nuggets', 'empanado de frango'], unidadePadrao: 'cx' },
  { nome: 'Batata Congelada', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['batata congelada', 'batata frita congelada', 'mccain'], unidadePadrao: 'pct' },
  { nome: 'Lasanha Congelada', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['lasanha congelada', 'lasanha bolonhesa congelada'], unidadePadrao: 'un' },
  { nome: 'Gelo', categoria: 'congelados', departamento: 'Congelados', palavrasChave: ['gelo', 'saco de gelo'], unidadePadrao: 'pct' },
];

/**
 * Classifica um produto com base na Tabela de Classificação.
 * Compara o nome informado contra os nomes e palavras-chave da tabela.
 */
export function classificarProdutoPorTabela(nomeItem: string): CategoryId {
  const normalizado = normalizarNome(nomeItem);
  if (!normalizado) return 'outros';

  // 1. Busca exata ou substring no nome principal da tabela
  for (const prod of TABELA_PRODUTOS_CATEGORIAS) {
    const nomeProdNorm = normalizarNome(prod.nome);
    if (normalizado === nomeProdNorm || normalizado.includes(nomeProdNorm)) {
      return prod.categoria;
    }
  }

  // 2. Busca pelas palavras-chave cadastradas na tabela
  // Ordena por comprimento da palavra-chave (as mais específicas primeiro)
  const todasPalavrasChave: { kw: string; cat: CategoryId }[] = [];
  for (const prod of TABELA_PRODUTOS_CATEGORIAS) {
    for (const kw of prod.palavrasChave) {
      todasPalavrasChave.push({ kw: normalizarNome(kw), cat: prod.categoria });
    }
  }

  todasPalavrasChave.sort((a, b) => b.kw.length - a.kw.length);

  for (const item of todasPalavrasChave) {
    if (normalizado.includes(item.kw)) {
      return item.cat;
    }
  }

  return 'outros';
}

export interface GrupoCategoriaSupermercado {
  categoryId: CategoryId;
  category: CategoryInfo;
  items: ShoppingItem[];
  totalItens: number;
  itensComprados: number;
}

/**
 * Ordem canônica dos setores de supermercado para agrupamento lógico.
 */
export const ORDEM_DEPARTAMENTOS_SUPERMERCADO: CategoryId[] = [
  'hortifruti',
  'carnes',
  'laticinios',
  'padaria',
  'mercearia',
  'bebidas',
  'limpeza',
  'higiene',
  'congelados',
  'outros',
];

/**
 * Realiza o agrupamento de uma lista de produtos utilizando a Tabela de Produtos e Categorias.
 * Determina o departamento correspondente a cada item e os agrupa de acordo com a ordem de corredores de supermercado.
 */
export function agruparItensPorTabela(itens: ShoppingItem[]): GrupoCategoriaSupermercado[] {
  if (!itens || itens.length === 0) return [];

  const gruposPorCat: Partial<Record<CategoryId, ShoppingItem[]>> = {};

  for (const item of itens) {
    // Se a categoria do item for válida e diferente de 'outros', usa-a;
    // Caso contrário, consulta dinamicamente a tabela de classificação de produtos.
    let catId: CategoryId = item.category;
    if (!catId || catId === 'outros') {
      catId = classificarProdutoPorTabela(item.name);
    }

    if (!gruposPorCat[catId]) {
      gruposPorCat[catId] = [];
    }
    gruposPorCat[catId]!.push(item);
  }

  const resultado: GrupoCategoriaSupermercado[] = [];

  for (const catId of ORDEM_DEPARTAMENTOS_SUPERMERCADO) {
    const listaItens = gruposPorCat[catId];
    if (listaItens && listaItens.length > 0) {
      const comprados = listaItens.filter(i => i.isBought).length;
      resultado.push({
        categoryId: catId,
        category: CATEGORIES[catId] || CATEGORIES.outros,
        items: listaItens,
        totalItens: listaItens.length,
        itensComprados: comprados,
      });
    }
  }

  return resultado;
}
