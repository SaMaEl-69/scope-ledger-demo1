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
  Coins,
  Shield,
  Layers,
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
      role: 'Additional Specialist',
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
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
                A
              </span>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Assess the Total Effect
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                Step 3 of 5
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate internal incremental net delivery cost (<span className="font-mono text-indigo-300 font-semibold">D</span>) and determine calendar schedule impact.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium self-start sm:self-auto">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Privacy: Internal Vault Data</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Internal Delivery Vault (8 cols) + Incremental Summary & Timeline (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Internal Labor & Direct Costs Vault */}
        <div className="lg:col-span-8 space-y-5">
          {/* Private Delivery Vault Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Internal Delivery Vault (Private to Studio)
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Never shared with client
              </span>
            </div>

            {/* Labor Lines Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Labor & Specialist Hours Breakdown:
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {totalLaborHours} Total Hours = {formatCurrency(totalLaborCost, settings.currency)}
                </span>
              </div>

              <div className="space-y-2">
                {(activeChange.laborLines || []).map((line) => {
                  const lineTotal = (line.hours || 0) * (line.loadedRate || 0);
                  return (
                    <div
                      key={line.id}
                      className="grid grid-cols-12 gap-2 sm:gap-3 items-center p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs"
                    >
                      <div className="col-span-5 sm:col-span-5">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Role / Task</label>
                        <input
                          type="text"
                          value={line.role}
                          onChange={(e) => handleUpdateLaborLine(line.id, { role: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-medium focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Hours</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={line.hours || ''}
                          onChange={(e) => handleUpdateLaborLine(line.id, { hours: Math.max(0, parseFloat(e.target.value) || 0) })}
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono font-semibold tabular-nums focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-3">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Loaded Rate ($/hr)</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1.5 text-slate-500 font-mono text-[11px]">
                            {settings.currencySymbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={line.loadedRate || ''}
                            onChange={(e) => handleUpdateLaborLine(line.id, { loadedRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                            className="w-full pl-5 pr-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono tabular-nums focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                        <span className="hidden sm:inline font-mono font-bold text-slate-300 text-xs tabular-nums">
                          {formatCurrency(lineTotal, settings.currency)}
                        </span>
                        {(activeChange.laborLines || []).length > 1 && (
                          <button
                            onClick={() => handleRemoveLaborLine(line.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remove line"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add Specialist / Discipline</span>
              </button>
            </div>

            {/* Outside Direct Costs & Deducted Scope */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Outside Costs */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-indigo-400" />
                    Outside Direct Vendor Costs
                  </span>
                  <span className="font-mono text-indigo-300 text-xs">
                    {formatCurrency(activeChange.outsideVendorCosts, settings.currency)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-500 font-mono text-xs">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={activeChange.outsideVendorCosts || ''}
                    onChange={(e) => updateActiveChange({ outsideVendorCosts: Math.max(0, parseFloat(e.target.value) || 0) })}
                    placeholder="0"
                    className="w-full pl-6 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={activeChange.outsideVendorDescription || ''}
                  onChange={(e) => updateActiveChange({ outsideVendorDescription: e.target.value })}
                  placeholder="e.g., Weglot translation plan, custom JS library license"
                  className="w-full px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded text-[11px] text-slate-300 focus:outline-none"
                />
              </div>

              {/* Avoidable Deducted Scope */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Avoidable Scope Deduction
                  </span>
                  <span className="font-mono text-emerald-300 text-xs">
                    -{formatCurrency(activeChange.avoidableRemovableCosts, settings.currency)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-500 font-mono text-xs">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={activeChange.avoidableRemovableCosts || ''}
                    onChange={(e) => updateActiveChange({ avoidableRemovableCosts: Math.max(0, parseFloat(e.target.value) || 0) })}
                    placeholder="0"
                    className="w-full pl-6 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={activeChange.avoidableScopeDescription || ''}
                  onChange={(e) => updateActiveChange({ avoidableScopeDescription: e.target.value })}
                  placeholder="e.g., Scope trade: dropped complex filter animation"
                  className="w-full px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded text-[11px] text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Schedule Impact Input */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Schedule & Timeline Impact
              </h3>
              <span className="text-[11px] text-slate-400">
                Working days added to delivery milestone
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Working Days Added:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={activeChange.scheduleImpactDays || 0}
                    onChange={(e) => updateActiveChange({ scheduleImpactDays: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono font-bold text-slate-200 focus:border-indigo-500 focus:outline-none tabular-nums"
                  />
                  <span className="text-xs text-slate-400">business days</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Timeline Note (appears on Scope Change Brief):
                </label>
                <input
                  type="text"
                  value={activeChange.scheduleNotes || ''}
                  onChange={(e) => updateActiveChange({ scheduleNotes: e.target.value })}
                  placeholder="e.g., Adds 3 working days to final staging delivery; pushes final review from Oct 6 to Oct 9."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Incremental Cost Engine & Rule Check */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800/80">
              Net Incremental Delivery Cost (D)
            </h3>

            {/* Prominent Cost Highlight */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/40 text-center space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                Incremental Cost (D)
              </span>
              <div className="text-3xl font-extrabold font-mono text-indigo-400 tabular-nums">
                {formatCurrency(D, settings.currency)}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Direct studio cost incurred to deliver this change.
              </p>
            </div>

            {/* Exact Cost Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 text-slate-400 border-b border-slate-850">
                <span>Direct Labor Hours:</span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(totalLaborCost, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 border-b border-slate-850">
                <span>Outside Vendor Costs:</span>
                <span className="font-mono text-slate-200">
                  +{formatCurrency(activeChange.outsideVendorCosts, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 border-b border-slate-850">
                <span>Avoidable Scope Deduction:</span>
                <span className="font-mono text-emerald-400">
                  -{formatCurrency(activeChange.avoidableRemovableCosts, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-300 font-semibold pt-1">
                <span>Total Net Incremental (D):</span>
                <span className="font-mono text-indigo-300">
                  {formatCurrency(D, settings.currency)}
                </span>
              </div>
            </div>

            {/* Formula Guard Note */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Mathematical Engine Rule:
              </div>
              <p>
                Sunk costs (<span className="font-mono text-amber-300">A</span>) are never subtracted from <span className="font-mono text-indigo-300">D</span>. This guarantees that unpriced scope cannot cannibalize previously earned profit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Obligation (Step R)</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/25 group"
        >
          <span>Choose Offer Matrix (Step C)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
