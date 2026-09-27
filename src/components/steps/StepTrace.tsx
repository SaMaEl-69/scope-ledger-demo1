'use client';

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { MarginGauge } from '../gauges/MarginGauge';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  ArrowRight,
  DollarSign,
  Info,
  Sparkles,
  Building2,
} from 'lucide-react';

export const StepTrace: React.FC = () => {
  const {
    activeProject,
    activeChange,
    updateProject,
    updateActiveChange,
    calculations,
    settings,
    nextStep,
    setPlaybookModalOpen,
  } = useWorkspace();

  const { F, C, g, currentBaselineMargin, baselineGrossProfit } = calculations;

  const handleFeeChange = (val: number) => {
    updateProject(activeProject.id, { approvedFee: Math.max(0, val) });
  };

  const handleIncurredChange = (val: number) => {
    updateProject(activeProject.id, { incurredCosts: Math.max(0, val) });
  };

  const handleRemainingChange = (val: number) => {
    updateProject(activeProject.id, { remainingCosts: Math.max(0, val) });
  };

  const handleTargetMarginChange = (val: number) => {
    updateProject(activeProject.id, { targetMargin: val });
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
              Step 01 / Trace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trace the Agreement
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Lock the signed commercial baseline ($F$), sunk labor costs ($A$), and forecast remaining ($R$) before assessing the incoming request.
          </p>
        </div>

        <button
          onClick={() => setPlaybookModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all shadow-none group"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span>Agency Playbooks</span>
        </button>
      </div>

      {/* Main Grid: Baseline Financials + Project Context + Health Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Baseline Financial Inputs & Project Metadata */}
        <div className="lg:col-span-8 space-y-8">
          {/* Baseline Financials Card */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Agreed Contract Financials
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Baseline equation: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">C = A + R</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Metric Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Approved Fee F */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-700 dark:text-slate-300">
                    Approved Fee (<span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">F</span>)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Contract</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={activeProject.approvedFee || ''}
                    onChange={(e) => handleFeeChange(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-base font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all tabular-nums"
                  />
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleFeeChange(7500)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors"
                  >
                    $7.5k
                  </button>
                  <button
                    onClick={() => handleFeeChange(14500)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors"
                  >
                    $14.5k
                  </button>
                  <button
                    onClick={() => handleFeeChange(22000)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors"
                  >
                    $22k
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Fixed agreed fee excluding pass-through expenses.
                </p>
              </div>

              {/* Incurred Delivery Costs A */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-700 dark:text-slate-300">
                    Sunk Costs (<span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">A</span>)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Incurred</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={activeProject.incurredCosts || ''}
                    onChange={(e) => handleIncurredChange(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-base font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-6">
                  Internal delivery labor consumed to date.
                </p>
              </div>

              {/* Remaining Baseline Costs R */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-700 dark:text-slate-300">
                    Remaining Cost (<span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">R</span>)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Forecast</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={activeProject.remainingCosts || ''}
                    onChange={(e) => handleRemainingChange(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-base font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-6">
                  Forecasted internal cost to deliver original scope.
                </p>
              </div>
            </div>

            {/* Target Margin Slider g */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Studio Target Contribution Margin (<span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">g</span>)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    (Standard: 35% – 50%)
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {formatPercent(g)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.75"
                step="0.01"
                value={g}
                onChange={(e) => handleTargetMarginChange(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 dark:accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% Minimum</span>
                <span>35% Studio Standard</span>
                <span>50% Healthy</span>
                <span>75% Elite</span>
              </div>
            </div>
          </div>

          {/* Project & Scope Context Card */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Project & Scope Context
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Ref: {activeProject.referenceCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  value={activeProject.name}
                  onChange={(e) => updateProject(activeProject.id, { name: e.target.value })}
                  placeholder="e.g., Harbor / Brand & Experience Website"
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Client Organization / Brand
                </label>
                <input
                  type="text"
                  value={activeProject.clientName}
                  onChange={(e) => updateProject(activeProject.id, { clientName: e.target.value })}
                  placeholder="e.g., Harbor Hospitality Group"
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Client Primary Contact Email
                </label>
                <input
                  type="email"
                  value={activeProject.clientEmail || ''}
                  onChange={(e) => updateProject(activeProject.id, { clientEmail: e.target.value })}
                  placeholder="e.g., elena@harborhospitality.co"
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Scope Change Item Title
                </label>
                <input
                  type="text"
                  value={activeChange.title}
                  onChange={(e) => updateActiveChange({ title: e.target.value })}
                  placeholder="e.g., Interactive Room Booking Calendar"
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Baseline Margin Health Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col items-center transition-all">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-full pb-3 border-b border-slate-100 dark:border-slate-800/60">
              Current Baseline Health
            </h3>

            {/* Circular Arc Gauge */}
            <MarginGauge
              margin={currentBaselineMargin}
              targetMargin={g}
              profitAmount={baselineGrossProfit}
              currency={settings.currency}
              size="lg"
              label="Agreed Scope Margin"
              sublabel={`Committed Cost: ${formatCurrency(C, settings.currency)}`}
            />

            {/* Summary List */}
            <div className="w-full space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Total Revenue (F):</span>
                <span className="font-mono font-medium text-slate-900 dark:text-slate-200 tabular-nums">
                  {formatCurrency(F, settings.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Committed Cost (C = A+R):</span>
                <span className="font-mono font-medium text-slate-900 dark:text-slate-200 tabular-nums">
                  {formatCurrency(C, settings.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Baseline Gross Profit:</span>
                <span className={`font-mono font-semibold tabular-nums ${baselineGrossProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatCurrency(baselineGrossProfit, settings.currency)}
                </span>
              </div>
            </div>

            {/* Studio Principle */}
            <div className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-3">
              <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span>
                Always lock the baseline first. If your original project is running below target margin, ScopeLedger calculates a restorative fee to pull the project back to health.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow group"
        >
          <span>Route the Obligation (Step R)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
