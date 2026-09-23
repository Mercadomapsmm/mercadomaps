import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Página não encontrada</h2>
      <p className="text-slate-600 mb-6">A página que você procura não existe ou foi removida.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow transition-colors"
      >
        Voltar para a Lista de Compras
      </Link>
    </div>
  );
}
