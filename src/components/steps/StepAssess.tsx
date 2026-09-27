'use client';

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { LaborRateLine } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Shield,
} from 'lucide-react';

export const StepAssess: React.FC = () => {
  const {
    activeChange,
    updateActiveChange,
    calculations,
    settings,
    nextStep,
    prevStep,
  } = useWorkspace();

  const { D } = calculations;

  // Add new labor line
  const handleAddLaborLine = () => {
    const newLine: LaborRateLine = {
      id: 'l-' + Date.now(),
      role: 'Specialist Engineer',
      hours: 2,
      loadedRate: settings.defaultDevRate || 95,
    };
    const currentLines = activeChange.laborLines || [];
    updateActiveChange({ laborLines: [...currentLines, newLine] });
  };

  // Update a labor line
  const handleUpdateLaborLine = (id: string, partial: Partial<LaborRateLine>) => {
    const updated = (activeChange.laborLines || []).map((line) => {
      if (line.id === id) {
        return { ...line, ...partial };
      }
      return line;
    });
    updateActiveChange({ laborLines: updated });
  };

  // Remove a labor line
  const handleRemoveLaborLine = (id: string) => {
    const currentLines = activeChange.laborLines || [];
    if (currentLines.length <= 1) return;
    updateActiveChange({
      laborLines: currentLines.filter((l) => l.id !== id),
    });
  };

  // Total labor cost
  const totalLaborCost = (activeChange.laborLines || []).reduce(
    (sum, line) => sum + (line.hours || 0) * (line.loadedRate || 0),
    0
  );
  const totalLaborHours = (activeChange.laborLines || []).reduce(
    (sum, line) => sum + (Number(line.hours) || 0),
    0
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
              Step 03 / Assess
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Assess the Total Effect
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Calculate internal incremental net delivery cost (<span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">D</span>) and project timeline impact.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium self-start sm:self-auto">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Internal Delivery Vault (Strictly Private)</span>
        </div>
      </div>

      {/* Main Grid: Internal Delivery Vault (8 cols) + Incremental Summary & Timeline (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Internal Labor & Direct Costs Vault */}
        <div className="lg:col-span-8 space-y-8">
          {/* Private Delivery Vault Card */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Internal Labor Breakdown
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Loaded hourly rates and hours are hidden from client deliverables.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {totalLaborHours} hrs • {formatCurrency(totalLaborCost, settings.currency)}
              </span>
            </div>

            {/* Labor Lines Table */}
            <div className="space-y-3">
              <div className="space-y-2.5">
                {(activeChange.laborLines || []).map((line) => {
                  const lineTotal = (line.hours || 0) * (line.loadedRate || 0);
                  return (
                    <div
                      key={line.id}
                      className="grid grid-cols-12 gap-3 items-center p-3 sm:p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 text-xs transition-colors"
                    >
                      <div className="col-span-5 sm:col-span-5">
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Role / Specialty</label>
                        <input
                          type="text"
                          value={line.role}
                          onChange={(e) => handleUpdateLaborLine(line.id, { role: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-2">
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Hours</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={line.hours || ''}
                          onChange={(e) => handleUpdateLaborLine(line.id, { hours: Math.max(0, parseFloat(e.target.value) || 0) })}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 font-mono font-semibold tabular-nums focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-3">
                        <label className="block text-[10px] text-slate-400 mb-1 font-medium">Loaded Rate ($/hr)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-slate-400 font-mono text-[11px]">
                            {settings.currencySymbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={line.loadedRate || ''}
                            onChange={(e) => handleUpdateLaborLine(line.id, { loadedRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                            className="w-full pl-6 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 font-mono tabular-nums focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-4 sm:pt-0">
                        <span className="hidden sm:inline font-mono font-medium text-slate-700 dark:text-slate-300 text-xs tabular-nums">
                          {formatCurrency(lineTotal, settings.currency)}
                        </span>
                        {(activeChange.laborLines || []).length > 1 && (
                          <button
                            onClick={() => handleRemoveLaborLine(line.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
                            title="Remove role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleAddLaborLine}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Team Specialist Role</span>
              </button>
            </div>

            {/* Outside Costs & Deductions Row */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Outside Vendor Costs */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Outside Vendor Costs
                  </label>
                  <span className="text-[10px] text-slate-400">Direct Pass-Through</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={activeChange.outsideVendorCosts || ''}
                    onChange={(e) => updateActiveChange({ outsideVendorCosts: Math.max(0, parseFloat(e.target.value) || 0) })}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all tabular-nums"
                  />
                </div>
                <input
                  type="text"
                  value={activeChange.outsideVendorDescription || ''}
                  onChange={(e) => updateActiveChange({ outsideVendorDescription: e.target.value })}
                  placeholder="e.g., Commercial Typeface web license or 3D asset"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Avoidable Removable Costs */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Avoidable Deductions
                  </label>
                  <span className="text-[10px] text-slate-400">Scope Subtraction</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={activeChange.avoidableRemovableCosts || ''}
                    onChange={(e) => updateActiveChange({ avoidableRemovableCosts: Math.max(0, parseFloat(e.target.value) || 0) })}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all tabular-nums"
                  />
                </div>
                <input
                  type="text"
                  value={activeChange.avoidableScopeDescription || ''}
                  onChange={(e) => updateActiveChange({ avoidableScopeDescription: e.target.value })}
                  placeholder="e.g., Unbuilt feature traded out to offset labor"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Schedule Impact Card */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Schedule & Milestone Timeline Impact
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Working days added
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Business Days Added:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={activeChange.scheduleImpactDays || 0}
                    onChange={(e) => updateActiveChange({ scheduleImpactDays: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-24 px-3 py-2 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-slate-200 focus:border-indigo-500 focus:outline-none tabular-nums"
                  />
                  <span className="text-xs text-slate-500">days</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Client Timeline Note (appears on Scope Change Brief):
                </label>
                <input
                  type="text"
                  value={activeChange.scheduleNotes || ''}
                  onChange={(e) => updateActiveChange({ scheduleNotes: e.target.value })}
                  placeholder="e.g., Adds 3 working days to final staging delivery; pushes final review from Oct 6 to Oct 9."
                  className="w-full px-3.5 py-2 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Incremental Cost Engine */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-all">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-full pb-3 border-b border-slate-100 dark:border-slate-800/60">
              Net Incremental Cost (D)
            </h3>

            {/* Prominent Cost Highlight */}
            <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-center space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                Incremental Delivery Cost
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatCurrency(D, settings.currency)}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Direct studio cost incurred to deliver this change.
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-850">
                <span>Direct Labor:</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">
                  {formatCurrency(totalLaborCost, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-850">
                <span>Outside Vendor Costs:</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">
                  +{formatCurrency(activeChange.outsideVendorCosts, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-850">
                <span>Avoidable Deductions:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  -{formatCurrency(activeChange.avoidableRemovableCosts, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-800 dark:text-slate-200 font-semibold pt-1">
                <span>Total Net Incremental (D):</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(D, settings.currency)}
                </span>
              </div>
            </div>

            {/* Formula Guard Note */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                Mathematical Engine Rule:
              </div>
              <p>
                Sunk costs (<span className="font-mono text-amber-600 dark:text-amber-400 font-medium">A</span>) are never subtracted from <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium">D</span>. This guarantees that unpriced scope cannot cannibalize previously earned profit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-slate-200/80 dark:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Obligation (Step R)</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow group"
        >
          <span>Choose Offer Matrix (Step C)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
