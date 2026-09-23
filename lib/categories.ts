import { CategoryId, CategoryInfo, UnitType } from '@/types/shopping';
import { classificarProdutoPorTabela } from './productTable';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  hortifruti: {
    id: 'hortifruti',
    name: 'Hortifrúti',
    icon: '🍎',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  padaria: {
    id: 'padaria',
    name: 'Padaria & Massas',
    icon: '🥖',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  carnes: {
    id: 'carnes',
    name: 'Carnes & Peixes',
    icon: '🥩',
    color: 'text-rose-700 dark:text-rose-300',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
  },
  laticinios: {
    id: 'laticinios',
    name: 'Laticínios & Ovos',
    icon: '🥛',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  mercearia: {
    id: 'mercearia',
    name: 'Mercearia & Grãos',
    icon: '🌾',
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-50 dark:bg-orange-950/40',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  bebidas: {
    id: 'bebidas',
    name: 'Bebidas',
    icon: '🥤',
    color: 'text-cyan-700 dark:text-cyan-300',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
  },
  limpeza: {
    id: 'limpeza',
    name: 'Limpeza da Casa',
    icon: '🧹',
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  higiene: {
    id: 'higiene',
    name: 'Higiene & Cuidados',
    icon: '🧴',
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  congelados: {
    id: 'congelados',
    name: 'Congelados',
    icon: '❄️',
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
  outros: {
    id: 'outros',
    name: 'Outros',
    icon: '📦',
    color: 'text-slate-700 dark:text-slate-300',
    bgColor: 'bg-slate-50 dark:bg-slate-900/40',
    borderColor: 'border-slate-200 dark:border-slate-800',
  },
};

export const UNIT_OPTIONS: { value: UnitType; label: string; fullLabel: string }[] = [
  { value: 'un', label: 'un', fullLabel: 'Unidade(s)' },
  { value: 'kg', label: 'kg', fullLabel: 'Quilo(s)' },
  { value: 'g', label: 'g', fullLabel: 'Grama(s)' },
  { value: 'L', label: 'L', fullLabel: 'Litro(s)' },
  { value: 'ml', label: 'ml', fullLabel: 'Mililitro(s)' },
  { value: 'pct', label: 'pct', fullLabel: 'Pacote(s)' },
  { value: 'cx', label: 'cx', fullLabel: 'Caixa(s)' },
  { value: 'dz', label: 'dz', fullLabel: 'Dúzia(s)' },
  { value: 'garrafa', label: 'gf', fullLabel: 'Garrafa(s)' },
  { value: 'lata', label: 'lt', fullLabel: 'Lata(s)' },
];

export const QUICK_ADD_ITEMS = [
  { name: 'Arroz', category: 'mercearia' as CategoryId, unit: 'pct' as UnitType, quantity: 1 },
  { name: 'Feijão', category: 'mercearia' as CategoryId, unit: 'kg' as UnitType, quantity: 1 },
  { name: 'Leite', category: 'laticinios' as CategoryId, unit: 'L' as UnitType, quantity: 2 },
  { name: 'Café', category: 'mercearia' as CategoryId, unit: 'pct' as UnitType, quantity: 1 },
  { name: 'Ovos', category: 'laticinios' as CategoryId, unit: 'dz' as UnitType, quantity: 1 },
  { name: 'Pão francês', category: 'padaria' as CategoryId, unit: 'un' as UnitType, quantity: 6 },
  { name: 'Açúcar', category: 'mercearia' as CategoryId, unit: 'kg' as UnitType, quantity: 1 },
  { name: 'Óleo', category: 'mercearia' as CategoryId, unit: 'garrafa' as UnitType, quantity: 1 },
  { name: 'Banana', category: 'hortifruti' as CategoryId, unit: 'dz' as UnitType, quantity: 1 },
  { name: 'Tomate', category: 'hortifruti' as CategoryId, unit: 'kg' as UnitType, quantity: 1 },
  { name: 'Batata', category: 'hortifruti' as CategoryId, unit: 'kg' as UnitType, quantity: 1 },
  { name: 'Cebola', category: 'hortifruti' as CategoryId, unit: 'kg' as UnitType, quantity: 1 },
  { name: 'Frango', category: 'carnes' as CategoryId, unit: 'kg' as UnitType, quantity: 1 },
  { name: 'Detergente', category: 'limpeza' as CategoryId, unit: 'un' as UnitType, quantity: 2 },
  { name: 'Sabão em pó', category: 'limpeza' as CategoryId, unit: 'cx' as UnitType, quantity: 1 },
  { name: 'Papel higiênico', category: 'higiene' as CategoryId, unit: 'pct' as UnitType, quantity: 1 },
  { name: 'Creme dental', category: 'higiene' as CategoryId, unit: 'un' as UnitType, quantity: 1 },
];

// Helper to normalize strings (remove accents, lowercase, trim)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Helper to auto-categorize an item name in Portuguese using standard supermarket departments
export function detectCategory(name: string): CategoryId {
  // Consulta a tabela oficial de classificação de produtos
  const daTabela = classificarProdutoPorTabela(name);
  if (daTabela && daTabela !== 'outros') {
    return daTabela;
  }

  const n = normalizeText(name);
  if (!n) return 'outros';

  // Specific high-priority multi-word or compound matches
  if (
    n.includes('pao de queijo') ||
    n.includes('pao de alho') ||
    n.includes('pao de forma') ||
    n.includes('pao frances') ||
    n.includes('pao integral') ||
    n.includes('massa de pastel') ||
    n.includes('massa de pizza')
  ) {
    return 'padaria';
  }

  if (
    n.includes('creme de leite') ||
    n.includes('leite condensado') ||
    n.includes('leite em po') ||
    n.includes('leite integral') ||
    n.includes('leite desnatado') ||
    n.includes('queijo prato') ||
    n.includes('queijo minas') ||
    n.includes('queijo coalho')
  ) {
    return 'laticinios';
  }

  if (
    n.includes('carne moida') ||
    n.includes('peito de frango') ||
    n.includes('file de frango') ||
    n.includes('file mignon') ||
    n.includes('coxa de frango') ||
    n.includes('coracao de galinha')
  ) {
    return 'carnes';
  }

  if (
    n.includes('sabao em po') ||
    n.includes('sabao liquido') ||
    n.includes('agua sanitaria') ||
    n.includes('saco de lixo') ||
    n.includes('pano de prato') ||
    n.includes('pano de chao') ||
    n.includes('palha de aco')
  ) {
    return 'limpeza';
  }

  if (
    n.includes('papel higienico') ||
    n.includes('pasta de dente') ||
    n.includes('creme dental') ||
    n.includes('escova de dente') ||
    n.includes('fio dental') ||
    n.includes('lenco umedecido') ||
    n.includes('alcool em gel')
  ) {
    return 'higiene';
  }

  if (
    n.includes('agua de coco') ||
    n.includes('agua mineral') ||
    n.includes('agua com gas')
  ) {
    return 'bebidas';
  }

  if (
    n.includes('extrato de tomate') ||
    n.includes('molho de tomate') ||
    n.includes('azeite de oliva') ||
    n.includes('grao de bico') ||
    n.includes('amido de milho') ||
    n.includes('farinha de trigo') ||
    n.includes('farinha de mandioca')
  ) {
    return 'mercearia';
  }

  const rules: { cat: CategoryId; keywords: string[] }[] = [
    {
      cat: 'congelados',
      keywords: [
        'sorvete', 'picole', 'acai', 'gelo', 'pizza', 'hamburguer', 'nuggets',
        'empanado', 'congelad', 'batata congelada', 'polpa de fruta', 'lasanha congelada'
      ],
    },
    {
      cat: 'carnes',
      keywords: [
        'carne', 'frango', 'bife', 'peixe', 'linguica', 'salsicha', 'patinho',
        'alcatra', 'costela', 'picanha', 'moida', 'file', 'coxa', 'sobrecoxa',
        'porco', 'lombo', 'bacon', 'camarao', 'salmao', 'tilapia', 'pernil',
        'bisteca', 'maminha', 'acem', 'fraldinha', 'cupim', 'musculo', 'lagarto',
        'coxao', 'asa', 'tulipa', 'galeto', 'peru', 'chester', 'panceta',
        'torresmo', 'calabresa', 'toscana', 'bacalhau', 'sardinha', 'pescada',
        'merluza', 'polvo', 'lula', 'marisco', 'caranguejo', 'lagosta', 'siri'
      ],
    },
    {
      cat: 'hortifruti',
      keywords: [
        'banana', 'maca', 'laranja', 'limao', 'uva', 'abacaxi', 'mamao',
        'tomate', 'cebola', 'alho', 'batata', 'cenoura', 'alface', 'rucula',
        'cheiro verde', 'coentro', 'couve', 'manga', 'pera', 'melancia',
        'melao', 'abacate', 'chuchu', 'abobrinha', 'mandioca', 'aipim',
        'macaxeira', 'fruta', 'legume', 'verdura', 'hortalica', 'morango',
        'maracuja', 'pessego', 'ameixa', 'goiaba', 'kiwi', 'caqui', 'coco',
        'cereja', 'jabuticaba', 'caju', 'figo', 'tangerina', 'mexerica',
        'bergamota', 'beterraba', 'berinjela', 'pimentao', 'pepino', 'quiabo',
        'jilo', 'vagem', 'abobora', 'inhame', 'cara', 'agriao', 'espinafre',
        'repolho', 'brocolis', 'couve-flor', 'acelga', 'chicoria', 'salsinha',
        'cebolinha', 'manjericao', 'hortela', 'alecrim', 'oregano', 'gengibre',
        'alho poro', 'rabanete'
      ],
    },
    {
      cat: 'laticinios',
      keywords: [
        'leite', 'queijo', 'manteiga', 'iogurte', 'requeijao', 'creme de leite',
        'mussarela', 'mozarela', 'prato', 'ricota', 'parmesao', 'nata',
        'ovo', 'ovos', 'margarina', 'provolone', 'gorgonzola', 'brie', 'gouda',
        'cheddar', 'catupiry', 'cream cheese', 'danone', 'yakult', 'coalhada'
      ],
    },
    {
      cat: 'padaria',
      keywords: [
        'pao', 'biscoito', 'bolacha', 'bolo', 'torrada', 'croissant',
        'baguete', 'brioche', 'massa', 'macarrao', 'lasanha', 'espaguete',
        'penne', 'talharim', 'miojo', 'ramen', 'lamen', 'farinha de trigo',
        'fermento', 'torta', 'sonho', 'rosca', 'cookies', 'wafer', 'rosquinha',
        'bisnaga', 'broa', 'ciabatta', 'capeletti', 'ravioli', 'nhoque'
      ],
    },
    {
      cat: 'bebidas',
      keywords: [
        'agua', 'refrigerante', 'suco', 'cerveja', 'vinho', 'cha',
        'energetico', 'coca-cola', 'coca', 'guarana', 'fanta', 'sprite',
        'pepsi', 'vodka', 'whisky', 'gin', 'cachaca', 'rum', 'chopp',
        'espumante', 'nectar', 'isotonico', 'gatorade', 'red bull', 'monster'
      ],
    },
    {
      cat: 'limpeza',
      keywords: [
        'detergente', 'sabao', 'amaciante', 'desinfetante', 'agua sanitaria',
        'candida', 'cloro', 'esponja', 'bombril', 'palha de aco', 'limpador',
        'multiuso', 'veja', 'saco de lixo', 'vassoura', 'rodo', 'pano de chao',
        'lustra moveis', 'desengordurante', 'alvejante', 'vanish', 'limpa vidro',
        'saponaceo', 'balde', 'bacia', 'prendedor', 'pregador', 'desentupidor',
        'aromatizador', 'odorizador'
      ],
    },
    {
      cat: 'higiene',
      keywords: [
        'sabonete', 'shampoo', 'xampu', 'condicionador', 'creme dental',
        'pasta de dente', 'escova de dente', 'desodorante', 'papel higienico',
        'absorvente', 'fio dental', 'lamina', 'barbeador', 'hidratante',
        'algodao', 'cotonete', 'alcool', 'mascara capilar', 'enxaguante',
        'listerine', 'fralda', 'lenco umedecido', 'protetor solar', 'repelente',
        'gillette', 'esmalte', 'acetona'
      ],
    },
    {
      cat: 'mercearia',
      keywords: [
        'arroz', 'feijao', 'cafe', 'acucar', 'oleo', 'azeite', 'sal',
        'vinagre', 'molho', 'extrato', 'milho', 'ervilha', 'atum',
        'sardinha', 'aveia', 'granola', 'achocolatado', 'nescau', 'toddy',
        'maionese', 'ketchup', 'mostarda', 'farinha', 'amido', 'fuba',
        'lentilha', 'grao de bico', 'adocante', 'pimenta', 'cominho',
        'colorau', 'paprica', 'curry', 'canela', 'cravo', 'shoyu',
        'barbecue', 'azeitona', 'palmito', 'champignon', 'cogumelo',
        'cereal', 'sucrilhos', 'chocolate', 'bombom', 'gelatina', 'pudim',
        'farofa', 'maizena', 'pipoca', 'canjica', 'quinoa', 'chia',
        'castanha', 'amendoim', 'nozes', 'uva passa', 'mel', 'geleia'
      ],
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some(k => n.includes(k))) {
      return rule.cat;
    }
  }

  return 'outros';
}
