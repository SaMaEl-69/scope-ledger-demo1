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
    <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top line: Active Scope Request Selector + Quick Add */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-850">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-full">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Scope Items:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {changeList.map((item) => {
                const isActive = item.id === activeChange.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => switchChangeRequest(item.id)}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-slate-800 text-slate-100 border-indigo-500/50 shadow-sm font-semibold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.referenceId}</span>
                    <span className="hidden sm:inline font-sans font-normal text-slate-400 max-w-[120px] truncate">
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
                        className="ml-1 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity"
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
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 transition-colors whitespace-nowrap"
                title="Create another scope change request for this project"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Scope Request</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden md:flex items-center gap-2">
            <span>Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              {activeChange.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* TRACE 5-Step Pipeline Buttons */}
        <nav className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.key;
            const isCompleted = STEPS.findIndex((s) => s.key === activeStep) > idx;

            return (
              <button
                key={step.key}
                onClick={() => setActiveStep(step.key)}
                className={`group relative text-left p-2 sm:p-2.5 rounded-lg border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border-indigo-500/70 shadow-lg ring-1 ring-indigo-500/20'
                    : isCompleted
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-400'
                }`}
              >
                {/* Step indicator top row */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold font-mono transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isCompleted
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-850 text-slate-400'
                      }`}
                    >
                      {step.letter}
                    </span>
                    <span
                      className={`text-xs font-semibold tracking-tight transition-colors hidden xs:inline ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  <Icon
                    className={`w-3.5 h-3.5 transition-colors hidden sm:block ${
                      isActive ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                </div>

                {/* Subtitle bottom */}
                <div className="text-[10px] text-slate-400 truncate hidden md:block">
                  {step.subtitle}
                </div>

                {/* Active underline indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
