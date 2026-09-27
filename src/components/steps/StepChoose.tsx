'use client';

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { OfferType } from '../../types';
import { MarginMetricsBar } from '../gauges/MarginMetricsBar';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  ArrowRight,
  ArrowLeft,
  DollarSign,
  HeartHandshake,
  Repeat,
  CalendarClock,
  Check,
  Copy,
} from 'lucide-react';

export const StepChoose: React.FC = () => {
  const {
    activeChange,
    updateActiveChange,
    activeProject,
    calculations,
    settings,
    nextStep,
    prevStep,
    showToast,
  } = useWorkspace();

  const {
    D,
    g,
    P,
    currentBaselineMargin,
    absorbedMargin,
    priceFloor,
    restorativeFee,
    newMargin,
  } = calculations;

  const [copiedDeferral, setCopiedDeferral] = useState(false);

  const handleOfferSelect = (type: OfferType) => {
    if (type === 'quote') {
      const fee = activeChange.quotedFee > 0 ? activeChange.quotedFee : Math.round(priceFloor);
      updateActiveChange({ offerType: type, quotedFee: fee });
    } else {
      updateActiveChange({ offerType: type, quotedFee: 0 });
    }
  };

  const handleQuickFeePreset = (fee: number) => {
    updateActiveChange({ quotedFee: Math.round(fee), offerType: 'quote' });
  };

  const politeDeferralEmail = `Hi ${activeProject.clientName.split(' ')[0] || 'there'},

Thank you for sending over the idea for "${activeChange.title}"! We love where your head is at for this experience.

To protect our agreed launch timeline and ensure our current sprint stays 100% focused on delivering the signed core milestone without delays, we recommend capturing this in our Phase 2 backlog.

Right after launch, we can dedicate a focused sprint to integrate this smoothly. Let us know if that sounds good, and we'll keep moving full steam ahead toward staging!

Best,
Studio Delivery Lead`;

  const copyDeferralEmail = () => {
    navigator.clipboard.writeText(politeDeferralEmail);
    setCopiedDeferral(true);
    showToast('Deferral email template copied to clipboard', 'success');
    setTimeout(() => setCopiedDeferral(false), 3000);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Intro Header */}
      <div className="space-y-1.5 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
            Step 04 / Choose
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Choose an Offer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Select how your studio will respond to this scope change. Evaluate real-time margin trade-offs across Quote, Absorb, Exchange, or Defer.
        </p>
      </div>

      {/* Real-time Comparative Margin Engine Bar */}
      <MarginMetricsBar
        calculations={calculations}
        currency={settings.currency}
        offerType={activeChange.offerType}
      />

      {/* 4 Interactive Commercial Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Option 1: Quote */}
        <div
          onClick={() => handleOfferSelect('quote')}
          className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between ${
            activeChange.offerType === 'quote'
              ? 'bg-white dark:bg-slate-850 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'quote'}
                onChange={() => handleOfferSelect('quote')}
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-1">
              1. Quote Fee (P)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Charge an incremental fee covering cost <span className="font-mono text-slate-700 dark:text-slate-200 font-medium">D</span> at target margin <span className="font-mono text-slate-700 dark:text-slate-200 font-medium">{formatPercent(g)}</span>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Price Floor:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(priceFloor, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Margin:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {formatPercent(newMargin)}
              </span>
            </div>
          </div>
        </div>

        {/* Option 2: Absorb */}
        <div
          onClick={() => handleOfferSelect('absorb')}
          className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between ${
            activeChange.offerType === 'absorb'
              ? 'bg-white dark:bg-slate-850 border-rose-500 shadow-md ring-1 ring-rose-500/20'
              : 'bg-white dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'absorb'}
                onChange={() => handleOfferSelect('absorb')}
                className="accent-rose-600 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-1">
              2. Absorb ($0 Charge)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Deliver work at $0 as a strategic courtesy waiver or relationship investment.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Profit Hit:</span>
              <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                -{formatCurrency(D, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Margin Drops To:</span>
              <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                {formatPercent(absorbedMargin)}
              </span>
            </div>
          </div>
        </div>

        {/* Option 3: Exchange */}
        <div
          onClick={() => handleOfferSelect('exchange')}
          className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between ${
            activeChange.offerType === 'exchange'
              ? 'bg-white dark:bg-slate-850 border-blue-500 shadow-md ring-1 ring-blue-500/20'
              : 'bg-white dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Repeat className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'exchange'}
                onChange={() => handleOfferSelect('exchange')}
                className="accent-blue-600 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-1">
              3. Scope Exchange
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Swap an unfinished feature of equal effort. Balances net cost to $0 with zero deadline slip.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Net Client Charge:</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">$0.00 Net</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Baseline Margin:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                Preserved ({formatPercent(currentBaselineMargin)})
              </span>
            </div>
          </div>
        </div>

        {/* Option 4: Defer */}
        <div
          onClick={() => handleOfferSelect('defer')}
          className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between ${
            activeChange.offerType === 'defer'
              ? 'bg-white dark:bg-slate-850 border-amber-500 shadow-md ring-1 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <CalendarClock className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'defer'}
                onChange={() => handleOfferSelect('defer')}
                className="accent-amber-600 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-1">
              4. Defer to Phase 2
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Protect current launch date by parking request in post-launch backlog.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Launch Timeline:</span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">Protected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scope Status:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">Backlog</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Offer Deep Dive Settings */}
      {activeChange.offerType === 'quote' && (
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Configure Quoted Change Fee (P)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Quoted: {formatCurrency(P, settings.currency)}
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Preset 1: Price Floor */}
            <button
              onClick={() => handleQuickFeePreset(priceFloor)}
              className="p-4 sm:p-5 text-left rounded-xl bg-slate-50/70 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Target Price Floor
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                  {formatPercent(g)} target
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatCurrency(priceFloor, settings.currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Formula: D / (1 - g). Guarantees this change meets your target margin.
              </p>
            </button>

            {/* Preset 2: Restorative Fee */}
            <button
              onClick={() => handleQuickFeePreset(Math.max(priceFloor, restorativeFee))}
              className="p-4 sm:p-5 text-left rounded-xl bg-slate-50/70 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Restorative Fee
                </span>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60">
                  Whole Project
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                {formatCurrency(Math.max(priceFloor, restorativeFee), settings.currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Pulls the entire project back up to your target margin if earlier scope fell behind.
              </p>
            </button>

            {/* Preset 3: Breakeven */}
            <button
              onClick={() => handleQuickFeePreset(D)}
              className="p-4 sm:p-5 text-left rounded-xl bg-slate-50/70 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-400 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  At-Cost Break-Even
                </span>
                <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  0% Profit
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                {formatCurrency(D, settings.currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Recovers direct delivery cost with zero agency contribution margin.
              </p>
            </button>
          </div>

          {/* Interactive Pricing Slider & Direct Input */}
          <div className="p-6 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Custom Quoted Price (P)
                </label>
                <p className="text-xs text-slate-400">
                  Adjust fee to fine-tune commercial pricing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Amount:</span>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono text-sm">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={activeChange.quotedFee || ''}
                    onChange={(e) => updateActiveChange({ quotedFee: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-36 pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 tabular-nums"
                  />
                </div>
              </div>
            </div>

            <input
              type="range"
              min={Math.max(100, Math.round(D * 0.8))}
              max={Math.max(5000, Math.round(priceFloor * 2.5))}
              step="25"
              value={activeChange.quotedFee || 0}
              onChange={(e) => updateActiveChange({ quotedFee: parseFloat(e.target.value) || 0 })}
              className="w-full accent-emerald-600 dark:accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Break-Even: {formatCurrency(D, settings.currency)}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Price Floor: {formatCurrency(priceFloor, settings.currency)}</span>
              <span>Premium: {formatCurrency(priceFloor * 1.5, settings.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {activeChange.offerType === 'absorb' && (
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Strategic Courtesy Scope Waiver ($0 Invoice)
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">
              Studio Loss: -{formatCurrency(D, settings.currency)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Internal Studio Justification for Absorbing Cost:
              </label>
              <select
                value={activeChange.absorbRationale || ''}
                onChange={(e) => updateActiveChange({ absorbRationale: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="">Select strategic rationale...</option>
                <option value="One-time courtesy goodwill gesture for flagship client">
                  One-time courtesy goodwill gesture for flagship client
                </option>
                <option value="Agency QA warranty / Defect remediation commitment">
                  Agency QA warranty / Defect remediation commitment
                </option>
                <option value="Offsetting earlier studio sprint delay">
                  Offsetting earlier studio sprint delay
                </option>
                <option value="Strategic portfolio showcase piece & case study permission">
                  Strategic portfolio showcase piece & case study permission
                </option>
                <option value="Retainer upsell leverage for post-launch contract">
                  Retainer upsell leverage for post-launch contract
                </option>
              </select>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60">
              <strong>Client-Facing Notice:</strong> The Scope Change Brief will explicitly state: <em>&quot;Studio Courtesy Scope Waiver (Standard Value: {formatCurrency(priceFloor, settings.currency)}) — Delivered at $0.00 as a one-time courtesy.&quot;</em> This anchors the value of your studio time and prevents future unpriced scope expectations.
            </p>
          </div>
        </div>
      )}

      {activeChange.offerType === 'exchange' && (
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                Scope Exchange (Feature-for-Feature Swap)
              </h3>
            </div>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
              Balanced Parity: $0 Net Fee
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Agreed Unfinished Scope Item to Drop / Replace:
            </label>
            <input
              type="text"
              value={activeChange.exchangeScopeOffered || ''}
              onChange={(e) => updateActiveChange({ exchangeScopeOffered: e.target.value })}
              placeholder="e.g., Retire unbuilt Milestone 3 interactive ROI calculator in exchange for new lead magnet library"
              className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-[11px] text-slate-400 mt-2">
              This swapped scope item will be documented in the Scope Change Brief as formally removed from the contract deliverable inventory.
            </p>
          </div>
        </div>
      )}

      {activeChange.offerType === 'defer' && (
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Polite Deferral Protocol (Phase 2 Backlog)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
              Timeline Shielded
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Copy this respectful, non-confrontational message to decline without friction while keeping the client excited for a post-launch phase:
            </p>

            <div className="bg-slate-50/70 dark:bg-slate-950/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed relative">
              {politeDeferralEmail}
              <button
                onClick={copyDeferralEmail}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-sans transition-colors border border-slate-200 dark:border-slate-700"
              >
                {copiedDeferral ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDeferral ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
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
          <span>Back to Assessment (Step A)</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow group"
        >
          <span>Evidence Scope Brief (Step E)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
