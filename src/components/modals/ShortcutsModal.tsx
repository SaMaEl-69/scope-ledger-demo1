'use client';

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useWorkspace();

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                TRACE Framework & Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The standard 2-minute decision workflow for boutique studios.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* TRACE 5-Step Methodology Overview */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              The 5 TRACE Steps
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-400 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[11px]">T</span>
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Trace the Agreement:</strong>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">Lock contract baseline fee ($F$), sunk costs ($A$), and forecast remaining ($R$).</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-400 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[11px]">R</span>
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Route the Obligation:</strong>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">Classify into Included, Defect/Rework, Ambiguous Scope, or Commercial Addition.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-600/30 text-amber-700 dark:text-amber-400 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[11px]">A</span>
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Assess the Total Effect:</strong>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">Private delivery cost vault ($D$) + calendar schedule delay in working days.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-600/30 text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[11px]">C</span>
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Choose an Offer:</strong>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">Select Quote (Price Floor), Absorb ($0 courtesy), Exchange (trade), or Defer (Phase 2).</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-400 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[11px]">E</span>
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Evidence the Decision:</strong>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">Client-ready Scope Change Brief PDF export with zero internal rate leaks.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agency Math Golden Rules */}
          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200 leading-relaxed space-y-1">
            <h4 className="font-semibold text-xs text-indigo-700 dark:text-indigo-300">
              Agency Margin Engine Rules:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-800 dark:text-slate-300">Price Floor = D / (1 - g)</strong> guarantees this change achieves your target margin.</li>
              <li><strong className="text-slate-800 dark:text-slate-300">Sunk costs (A)</strong> are NEVER subtracted from incremental change costs (D).</li>
              <li><strong className="text-slate-800 dark:text-slate-300">Privacy Separation:</strong> Internal hourly rates and margin percentages never appear on client documents.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
