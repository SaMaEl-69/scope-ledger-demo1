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
    <div className="space-y-8 sm:space-y-10">
      {/* Intro Header */}
      <div className="space-y-1.5 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
            Step 02 / Route
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Route the Obligation
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Determine whether the incoming request is an agreed contractual obligation, an agency bug, an ambiguous boundary, or a genuine commercial addition.
        </p>
      </div>

      {/* Scope Request Description */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Scope Description
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Client-Facing (will appear on Scope Change Brief)
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            Describe the requested change in clear, objective terms:
          </label>
          <textarea
            rows={3}
            value={activeChange.clientDescription}
            onChange={(e) => updateActiveChange({ clientDescription: e.target.value })}
            placeholder="e.g., Addition of an interactive date-picker booking modal and custom multi-room category filter on the accommodations index page..."
            className="w-full px-4 py-3 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
          />
        </div>
      </div>

      {/* 4 Distinct Route Selection Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <GitBranch className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Select Obligation Classification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ROUTE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeChange.route === opt.type;

            return (
              <div
                key={opt.type}
                onClick={() => handleRouteChange(opt.type)}
                className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-850 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-base text-slate-900 dark:text-slate-100">
                        {opt.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {opt.badge}
                      </span>
                      <input
                        type="radio"
                        name="routeSelection"
                        checked={isSelected}
                        onChange={() => handleRouteChange(opt.type)}
                        className="accent-indigo-600 w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-2 leading-relaxed">
                    {opt.summary}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Impact to Client:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
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
        <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-500/30 space-y-4 transition-all">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Scope Boundary Unclear — Quoting Paused
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                When requests are ambiguous or delivered informally over Slack/calls, jumping straight into quoting creates misunderstandings. Send this gentle clarification email first:
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950/80 p-5 rounded-xl border border-amber-200/60 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed relative">
            {clarificationSnippet}
            <button
              onClick={copyClarificationEmail}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-sans transition-colors border border-slate-200 dark:border-slate-700"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy Email'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs text-slate-600 dark:text-slate-400">Once clarified:</span>
            <button
              onClick={() => handleRouteChange('addition')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              Reclassify as True Addition
            </button>
            <button
              onClick={() => handleRouteChange('included')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              Reclassify as Included
            </button>
          </div>
        </div>
      )}

      {activeChange.route === 'defect' && (
        <div className="p-6 sm:p-7 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-500/30 space-y-4 transition-all">
          <div className="flex items-start gap-3">
            <Bug className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                Agency Quality Assurance Warranty Protocol
              </h4>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                Log the root cause below for studio review. The client will be invoiced $0.00. You can still track internal remediation hours in Step A to monitor studio QA burn.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-900 dark:text-purple-200 mb-1.5">
              Internal Root Cause Note (Private studio documentation):
            </label>
            <input
              type="text"
              value={activeChange.defectRootCause || ''}
              onChange={(e) => updateActiveChange({ defectRootCause: e.target.value })}
              placeholder="e.g., CSS touch-action collision with Webflow slider swipe gesture handler"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-purple-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>
      )}

      {activeChange.route === 'included' && (
        <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-500/30 flex items-start gap-3 transition-colors">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <strong>Contract Obligation:</strong> This deliverable is already covered by the agreed baseline fee (${activeProject.approvedFee.toLocaleString()}). No additional fee will be quoted to the client. Proceed to Step A to record any internal delivery adjustment.
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-slate-200/80 dark:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Baseline (Step T)</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow group"
        >
          <span>Assess Delivery Costs (Step A)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
