/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Project, ScopeChangeRequest, WorkspaceSettings, LicenseState } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle2, Shield, AlertCircle } from 'lucide-react';

interface ScopeChangeBriefProps {
  project: Project;
  changeRequest: ScopeChangeRequest;
  settings: WorkspaceSettings;
  license?: LicenseState;
  viewMode: 'client' | 'internal';
  watermarked?: boolean;
}

export const ScopeChangeBrief: React.FC<ScopeChangeBriefProps> = ({
  project,
  changeRequest,
  settings,
  viewMode,
  watermarked = false,
}) => {
  const isClientView = viewMode === 'client';
  const fee = changeRequest.offerType === 'quote' ? changeRequest.quotedFee : 0;
  const isExchange = changeRequest.offerType === 'exchange';

  return (
    <div
      id="printable-scope-brief"
      className="relative bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 border border-slate-200 select-text overflow-hidden transition-all font-sans print:shadow-none print:border-none print:p-8 print:w-full"
    >
      {/* Watermark Overlay in Demo Mode */}
      {watermarked && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 select-none overflow-hidden opacity-[0.08] print:opacity-[0.12]">
          <div className="transform -rotate-45 text-5xl sm:text-7xl font-black tracking-widest text-slate-900 whitespace-nowrap uppercase border-8 border-dashed border-slate-900 p-8 rounded-3xl">
            SCOPELEDGER DEMO
          </div>
        </div>
      )}

      {/* Internal Audit Banner (Only in Internal View) */}
      {!isClientView && (
        <div className="mb-6 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="font-semibold">Internal Studio Audit Mode</span>
            <span className="text-slate-600">
              — This banner and yellow internal notes are hidden in Client View and Print.
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-indigo-700">
            CONFIDENTIAL
          </span>
        </div>
      )}

      {/* Header: Agency Branding + Document Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            {settings.studioLogoUrl ? (
              <img
                src={settings.studioLogoUrl}
                alt={settings.agencyName}
                className="h-9 w-auto object-contain max-w-[140px]"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-sm tracking-tight">
                {settings.agencyName.slice(0, 2).toUpperCase() || 'AN'}
              </div>
            )}
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                {settings.agencyName || 'Atelier North Studio'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {settings.agencyWebsite || 'www.ateliernorth.studio'} • {settings.agencyEmail || 'delivery@ateliernorth.studio'}
              </p>
            </div>
          </div>
        </div>

        <div className="sm:text-right space-y-1">
          <div className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-slate-800 tracking-wider uppercase">
            Scope Change Authorization
          </div>
          <div className="font-mono text-xs text-slate-600">
            Ref: <strong className="text-slate-900">{changeRequest.referenceId}</strong>
          </div>
          <div className="text-xs text-slate-500">
            Date Issued: <span className="font-medium text-slate-800">{formatDate(changeRequest.requestDate)}</span>
          </div>
        </div>
      </div>

      {/* Context Grid: Project & Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-200 text-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Client Organization
          </span>
          <div className="font-bold text-sm text-slate-900">{project.clientName}</div>
          <div className="text-slate-600">{project.clientEmail || 'Client Delivery Lead'}</div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Project Baseline
          </span>
          <div className="font-bold text-sm text-slate-900">{project.name}</div>
          <div className="font-mono text-slate-600">Agreement ID: {project.referenceCode}</div>
        </div>
      </div>

      {/* Scope Item Subject & Plain-English Description */}
      <div className="py-5 border-b border-slate-200 space-y-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Scope Adjustment Title
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {changeRequest.title}
          </h2>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Description of Deliverable
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {changeRequest.clientDescription || 'No description provided.'}
          </p>
        </div>

        {/* Commercial Route & Status Notice */}
        <div className="pt-2">
          {changeRequest.offerType === 'quote' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Commercial Scope Addition — Authorization Required</span>
            </div>
          )}
          {changeRequest.offerType === 'absorb' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-slate-600" />
              <span>Studio Courtesy Scope Waiver — $0.00 Client Charge</span>
            </div>
          )}
          {changeRequest.offerType === 'exchange' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Scope Parity Exchange — Balanced Effort Swap</span>
            </div>
          )}
          {changeRequest.offerType === 'defer' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Post-Launch Backlog Deferral — Phase 2</span>
            </div>
          )}
        </div>

        {isExchange && changeRequest.exchangeScopeOffered && (
          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
            <strong>Replaced Scope Item:</strong> {changeRequest.exchangeScopeOffered}
          </div>
        )}
      </div>

      {/* Pricing & Commercial Adjustment Line Item */}
      <div className="py-5 border-b border-slate-200 space-y-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Commercial Adjustment Summary
        </span>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-300 text-slate-500 font-medium">
              <th className="text-left py-2">Item Description</th>
              <th className="text-center py-2">Classification</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 font-medium text-slate-900">
                {changeRequest.title}
                <div className="text-[11px] text-slate-500 font-normal">
                  {changeRequest.scheduleImpactDays > 0
                    ? `Adds ${changeRequest.scheduleImpactDays} business days to delivery timeline.`
                    : 'Delivered within existing milestone schedule.'}
                </div>
              </td>
              <td className="py-3 text-center capitalize text-slate-600 font-mono">
                {changeRequest.offerType}
              </td>
              <td className="py-3 text-right font-mono font-bold text-sm text-slate-900 tabular-nums">
                {formatCurrency(fee, settings.currency)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900 font-bold text-slate-900">
              <td colSpan={2} className="py-3 text-right pr-4 uppercase text-xs">
                Total Authorized Adjustment Fee:
              </td>
              <td className="py-3 text-right font-mono text-base text-slate-900 tabular-nums">
                {formatCurrency(fee, settings.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Schedule Adjustment & Delivery Conditions */}
      <div className="py-5 border-b border-slate-200 space-y-4 text-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Timeline & Schedule Adjustment
          </span>
          <p className="text-slate-800 font-medium">
            {changeRequest.scheduleNotes || (
              changeRequest.scheduleImpactDays > 0
                ? `Adds ${changeRequest.scheduleImpactDays} business days to the agreed delivery schedule.`
                : 'Zero schedule slippage. Milestone target dates remain unchanged.'
            )}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Delivery Conditions & Acceptance Criteria
          </span>
          <ul className="space-y-1.5 list-disc list-inside text-slate-700">
            {(changeRequest.deliveryConditions && changeRequest.deliveryConditions.length > 0
              ? changeRequest.deliveryConditions
              : [
                  'Client provides written counter-authorization prior to engineering scheduling.',
                  'Third-party software or API subscription charges are billed directly to client.',
                  'Any further iterations beyond the agreed scope brief will require a separate authorization.',
                ]
            ).map((cond, i) => (
              <li key={i} className="leading-relaxed">
                <span className="text-slate-800 font-medium">{cond}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Standard Studio Terms */}
      <div className="py-4 border-b border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <strong>Standard Studio Terms:</strong> {settings.termsAndConditions}
      </div>

      {/* Digital Approval Signature Section */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
        <div className="space-y-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Authorized Studio Lead
          </span>
          <div className="pt-6 border-b border-slate-400">
            <span className="font-serif italic text-sm text-slate-700">
              {settings.agencyName} Delivery Lead
            </span>
          </div>
          <div className="text-slate-600">
            <div>Authorized Lead, {settings.agencyName}</div>
            <div className="text-[11px] text-slate-400">Date: {formatDate(changeRequest.requestDate)}</div>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Client Counter-Authorization
          </span>
          <div className="pt-6 border-b border-slate-400">
            <span className="font-serif italic text-sm text-indigo-900 font-semibold">
              {changeRequest.clientSignerName || '_______________________'}
            </span>
          </div>
          <div className="text-slate-600">
            <div>{changeRequest.clientSignerName || 'Client Authorized Signatory'}</div>
            <div className="text-[11px] text-slate-400">
              {changeRequest.clientSignerTitle || project.clientName}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Notice */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Verified Scope Change Authorization • {project.referenceCode}</span>
        <span>Generated with ScopeLedger Studio Edition</span>
      </div>
    </div>
  );
};
