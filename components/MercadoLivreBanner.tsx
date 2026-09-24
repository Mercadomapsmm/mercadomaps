'use client';

import React from 'react';
import { ExternalLink, Zap, Star, Truck } from 'lucide-react';

interface MercadoLivreBannerProps {
  position?: 'top' | 'bottom';
  internalName?:
    | 'bans-01'
    | 'bans-02'
    | 'bans-03'
    | 'bans-04'
    | 'bans-05'
    | 'bani-01'
    | 'bani-02'
    | 'bani-03'
    | 'bani-04'
    | 'bani-05'
    | string;
  highContrast?: boolean;
  hidden?: boolean;
  className?: string;
}

export const MercadoLivreBanner: React.FC<MercadoLivreBannerProps> = ({
  position = 'top',
  internalName,
  highContrast = false,
  hidden = false,
  className = '',
}) => {
  // Nome interno atribuído: bans-01..05 ou bani-01..05
  const bannerInternalName = internalName || (position === 'top' ? 'bans-01' : 'bani-01');
  const isBansVariant = bannerInternalName.startsWith('bans-');

  const product = isBansVariant
    ? {
        id: bannerInternalName,
        title: 'Jogo De Panelas Cerâmico Antiaderente Indução 10 Peças',
        image: 'https://http2.mlstatic.com/D_NQ_NP_713526-MLA96104001241_102025-O.webp',
        fallbackImage: '/images/panelas_mercadolivre.webp',
        discount: '-16%',
        badge: 'Loja Oficial',
        rating: '4.9',
        oldPrice: 'R$ 549,90',
        price: 'R$ 458,71',
        installments: '12x R$ 44,36',
        link: 'https://meli.la/2tHby1Y',
        ariaLabel: 'Anúncio Mercado Livre: Jogo De Panelas Cerâmico Antiaderente Indução 10 Peças em Oferta',
      }
    : {
        id: bannerInternalName,
        title: 'Honeywhale B20 Bicicleta Elétrica Dobrável Aro 14',
        image: 'https://http2.mlstatic.com/D_NQ_NP_603508-MLA113190607451_062026-O.webp',
        fallbackImage: '/images/bicicleta_mercadolivre.webp',
        discount: '-48%',
        badge: 'Loja Oficial',
        rating: '4.9',
        oldPrice: 'R$ 4.665,00',
        price: 'R$ 2.399,00',
        installments: '10x R$ 239,90 sem juros',
        link: 'https://meli.la/27P4vH9',
        ariaLabel: 'Anúncio Mercado Livre: Bicicleta Elétrica Honeywhale B20 em Oferta',
      };

  return (
    <div
      id={bannerInternalName}
      data-banner-id={bannerInternalName}
      data-internal-name={bannerInternalName}
      aria-label={product.ariaLabel}
      aria-hidden={hidden ? 'true' : undefined}
      style={hidden ? { display: 'none' } : undefined}
      className={`${hidden ? 'hidden ' : ''}w-full rounded-xl overflow-hidden border transition-all animate-gentle-blink ${
        highContrast
          ? 'bg-black text-white border-2 border-yellow-400'
          : 'bg-white dark:bg-slate-900 border-[#FFE600] dark:border-amber-500/40 shadow-xs hover:shadow-sm'
      } ${className}`}
    >
      {/* Mercado Livre Compact Header Strip */}
      <div className="bg-[#FFE600] text-[#2D3277] px-3 py-1.5 flex items-center justify-between gap-2 font-bold text-[10px] sm:text-xs">
        <div className="flex items-center gap-2">
          {/* Logo Original Oficial do Mercado Livre */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo_mercadolivre@2x.png"
            alt="Mercado Livre"
            className="h-4 sm:h-5 w-auto object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.92/mercadolibre/logo__large_plus.png';
            }}
          />
          <span className="hidden sm:inline text-[#2D3277]/40">|</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 text-[#2D3277] bg-white/70 px-1.5 py-0.5 rounded text-[10px] font-extrabold animate-pulse">
            <Zap className="w-2.5 h-2.5 fill-[#2D3277] text-[#2D3277]" />
            OFERTA DO DIA
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px]">
          <span className="flex items-center gap-0.5 text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-full font-black">
            <Truck className="w-2.5 h-2.5" />
            FRETE GRÁTIS
          </span>
          <span className="text-emerald-900 font-black italic">
            <span className="text-[#00A650] font-black mr-0.5">⚡</span>FULL
          </span>
        </div>
      </div>

      {/* Main Banner Compact Body */}
      <div className="p-2 sm:p-2.5 flex items-center gap-2.5 sm:gap-3.5">
        {/* Product Thumbnail */}
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover sm:object-contain p-0.5 transition-transform duration-200 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = product.fallbackImage;
            }}
          />
          <div className="absolute top-1 left-1 bg-[#FF7733] text-white text-[8px] font-black px-1 rounded uppercase">
            {product.discount}
          </div>
        </a>

        {/* Product Details Compact */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
              {product.badge}
            </span>
            <div className="flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <h3
              className={`font-bold text-xs sm:text-sm truncate group-hover:text-[#3483FA] transition-colors ${
                highContrast ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
              title={product.title}
            >
              {product.title}
            </h3>
          </a>

          <div className="flex items-baseline gap-1.5 flex-wrap text-xs">
            <span className="text-[10px] text-slate-400 line-through">{product.oldPrice}</span>
            <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
              {product.price}
            </span>
            <span className="text-[10px] font-bold text-[#00A650] hidden sm:inline">
              {product.installments}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center">
          <a
            id={`buy-ml-btn-${bannerInternalName}-${position}`}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#3483FA] hover:bg-[#2968c8] text-white font-black text-xs transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            <span>Ver no ML</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
