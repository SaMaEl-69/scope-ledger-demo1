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
    // val is 0.10 to 0.75
    updateProject(activeProject.id, { targetMargin: val });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Context */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/80 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-600/20 dark:bg-indigo-600/30 border border-indigo-500/40 text-indigo-700 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
                T
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                Trace the Agreement
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 font-medium">
                Step 1 of 5
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Establish the signed commercial baseline ($F$), actual sunk delivery costs ($A$), and remaining committed costs ($R$) before triaging the incoming request.
            </p>
          </div>

          <button
            onClick={() => setPlaybookModalOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 hover:bg-indigo-200 dark:hover:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/30 text-indigo-800 dark:text-indigo-200 text-xs font-semibold transition-all shadow-sm group"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span>Load Agency Playbook Scenario</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Project Metadata + Financial Baseline Inputs + Visual Margin Health Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Metadata & Financial Baseline */}
        <div className="lg:col-span-8 space-y-5">
          {/* Project & Client Card */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Project Agreement Context
              </h3>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Ref: {activeProject.referenceCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={activeProject.name}
                  onChange={(e) => updateProject(activeProject.id, { name: e.target.value })}
                  placeholder="e.g., Harbor / Brand & Experience Website"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Client Organization / Brand
                </label>
                <input
                  type="text"
                  value={activeProject.clientName}
                  onChange={(e) => updateProject(activeProject.id, { clientName: e.target.value })}
                  placeholder="e.g., Harbor Hospitality Group"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Client Primary Contact Email
                </label>
                <input
                  type="email"
                  value={activeProject.clientEmail || ''}
                  onChange={(e) => updateProject(activeProject.id, { clientEmail: e.target.value })}
                  placeholder="e.g., elena@harborhospitality.co"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Scope Change Item Title
                </label>
                <input
                  type="text"
                  value={activeChange.title}
                  onChange={(e) => updateActiveChange({ title: e.target.value })}
                  placeholder="e.g., Interactive Room Booking Calendar"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Baseline Financials Card */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Agreed Contract Baseline Financials
              </h3>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Formula: <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">C = A + R</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Approved Project Fee F */}
              <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Approved Fee (<span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">F</span>)
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Contract Total</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={activeProject.approvedFee || ''}
                    onChange={(e) => handleFeeChange(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors tabular-nums"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleFeeChange(7500)}
                    className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-800"
                  >
                    $7.5k
                  </button>
                  <button
                    onClick={() => handleFeeChange(14500)}
                    className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-800"
                  >
                    $14.5k
                  </button>
                  <button
                    onClick={() => handleFeeChange(22000)}
                    className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-800"
                  >
                    $22k
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Fixed fee excluding taxes and pass-through costs.
                </p>
              </div>

              {/* Incurred Delivery Costs A */}
              <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Incurred Costs (<span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">A</span>)
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Sunk Labor</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={activeProject.incurredCosts || ''}
                    onChange={(e) => handleIncurredChange(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition-colors tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Direct labor & contractor costs consumed to date.
                </p>
              </div>

              {/* Remaining Baseline Costs R */}
              <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Remaining Cost (<span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">R</span>)
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Forecast</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={activeProject.remainingCosts || ''}
                    onChange={(e) => handleRemainingChange(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Forecasted internal cost to finish original scope.
                </p>
              </div>
            </div>

            {/* Target Margin Slider g */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Target Contribution Margin (<span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">g</span>)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    (Standard studio target: 35% – 50%)
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
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>10% Low Margin</span>
                <span>35% Webflow Studio Standard</span>
                <span>50% High Margin</span>
                <span>75% Elite Studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Baseline Margin Health Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col items-center transition-colors">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center w-full pb-2 border-b border-slate-200 dark:border-slate-800/80">
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
            <div className="w-full space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
              <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-400">
                <span>Total Revenue (F):</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200 tabular-nums">
                  {formatCurrency(F, settings.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-400">
                <span>Committed Delivery (C = A+R):</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200 tabular-nums">
                  {formatCurrency(C, settings.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-400">
                <span>Baseline Gross Profit:</span>
                <span className={`font-mono font-bold tabular-nums ${baselineGrossProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatCurrency(baselineGrossProfit, settings.currency)}
                </span>
              </div>
            </div>

            {/* Agency Economic Tip */}
            <div className="w-full p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Studio Principle:</strong> Always lock the baseline first. If your original project is already running below {formatPercent(g)} margin, ScopeLedger will calculate a <em>Restorative Fee</em> to pull the whole project back into health.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-800/80">
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/25 group"
        >
          <span>Route the Obligation (Step R)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
