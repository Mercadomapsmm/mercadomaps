'use client';

import React, { useState } from 'react';

interface MercadoListLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MercadoListLogo: React.FC<MercadoListLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20',
  }[size];

  return (
    <div
      id="app-mercado-list-logo"
      className={`relative ${sizeClasses} rounded-2xl overflow-hidden bg-white shadow-md border border-slate-200/90 dark:border-slate-700 shrink-0 flex items-center justify-center p-0.5 select-none transition-transform hover:scale-105 ${className}`}
      title="Lista de Compras"
    >
      {!hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/logo.png"
          alt="Lista de Compras Logo"
          className="w-full h-full object-contain rounded-xl"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        // Vector fallback recreando o visual com precisão
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Raios laranjas radiantes */}
          <g stroke="#F37324" strokeWidth="3.5" strokeLinecap="round">
            <line x1="26" y1="26" x2="20" y2="20" />
            <line x1="36" y1="20" x2="33" y2="13" />
            <line x1="50" y1="18" x2="50" y2="10" />
            <line x1="64" y1="20" x2="67" y2="13" />
            <line x1="74" y1="26" x2="80" y2="20" />
            <line x1="27" y1="74" x2="22" y2="79" />
            <line x1="40" y1="78" x2="38" y2="86" />
            <line x1="50" y1="80" x2="50" y2="89" />
            <line x1="60" y1="78" x2="62" y2="86" />
            <line x1="73" y1="74" x2="78" y2="79" />
          </g>
          {/* Texto Lista de Compras */}
          <text
            x="50"
            y="48"
            textAnchor="middle"
            fill="#E52E2D"
            fontWeight="900"
            fontSize="15"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
          >
            LISTA DE
          </text>
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fill="#1E1E1E"
            fontWeight="700"
            fontSize="14"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            COMPRAS
          </text>
        </svg>
      )}
    </div>
  );
};
