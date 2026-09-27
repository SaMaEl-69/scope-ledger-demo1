'use client';

import React from 'react';
import { CalculationResults, CurrencyCode, OfferType } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MarginMetricsBarProps {
  calculations: CalculationResults;
  currency: CurrencyCode;
  offerType: OfferType;
}

export const MarginMetricsBar: React.FC<MarginMetricsBarProps> = ({
  calculations,
  currency,
  offerType,
}) => {
  const {
    F,
    C,
    D,
    g,
    P,
    currentBaselineMargin,
    absorbedMargin,
    newMargin,
    baselineGrossProfit,
    absorbedGrossProfit,
    newGrossProfit,
    marginErosionPct,
  } = calculations;

  const isAbsorb = offerType === 'absorb';
  const isExchange = offerType === 'exchange';
  const isQuote = offerType === 'quote';

  // Effective resulting margin based on offer
  const activeResultingMargin = isAbsorb ? absorbedMargin : isExchange ? currentBaselineMargin : isQuote ? newMargin : currentBaselineMargin;
  const activeGrossProfit = isAbsorb ? absorbedGrossProfit : isExchange ? baselineGrossProfit : isQuote ? newGrossProfit : baselineGrossProfit;

  const marginDelta = activeResultingMargin - currentBaselineMargin;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Real-Time Margin Engine</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
          <span>Fee (F): <strong className="text-slate-200">{formatCurrency(F, currency)}</strong></span>
          <span>Committed Cost (C): <strong className="text-slate-200">{formatCurrency(C, currency)}</strong></span>
          <span>Net Change Cost (D): <strong className="text-amber-400">{formatCurrency(D, currency)}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
        {/* Baseline State */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/70">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Baseline Margin</span>
            <span className="font-mono text-slate-500">(F - C) / F</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-100 tabular-nums">
              {formatPercent(currentBaselineMargin)}
            </span>
            <span className="font-mono text-xs text-slate-400">
              {formatCurrency(baselineGrossProfit, currency)} profit
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Approved scope health benchmark
          </div>
        </div>

        {/* Absorbed (Worst Case / Courtesy) */}
        <div className={`p-3 rounded-lg border transition-all ${
          isAbsorb ? 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20' : 'bg-slate-950/60 border-slate-800/70'
        }`}>
          <div className="text-[11px] font-medium text-rose-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              If 100% Absorbed
            </span>
            <span className="font-mono text-rose-500/80">-{formatPercent(marginErosionPct)}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
              {formatPercent(absorbedMargin)}
            </span>
            <span className="font-mono text-xs text-rose-300">
              {formatCurrency(absorbedGrossProfit, currency)} profit
            </span>
          </div>
          <div className="mt-1 text-[11px] text-rose-400/80 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            Erodes {formatCurrency(D, currency)} straight out of studio profit
          </div>
        </div>

        {/* Selected Offer Margin */}
        <div className={`p-3 rounded-lg border transition-all ${
          activeResultingMargin >= g
            ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
            : 'bg-amber-950/20 border-amber-500/40'
        }`}>
          <div className="text-[11px] font-medium uppercase tracking-wider flex items-center justify-between">
            <span className={`flex items-center gap-1 ${activeResultingMargin >= g ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeResultingMargin >= g ? <ShieldCheck className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              Result with Current Offer
            </span>
            <span className="font-mono text-xs text-slate-300">
              {isQuote ? `Quoted: ${formatCurrency(P, currency)}` : isExchange ? 'Scope Swap' : isAbsorb ? '$0 Courtesy' : 'Deferred'}
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className={`text-xl font-bold font-mono tabular-nums ${activeResultingMargin >= g ? 'text-emerald-400' : 'text-amber-400'}`}>
              {formatPercent(activeResultingMargin)}
            </span>
            <span className="font-mono text-xs text-slate-300">
              {formatCurrency(activeGrossProfit, currency)} profit
            </span>
          </div>
          <div className="mt-1 text-[11px] flex items-center gap-1 text-slate-400">
            <span>Net shift:</span>
            <span className={`font-mono font-semibold ${marginDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {marginDelta >= 0 ? '+' : ''}{formatPercent(marginDelta)}
            </span>
            <span className="text-slate-500">vs original project baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
