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
    <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-all space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
            Real-Time Margin Engine
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
          <span>Fee: <strong className="text-slate-700 dark:text-slate-200">{formatCurrency(F, currency)}</strong></span>
          <span>Cost (C): <strong className="text-slate-700 dark:text-slate-200">{formatCurrency(C, currency)}</strong></span>
          <span>Change Cost (D): <strong className="text-slate-900 dark:text-white font-semibold">{formatCurrency(D, currency)}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Baseline State */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Baseline Margin</span>
            <span className="font-mono text-slate-400">(F - C) / F</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {formatPercent(currentBaselineMargin)}
            </span>
            <span className="font-mono text-xs text-slate-400">
              {formatCurrency(baselineGrossProfit, currency)}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Original project agreement benchmark
          </div>
        </div>

        {/* Absorbed (Worst Case / Courtesy) */}
        <div className={`p-4 sm:p-5 rounded-xl border transition-all space-y-1.5 ${
          isAbsorb ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40 ring-1 ring-rose-500/20' : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60'
        }`}>
          <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              If 100% Absorbed
            </span>
            <span className="font-mono">-{formatPercent(marginErosionPct)}</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
              {formatPercent(absorbedMargin)}
            </span>
            <span className="font-mono text-xs text-rose-700/80 dark:text-rose-300/80">
              {formatCurrency(absorbedGrossProfit, currency)}
            </span>
          </div>
          <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            Erodes {formatCurrency(D, currency)} straight out of studio profit
          </div>
        </div>

        {/* Selected Offer Margin */}
        <div className={`p-4 sm:p-5 rounded-xl border transition-all space-y-1.5 ${
          activeResultingMargin >= g
            ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30'
            : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/30'
        }`}>
          <div className="text-[11px] font-medium uppercase tracking-wider flex items-center justify-between">
            <span className={`flex items-center gap-1.5 ${activeResultingMargin >= g ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {activeResultingMargin >= g ? <ShieldCheck className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              Resulting Margin
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {isQuote ? `Quoted: ${formatCurrency(P, currency)}` : isExchange ? 'Scope Swap' : isAbsorb ? '$0 Courtesy' : 'Deferred'}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className={`text-2xl font-bold font-mono tabular-nums ${activeResultingMargin >= g ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {formatPercent(activeResultingMargin)}
            </span>
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
              {formatCurrency(activeGrossProfit, currency)}
            </span>
          </div>
          <div className="text-[11px] flex items-center gap-1 text-slate-400">
            <span>Net shift:</span>
            <span className={`font-mono font-medium ${marginDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {marginDelta >= 0 ? '+' : ''}{formatPercent(marginDelta)}
            </span>
            <span>vs baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
