/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CurrencyCode } from '../../types';
import { formatPercent } from '../../utils/formatters';
import {
  Settings,
  X,
  Upload,
  Download,
  FileJson,
  Coins,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    settings,
    updateSettings,
    isSettingsModalOpen,
    setSettingsModalOpen,
    exportWorkspaceBackup,
    importWorkspaceBackup,
    resetWorkspaceToDemo,
    showToast,
  } = useWorkspace();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'branding' | 'rates' | 'backup'>('branding');

  if (!isSettingsModalOpen) return null;

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, SVG, or JPG).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateSettings({ studioLogoUrl: result });
    };
    reader.readAsDataURL(file);
  };

  // Handle Backup Import
  const handleBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const res = importWorkspaceBackup(content);
      if (res.success) {
        setSettingsModalOpen(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Workspace & Studio Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                White-label deliverables, configure default labor costs, and manage backups.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'branding'
                ? 'border-indigo-600 text-indigo-700 dark:border-indigo-500 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Studio White-Labeling
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'rates'
                ? 'border-indigo-600 text-indigo-700 dark:border-indigo-500 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Default Rates & Margins
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'backup'
                ? 'border-indigo-600 text-indigo-700 dark:border-indigo-500 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Data Portability (Backup & Restore)
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Agency Name *
                  </label>
                  <input
                    type="text"
                    value={settings.agencyName}
                    onChange={(e) => updateSettings({ agencyName: e.target.value })}
                    placeholder="e.g. Atelier North Studio"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Agency Website
                  </label>
                  <input
                    type="text"
                    value={settings.agencyWebsite}
                    onChange={(e) => updateSettings({ agencyWebsite: e.target.value })}
                    placeholder="e.g. www.ateliernorth.studio"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Agency Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.agencyEmail}
                    onChange={(e) => updateSettings({ agencyEmail: e.target.value })}
                    placeholder="e.g. delivery@ateliernorth.studio"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Default Currency Symbol
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => {
                      const code = e.target.value as CurrencyCode;
                      const symbols: Record<CurrencyCode, string> = {
                        USD: '$',
                        EUR: '€',
                        GBP: '£',
                        AUD: 'A$',
                        CAD: 'C$',
                        CHF: 'CHF ',
                      };
                      updateSettings({ currency: code, currencySymbol: symbols[code] || '$' });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="AUD">AUD (A$ - Australian Dollar)</option>
                    <option value="CAD">CAD (C$ - Canadian Dollar)</option>
                    <option value="CHF">CHF (CHF - Swiss Franc)</option>
                  </select>
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Studio Logo (PNG / SVG)
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-28 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2 overflow-hidden shadow-sm">
                    {settings.studioLogoUrl ? (
                      <img
                        src={settings.studioLogoUrl}
                        alt="Studio Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500">No Logo</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors border border-slate-200 dark:border-transparent"
                      >
                        Upload Logo File
                      </button>
                      {settings.studioLogoUrl && (
                        <button
                          type="button"
                          onClick={() => updateSettings({ studioLogoUrl: '' })}
                          className="px-2 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Transparent PNG or SVG recommended. Will display at top of Scope Change Briefs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Standard Terms */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Standard Studio Contract Terms Note:
                </label>
                <textarea
                  rows={3}
                  value={settings.termsAndConditions}
                  onChange={(e) => updateSettings({ termsAndConditions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'rates' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Default Loaded Hourly Labor Rates (Internal Cost Vault)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Loaded rate = Direct salary/contractor hourly rate + Studio overhead allowance. These rates are strictly private and never leak into client deliverables.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      UI/UX Design Loaded Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={settings.defaultDesignRate}
                      onChange={(e) => updateSettings({ defaultDesignRate: Math.max(10, parseFloat(e.target.value) || 85) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg font-mono text-sm text-slate-900 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Webflow / Dev Loaded Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={settings.defaultDevRate}
                      onChange={(e) => updateSettings({ defaultDevRate: Math.max(10, parseFloat(e.target.value) || 95) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg font-mono text-sm text-slate-900 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      QA & Delivery Lead Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={settings.defaultPmRate}
                      onChange={(e) => updateSettings({ defaultPmRate: Math.max(10, parseFloat(e.target.value) || 75) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg font-mono text-sm text-slate-900 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Default Target Margin */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                      Default Target Contribution Margin (g)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Baseline for calculating commercial Price Floors and Restorative Fees.
                    </p>
                  </div>
                  <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPercent(settings.defaultTargetMargin)}
                  </span>
                </div>

                <input
                  type="range"
                  min="0.10"
                  max="0.75"
                  step="0.01"
                  value={settings.defaultTargetMargin}
                  onChange={(e) => updateSettings({ defaultTargetMargin: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 dark:accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <FileJson className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Zero-Backend Architecture & Portability
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                      ScopeLedger runs 100% locally in your browser’s <code>localStorage</code>. No external database or cloud server stores your agency fees. Use this tool to backup your projects before clearing cache or moving across machines.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={exportWorkspaceBackup}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Workspace Backup (.json)</span>
                  </button>

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleBackupFile}
                      accept=".json"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
                    >
                      <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Import Workspace Backup (.json)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset to Demo State */}
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                    Reset Workspace to Factory Demo
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Restores the sample Harbor project and defaults. Existing local projects will be replaced.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Reset workspace to initial sample project? This replaces current local changes.')) {
                      resetWorkspaceToDemo();
                      setSettingsModalOpen(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-medium transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  Reset to Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
