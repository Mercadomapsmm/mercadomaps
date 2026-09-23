import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { parseSpokenShoppingText } from '@/lib/speech';

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  let transcript = '';
  try {
    const body = await req.json();
    transcript = typeof body?.transcript === 'string' ? body.transcript : '';

    if (!transcript) {
      return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
    }

    const ai = getAI();

    // Se a chave GEMINI_API_KEY não estiver configurada no projeto, usamos o parser local robusto sem falhas
    if (!ai) {
      const localItems = parseSpokenShoppingText(transcript);
      return NextResponse.json({ items: localItems, source: 'local' });
    }

    const prompt = `Analise a seguinte transcrição ou frase falada pelo usuário em português do Brasil e extraia os itens para uma lista de compras de supermercado/doméstica.

Identifique:
- "name": Nome limpo e normalizado do item (em português, capitalizado, ex: "Arroz agulhinha", "Leite integral", "Detergente de coco").
- "quantity": Número decimal ou inteiro (ex: 1, 2, 0.5, 6). Se não especificado, use 1.
- "unit": Escolha estritamente entre: "un", "kg", "g", "L", "ml", "pct", "cx", "dz", "lata", "garrafa".
- "category": Escolha estritamente entre: "hortifruti", "carnes", "laticinios", "mercearia", "padaria", "bebidas", "limpeza", "higiene", "congelados", "outros".
- "estimatedPrice": Preço numérico em reais se mencionado na fala (ex: 45, 12.50, 9.90). Se não mencionado, não inclua ou use null.

Texto do usuário: "${transcript}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: 'Nome limpo do produto alimentício ou doméstico',
                  },
                  quantity: {
                    type: Type.NUMBER,
                    description: 'Quantidade numérica do item',
                  },
                  unit: {
                    type: Type.STRING,
                    description: 'Unidade de medida: un, kg, g, L, ml, pct, cx, dz, lata, garrafa',
                  },
                  category: {
                    type: Type.STRING,
                    description: 'Categoria do item no supermercado',
                  },
                  estimatedPrice: {
                    type: Type.NUMBER,
                    description: 'Preço numérico em Reais se mencionado',
                  },
                },
                required: ['name', 'quantity', 'unit', 'category'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    const rawJson = response.text?.trim() || '{"items":[]}';
    const parsed = JSON.parse(rawJson);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erro ao processar comando';
    console.warn('Aviso no parser Gemini, utilizando fallback local:', errorMsg);
    try {
      const fallbackItems = parseSpokenShoppingText(transcript);
      return NextResponse.json({ items: fallbackItems, fallback: true });
    } catch {
      return NextResponse.json({ items: [] });
    }
  }
}
