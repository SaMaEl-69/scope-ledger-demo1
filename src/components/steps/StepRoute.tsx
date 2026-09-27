'use client';

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RouteType } from '../../types';
import {
  GitBranch,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Bug,
  HelpCircle,
  PlusCircle,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface RouteOption {
  type: RouteType;
  title: string;
  badge: string;
  costToClient: string;
  summary: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  borderActive: string;
  bgActive: string;
  textColor: string;
}

const ROUTE_OPTIONS: RouteOption[] = [
  {
    type: 'included',
    title: 'Included Work',
    badge: 'Contract Scope',
    costToClient: '$0.00 Client Charge',
    summary: 'Deliverable is already covered under the signed agreement or statement of work.',
    description: 'Acknowledge the request, log internal hours to the existing sprint budget, and provide the client with a delivery timeline without issuing a change invoice.',
    icon: CheckCircle2,
    borderActive: 'border-blue-500 ring-1 ring-blue-500/30',
    bgActive: 'bg-blue-950/30',
    textColor: 'text-blue-400',
  },
  {
    type: 'defect',
    title: 'Defect / Rework',
    badge: 'Agency Warranty',
    costToClient: '$0.00 Client Charge',
    summary: 'Execution bug, layout glitch, or failure to meet agreed specification.',
    description: 'Triage as internal quality assurance warranty repair. Absorb labor internally to safeguard studio reputation and build long-term client trust.',
    icon: Bug,
    borderActive: 'border-purple-500 ring-1 ring-purple-500/30',
    bgActive: 'bg-purple-950/30',
    textColor: 'text-purple-400',
  },
  {
    type: 'ambiguous',
    title: 'Ambiguous Scope',
    badge: 'Requires Clarification',
    costToClient: 'Quoting Halted',
    summary: 'Contract boundary is unclear, incomplete, or verbally communicated on Zoom/Slack.',
    description: 'Do not quote or build blindly. Halts automatic quoting to send a structured clarification questionnaire to the client before committing engineering resources.',
    icon: HelpCircle,
    borderActive: 'border-amber-500 ring-1 ring-amber-500/30',
    bgActive: 'bg-amber-950/30',
    textColor: 'text-amber-400',
  },
  {
    type: 'addition',
    title: 'Addition',
    badge: 'True Out-Of-Scope',
    costToClient: 'Commercial Quote Unlocked',
    summary: 'Legitimate new feature, extra pages, reversed approved design, or late-stage request.',
    description: 'Fully unlocks commercial estimation (Step A) and matrix pricing (Step C). Qualifies for custom price floor quote, scope exchange, or Phase 2 backlog deferral.',
    icon: PlusCircle,
    borderActive: 'border-emerald-500 ring-1 ring-emerald-500/30',
    bgActive: 'bg-emerald-950/30',
    textColor: 'text-emerald-400',
  },
];

export const StepRoute: React.FC = () => {
  const {
    activeChange,
    updateActiveChange,
    activeProject,
    nextStep,
    prevStep,
    showToast,
  } = useWorkspace();

  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleRouteChange = (route: RouteType) => {
    // If routing to defect or included, default offer should be absorb
    if (route === 'defect' || route === 'included') {
      updateActiveChange({
        route,
        offerType: 'absorb',
        quotedFee: 0,
      });
    } else if (route === 'addition') {
      updateActiveChange({
        route,
        offerType: 'quote',
      });
    } else {
      updateActiveChange({ route });
    }
  };

  const clarificationSnippet = `Hi ${activeProject.clientName.split(' ')[0] || 'there'},

Regarding the request for "${activeChange.title}": 
Before we schedule engineering resources, we want to ensure complete alignment with your milestone delivery date:

1. Could you confirm whether the content/assets for this are already finalized?
2. Does this replace any existing component from our signed milestone scope, or is it an addition?
3. What is the target date you need this live?

Once clarified, we'll provide the exact timeline and commercial options so we keep the overall launch on schedule!

Warm regards,
Delivery Team`;

  const copyClarificationEmail = () => {
    navigator.clipboard.writeText(clarificationSnippet);
    setCopiedSnippet(true);
    showToast('Clarification email template copied to clipboard', 'success');
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/80 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-md bg-indigo-600/20 dark:bg-indigo-600/30 border border-indigo-500/40 text-indigo-700 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
            R
          </span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
            Route the Obligation
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 font-medium">
            Step 2 of 5
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Determine whether the incoming request is an agreed contractual obligation, an agency bug, an ambiguous boundary, or a genuine commercial addition.
        </p>
      </div>

      {/* Scope Request Description */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Plain-English Scope Description
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Client-Facing (will appear on Scope Change Brief)
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Describe the requested change in clear, objective terms:
          </label>
          <textarea
            rows={3}
            value={activeChange.clientDescription}
            onChange={(e) => updateActiveChange({ clientDescription: e.target.value })}
            placeholder="e.g., Addition of an interactive date-picker booking modal and custom multi-room category filter on the accommodations index page..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* 4 Distinct Route Selection Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2 px-1">
          <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Select Obligation Classification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROUTE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeChange.route === opt.type;

            return (
              <div
                key={opt.type}
                onClick={() => handleRouteChange(opt.type)}
                className={`cursor-pointer rounded-xl p-4 sm:p-5 border transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? `${opt.bgActive} ${opt.borderActive} shadow-lg`
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 ${opt.textColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        {opt.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isSelected ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700' : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}>
                        {opt.badge}
                      </span>
                      <input
                        type="radio"
                        name="routeSelection"
                        checked={isSelected}
                        onChange={() => handleRouteChange(opt.type)}
                        className="accent-indigo-600 dark:accent-indigo-500 w-4 h-4 cursor-pointer ml-1"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-2">
                    {opt.summary}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500 dark:text-slate-400">Impact to Client:</span>
                  <span className={`font-mono font-semibold ${opt.textColor}`}>
                    {opt.costToClient}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Route Context Section */}
      {activeChange.route === 'ambiguous' && (
        <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/40 space-y-4 animate-in fade-in transition-colors">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                Scope Boundary Unclear — Quoting Paused
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                When requests are ambiguous or delivered casually (e.g. over Slack or Zoom), jumping straight into quoting creates conflict later. Send this gentle clarification email first:
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950/80 p-4 rounded-lg border border-amber-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed relative">
            {clarificationSnippet}
            <button
              onClick={copyClarificationEmail}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-sans transition-colors border border-slate-300 dark:border-slate-700"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy Email'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs text-slate-600 dark:text-slate-400">Once clarified, reclassify:</span>
            <button
              onClick={() => handleRouteChange('addition')}
              className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-colors"
            >
              Clarified as True Addition
            </button>
            <button
              onClick={() => handleRouteChange('included')}
              className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/40 border border-blue-300 dark:border-blue-500/40 text-blue-800 dark:text-blue-300 text-xs font-semibold transition-colors"
            >
              Clarified as Included Scope
            </button>
          </div>
        </div>
      )}

      {activeChange.route === 'defect' && (
        <div className="p-5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-300 dark:border-purple-500/40 space-y-3 animate-in fade-in transition-colors">
          <div className="flex items-start gap-3">
            <Bug className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                Agency Quality Assurance Warranty Protocol
              </h4>
              <p className="text-xs text-purple-800/80 dark:text-purple-200/80 leading-relaxed">
                Log the root cause below for studio post-mortem. The client will be invoiced $0.00. You can still track internal remediation hours in Step A to monitor studio QA burn.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-900 dark:text-purple-200 mb-1">
              Internal Root Cause Note (Private studio documentation):
            </label>
            <input
              type="text"
              value={activeChange.defectRootCause || ''}
              onChange={(e) => updateActiveChange({ defectRootCause: e.target.value })}
              placeholder="e.g., CSS touch-action overflow collision with Webflow slider swipe gesture handler"
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-purple-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      )}

      {activeChange.route === 'included' && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-300 dark:border-blue-500/30 flex items-start gap-3 transition-colors">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-200/90 leading-relaxed">
            <strong>Contract Obligation:</strong> This work is already covered by the agreed baseline fee (${activeProject.approvedFee.toLocaleString()}). No additional fee will be quoted to the client. Proceed to Step A to record any internal delivery adjustment.
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/80">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-slate-200 dark:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Baseline (Step T)</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/25 group"
        >
          <span>Assess Delivery Costs (Step A)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
