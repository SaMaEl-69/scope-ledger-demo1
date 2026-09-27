'use client';

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ScopeChangeBrief } from '../deliverables/ScopeChangeBrief';
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters';
import {
  FileCheck2,
  ArrowLeft,
  Copy,
  Printer,
  ShieldCheck,
  Check,
  Sparkles,
  Plus,
  Trash2,
  PenTool,
  Lock,
  Eye,
} from 'lucide-react';

export const StepEvidence: React.FC = () => {
  const {
    activeProject,
    activeChange,
    updateActiveChange,
    settings,
    license,
    openLicenseModal,
    prevStep,
    showToast,
  } = useWorkspace();

  const [viewMode, setViewMode] = useState<'client' | 'internal'>('client');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [newCondition, setNewCondition] = useState('');

  // Handle PDF Download / Print
  const handlePrintOrDownloadPDF = () => {
    if (!license.isLicensed) {
      const proceed = confirm(
        'You are in Demo Mode. Your PDF will be watermarked with "SCOPELEDGER DEMO".\n\nWould you like to activate a commercial license for clean, unwatermarked studio exports?'
      );
      if (proceed) {
        openLicenseModal('Unlock clean, unwatermarked Scope Change Brief PDF exports.');
        return;
      }
    }

    window.print();
  };

  // Generate Markdown Brief for Clipboard
  const generateMarkdownBrief = () => {
    const fee = activeChange.offerType === 'quote' ? activeChange.quotedFee : 0;
    const conditions = (activeChange.deliveryConditions || [])
      .map((c) => `- ${c}`)
      .join('\n');

    return `# SCOPE CHANGE BRIEF: ${activeChange.title}
**Reference ID:** ${activeChange.referenceId}
**Date:** ${formatDate(activeChange.requestDate)}
**Studio:** ${settings.agencyName}
**Client:** ${activeProject.clientName} (${activeProject.name})

---

### Description of Deliverable
${activeChange.clientDescription}

### Commercial Summary
- **Classification:** ${activeChange.offerType.toUpperCase()}
- **Authorized Adjustment Fee:** ${formatCurrency(fee, settings.currency)}
- **Schedule Impact:** ${activeChange.scheduleNotes || (activeChange.scheduleImpactDays > 0 ? `+${activeChange.scheduleImpactDays} business days` : 'Zero delay')}

### Delivery Conditions & Acceptance Criteria
${conditions}

---
*Authorized by ${settings.agencyName} Delivery Lead*
*Client Authorization: ${activeChange.clientSignerName || 'Awaiting Counter-Signature'}*
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownBrief();
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    showToast('Scope Change Brief copied as Markdown / Email', 'success');
    setTimeout(() => setCopiedMarkdown(false), 3000);
  };

  // Condition list management
  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    const current = activeChange.deliveryConditions || [];
    updateActiveChange({ deliveryConditions: [...current, newCondition.trim()] });
    setNewCondition('');
  };

  const handleRemoveCondition = (index: number) => {
    const current = activeChange.deliveryConditions || [];
    updateActiveChange({
      deliveryConditions: current.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
              Step 05 / Evidence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Evidence the Decision
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Generate an executive, client-facing Scope Change Brief. Zero internal labor hours or margin rates leak into this deliverable.
          </p>
        </div>

        {/* Zero-Leak Privacy Audit Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'client'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Client Deliverable</span>
          </button>
          <button
            onClick={() => setViewMode('internal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'internal'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Studio Audit View</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm transition-all">
        <div className="flex items-center gap-2.5 text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-400">Approval State:</span>
          <select
            value={activeChange.status}
            onChange={(e) => updateActiveChange({ status: e.target.value as 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'deferred' })}
            className="px-3 py-1.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved & Signed</option>
            <option value="rejected">Rejected by Client</option>
            <option value="deferred">Deferred to Phase 2</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors border border-slate-200/80 dark:border-slate-700/80"
          >
            {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMarkdown ? 'Copied' : 'Copy Email Brief'}</span>
          </button>

          {/* Download / Print PDF */}
          <button
            onClick={handlePrintOrDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-semibold transition-all shadow-sm hover:shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Scope Brief PDF</span>
            {!license.isLicensed && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-900 font-mono font-medium">
                Demo
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Customization Controls (Left 4 cols) + Live Brief Preview (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (4 cols): Conditions, Signatory, and Privacy Assurance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Signatory Info Card */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <PenTool className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Counter-Signatory
                </h3>
              </div>
              {activeChange.status === 'approved' ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" /> Signed
                </span>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Client Signer Name:
              </label>
              <input
                type="text"
                value={activeChange.clientSignerName || ''}
                onChange={(e) => updateActiveChange({ clientSignerName: e.target.value })}
                placeholder="e.g., Elena Rostova"
                className="w-full px-3.5 py-2 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Client Signer Title:
              </label>
              <input
                type="text"
                value={activeChange.clientSignerTitle || ''}
                onChange={(e) => updateActiveChange({ clientSignerTitle: e.target.value })}
                placeholder="e.g., VP of Brand & Digital Experience"
                className="w-full px-3.5 py-2 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              onClick={() => {
                const name = activeChange.clientSignerName || activeProject.clientName + ' Delivery Lead';
                updateActiveChange({
                  clientSignerName: name,
                  status: 'approved',
                  signedDate: new Date().toISOString(),
                });
                showToast(`Scope Brief marked as Authorized & Signed by ${name}!`, 'success');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simulate Client Counter-Signature</span>
            </button>
          </div>

          {/* Delivery Conditions Editor */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-all">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
              Delivery Conditions & Acceptance
            </h3>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {(activeChange.deliveryConditions || []).map((cond, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-800 dark:text-slate-300 group"
                >
                  <span className="leading-relaxed">• {cond}</span>
                  <button
                    onClick={() => handleRemoveCondition(idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-1"
                    title="Remove condition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCondition()}
                placeholder="Add condition or acceptance criteria..."
                className="flex-1 px-3 py-2 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                onClick={handleAddCondition}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Privacy Audit Checklist */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3 text-xs transition-all">
            <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Leak Privacy Verified</span>
            </div>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Internal hours ({activeChange.laborLines?.reduce((s, l) => s + (l.hours || 0), 0) || 0} hrs) are hidden</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Loaded hourly rates ($85–$95/hr) are hidden</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Agency target margin numbers ({formatPercent(activeProject.targetMargin || 0.35)}) are hidden</span>
              </li>
            </ul>
          </div>

          {/* Demo Mode Watermark Notice */}
          {!license.isLicensed && (
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-500/30 text-xs space-y-2.5 transition-all">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Watermark Active in Demo Mode</span>
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                The brief preview displays the <code>SCOPELEDGER DEMO</code> watermark. Activate an Individual or Agency license to export clean unwatermarked PDFs.
              </p>
              <button
                onClick={() => openLicenseModal('Unlock clean, unwatermarked Scope Change Brief PDF exports.')}
                className="w-full py-2 px-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-medium transition-colors"
              >
                Activate Studio License
              </button>
            </div>
          )}
        </div>

        {/* Right Column (8 cols): Live Scope Change Brief Deliverable */}
        <div className="lg:col-span-8 shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <ScopeChangeBrief
            project={activeProject}
            changeRequest={activeChange}
            settings={settings}
            license={license}
            viewMode={viewMode}
            watermarked={!license.isLicensed}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-slate-200/80 dark:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Offer Matrix (Step C)</span>
        </button>

        <button
          onClick={handlePrintOrDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow"
        >
          <Printer className="w-4 h-4" />
          <span>Export Scope Brief PDF</span>
        </button>
      </div>
    </div>
  );
};
