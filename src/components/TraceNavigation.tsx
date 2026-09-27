'use client';

import React from 'react';
import { useWorkspace, TraceStep } from '../context/WorkspaceContext';
import {
  Compass,
  GitBranch,
  Calculator,
  SlidersHorizontal,
  FileCheck2,
  Plus,
  Trash2,
} from 'lucide-react';

interface StepMeta {
  key: TraceStep;
  letter: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepMeta[] = [
  {
    key: 'T',
    letter: 'T',
    name: 'Trace',
    subtitle: 'Baseline Agreement',
    icon: Compass,
  },
  {
    key: 'R',
    letter: 'R',
    name: 'Route',
    subtitle: 'Obligation Branch',
    icon: GitBranch,
  },
  {
    key: 'A',
    letter: 'A',
    name: 'Assess',
    subtitle: 'Private Cost Vault',
    icon: Calculator,
  },
  {
    key: 'C',
    letter: 'C',
    name: 'Choose',
    subtitle: 'Commercial Matrix',
    icon: SlidersHorizontal,
  },
  {
    key: 'E',
    letter: 'E',
    name: 'Evidence',
    subtitle: 'Client Scope Brief',
    icon: FileCheck2,
  },
];

export const TraceNavigation: React.FC = () => {
  const {
    activeStep,
    setActiveStep,
    activeProject,
    activeChange,
    createChangeRequest,
    switchChangeRequest,
    deleteChangeRequest,
  } = useWorkspace();

  const changeList = activeProject.changeRequests || [];

  return (
    <div className="bg-slate-100/50 dark:bg-slate-950/40 border-b border-slate-200/70 dark:border-slate-800/60 px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Top line: Active Scope Request Selector + Quick Add */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar max-w-full">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Scope Items
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {changeList.map((item) => {
                const isActive = item.id === activeChange.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => switchChangeRequest(item.id)}
                    className={`group relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{item.referenceId}</span>
                    <span className="hidden sm:inline font-sans font-normal text-slate-400 dark:text-slate-500 max-w-[140px] truncate">
                      • {item.title}
                    </span>
                    {changeList.length > 1 && isActive && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete scope request "${item.referenceId}"?`)) {
                            deleteChangeRequest(item.id);
                          }
                        }}
                        className="ml-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="Delete this change request"
                      >
                        <Trash2 className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => createChangeRequest('New Scope Adjustment')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
                title="Create another scope change request for this project"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Scope Request</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden md:flex items-center gap-2">
            <span>Status:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800">
              {activeChange.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* TRACE 5-Step Pipeline Navigation */}
        <nav className="grid grid-cols-5 gap-2 bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.key;
            const isCompleted = STEPS.findIndex((s) => s.key === activeStep) > idx;

            return (
              <button
                key={step.key}
                onClick={() => setActiveStep(step.key)}
                className={`group relative text-left py-2 px-2.5 sm:px-3.5 rounded-xl transition-all duration-150 flex flex-col justify-between ${
                  isActive
                    ? 'bg-white dark:bg-slate-850 shadow-sm border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Step indicator top row */}
                <div className="flex items-center justify-between w-full mb-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold font-mono transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {step.letter}
                    </span>
                    <span
                      className={`text-xs font-medium tracking-tight transition-colors hidden sm:inline ${
                        isActive
                          ? 'text-slate-900 dark:text-white font-semibold'
                          : isCompleted
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  <Icon
                    className={`w-3.5 h-3.5 transition-colors hidden md:block ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'
                    }`}
                  />
                </div>

                {/* Subtitle bottom */}
                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate hidden lg:block">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
