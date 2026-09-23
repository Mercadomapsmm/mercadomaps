'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Algo deu errado!</h2>
      <p className="text-slate-600 mb-6">Ocorreu um erro ao carregar o aplicativo.</p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow transition-colors cursor-pointer"
      >
        Tentar novamente
      </button>
    </div>
  );
}
