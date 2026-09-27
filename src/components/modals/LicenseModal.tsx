'use client';

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Sparkles,
  ShieldCheck,
  X,
  Check,
  KeyRound,
  LogOut,
} from 'lucide-react';

export const LicenseModal: React.FC = () => {
  const {
    license,
    isLicenseModalOpen,
    closeLicenseModal,
    licenseModalReason,
    activateLicense,
    releaseLicense,
  } = useWorkspace();

  const [inputKey, setInputKey] = useState('');
  const [selectedTier, setSelectedTier] = useState<'individual' | 'agency'>('agency');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLicenseModalOpen) return null;

  const handleActivate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const key = inputKey.trim();
    if (!key) {
      setErrorMsg('Please enter a valid license key.');
      return;
    }

    const success = activateLicense(key, selectedTier);
    if (!success) {
      setErrorMsg('Invalid license key format.');
    }
  };

  const handleSimulateKey = (tier: 'individual' | 'agency') => {
    const key = `SCOPE-${tier.toUpperCase()}-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setInputKey(key);
    setSelectedTier(tier);
    activateLicense(key, tier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {license.isLicensed ? 'Commercial License Manager' : 'Activate ScopeLedger License'}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {license.isLicensed
                ? 'Manage active studio workstation activations.'
                : licenseModalReason || 'Protect boutique margins across unlimited Webflow & Framer projects.'}
            </p>
          </div>

          <button
            onClick={closeLicenseModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!license.isLicensed ? (
            <>
              {/* Plan Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Individual Plan */}
                <div
                  onClick={() => setSelectedTier('individual')}
                  className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                    selectedTier === 'individual'
                      ? 'bg-indigo-950/30 border-indigo-500 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-slate-200">
                        Individual Plan
                      </span>
                      <input
                        type="radio"
                        checked={selectedTier === 'individual'}
                        onChange={() => setSelectedTier('individual')}
                        className="accent-indigo-500"
                      />
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-mono text-white">
                        $49.79
                      </span>
                      <span className="text-[11px] text-slate-400">one-time</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      For solo freelance web designers & Webflow specialists.
                    </p>

                    <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span><strong>2 Device Activations</strong> (Desktop + Laptop)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span>Unlimited Custom Projects</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span>Unwatermarked PDF Exports</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Agency Plan (Featured) */}
                <div
                  onClick={() => setSelectedTier('agency')}
                  className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between relative ${
                    selectedTier === 'agency'
                      ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500/30 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow">
                    Most Popular
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-slate-200">
                        Agency Plan
                      </span>
                      <input
                        type="radio"
                        checked={selectedTier === 'agency'}
                        onChange={() => setSelectedTier('agency')}
                        className="accent-emerald-500"
                      />
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-mono text-white">
                        $69.79
                      </span>
                      <span className="text-[11px] text-slate-400">one-time</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      For boutique web design agencies & delivery leads.
                    </p>

                    <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span><strong>5 Device Activations</strong> (Team / Lead)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Studio White-Labeling & Logo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>All 12 Agency Playbooks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Lifetime Offline Local Updates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* License Key Input Form */}
              <form onSubmit={handleActivate} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    Enter Gumroad License Key:
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Format: SCOPE-TIER-XXXX
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="e.g. SCOPE-AGENCY-2026-X89"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    Activate Key
                  </button>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400">{errorMsg}</p>
                )}

                {/* Instant Evaluation Simulation Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-500">
                    Quick Evaluation Simulation:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulateKey('agency')}
                      className="px-2.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono transition-colors"
                    >
                      Instant Unlock (Agency)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateKey('individual')}
                      className="px-2.5 py-1 rounded bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-[11px] font-mono transition-colors"
                    >
                      Instant Unlock (Individual)
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            /* Active License Management View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-emerald-300 capitalize">
                      {license.tier} Plan Active
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified Offline
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>License Key: <strong className="font-mono text-slate-100">{license.licenseKey}</strong></div>
                  <div>Workstation: <span className="font-mono text-slate-400">{license.currentDeviceName}</span></div>
                  <div>Device Usage: <strong className="text-emerald-400">1 of {license.maxDevices} devices registered</strong></div>
                </div>
              </div>

              {/* Release Device Option */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    Device Management
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Deactivate this workstation to use the license on another machine.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Release license on this machine and revert to Demo Mode?')) {
                      releaseLicense();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Release This Device</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
