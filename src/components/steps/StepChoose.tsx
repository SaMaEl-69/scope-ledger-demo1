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
      // Default to price floor if fee is currently 0
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
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/80 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-md bg-indigo-600/20 dark:bg-indigo-600/30 border border-indigo-500/40 text-indigo-700 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
            C
          </span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
            Choose an Offer (Commercial Matrix)
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 font-medium">
            Step 4 of 5
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Option 1: Quote */}
        <div
          onClick={() => handleOfferSelect('quote')}
          className={`cursor-pointer rounded-xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
            activeChange.offerType === 'quote'
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 ring-1 ring-emerald-500/30 shadow-lg'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'quote'}
                onChange={() => handleOfferSelect('quote')}
                className="accent-emerald-600 dark:accent-emerald-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1">
              1. Quote Fee (P)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Charge an incremental fee covering delivery cost <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">D</span> at your target margin <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{formatPercent(g)}</span>.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Suggested Price Floor:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {formatCurrency(priceFloor, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Project Margin:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300">
                {formatPercent(newMargin)}
              </span>
            </div>
          </div>
        </div>

        {/* Option 2: Absorb */}
        <div
          onClick={() => handleOfferSelect('absorb')}
          className={`cursor-pointer rounded-xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
            activeChange.offerType === 'absorb'
              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500 ring-1 ring-rose-500/30 shadow-lg'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'absorb'}
                onChange={() => handleOfferSelect('absorb')}
                className="accent-rose-600 dark:accent-rose-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1">
              2. Absorb ($0 Charge)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Deliver work at $0 as a strategic courtesy waiver or relationship investment.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Studio Profit Hit:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                -{formatCurrency(D, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Margin Drops To:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-300">
                {formatPercent(absorbedMargin)}
              </span>
            </div>
          </div>
        </div>

        {/* Option 3: Exchange */}
        <div
          onClick={() => handleOfferSelect('exchange')}
          className={`cursor-pointer rounded-xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
            activeChange.offerType === 'exchange'
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 ring-1 ring-blue-500/30 shadow-lg'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/20">
                <Repeat className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'exchange'}
                onChange={() => handleOfferSelect('exchange')}
                className="accent-blue-600 dark:accent-blue-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1">
              3. Scope Exchange
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Swap an unfinished feature of equal effort. Balances net cost to $0 with zero deadline slippage.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Net Client Charge:</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400">$0.00 Net</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Baseline Margin:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-300">
                Preserved ({formatPercent(currentBaselineMargin)})
              </span>
            </div>
          </div>
        </div>

        {/* Option 4: Defer */}
        <div
          onClick={() => handleOfferSelect('defer')}
          className={`cursor-pointer rounded-xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
            activeChange.offerType === 'defer'
              ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 ring-1 ring-amber-500/30 shadow-lg'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20">
                <CalendarClock className="w-4 h-4" />
              </div>
              <input
                type="radio"
                name="offerType"
                checked={activeChange.offerType === 'defer'}
                onChange={() => handleOfferSelect('defer')}
                className="accent-amber-600 dark:accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1">
              4. Defer to Phase 2
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Protect current launch date by parking the request in post-launch backlog or politely declining.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Launch Timeline:</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">100% Protected</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Scope Status:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-300">Post-Launch Backlog</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Offer Deep Dive Settings */}
      {activeChange.offerType === 'quote' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Configure Quoted Change Fee (P)
            </h3>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              Quoted: {formatCurrency(P, settings.currency)}
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Preset 1: Price Floor */}
            <button
              onClick={() => handleQuickFeePreset(priceFloor)}
              className="p-3 text-left rounded-lg bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  Target Price Floor
                </span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10">
                  {formatPercent(g)} target
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatCurrency(priceFloor, settings.currency)}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Formula: D / (1 - g) = covers change at {formatPercent(g)}
              </p>
            </button>

            {/* Preset 2: Restorative Fee */}
            <button
              onClick={() => handleQuickFeePreset(restorativeFee > 0 ? restorativeFee : priceFloor * 1.15)}
              className="p-3 text-left rounded-lg bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                  Whole-Project Restorative
                </span>
                <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/10">
                  Project Restore
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                {formatCurrency(restorativeFee > 0 ? restorativeFee : priceFloor * 1.15, settings.currency)}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Restores entire project to target margin {formatPercent(g)}
              </p>
            </button>

            {/* Preset 3: Value-Add Rounding */}
            <button
              onClick={() => handleQuickFeePreset(Math.ceil(priceFloor / 250) * 250 + 250)}
              className="p-3 text-left rounded-lg bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  Value-Add Premium
                </span>
                <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10">
                  Buffer Added
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                {formatCurrency(Math.ceil(priceFloor / 250) * 250 + 250, settings.currency)}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Includes risk buffer and clean rounded fee tier
              </p>
            </button>
          </div>

          {/* Interactive Fee Slider and Direct Input */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                Fine-Tune Client Quote Fee (P):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Custom Fee:</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 font-mono text-xs">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={activeChange.quotedFee || ''}
                    onChange={(e) => updateActiveChange({ quotedFee: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-32 pl-6 pr-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 tabular-nums"
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

            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
              <span>Cost Break-Even: {formatCurrency(D, settings.currency)}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Price Floor: {formatCurrency(priceFloor, settings.currency)}</span>
              <span>Premium Tier: {formatCurrency(priceFloor * 1.5, settings.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {activeChange.offerType === 'absorb' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Strategic Absorb Waiver ($0 Client Invoice)
            </h3>
            <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-bold">
              Studio Loss: -{formatCurrency(D, settings.currency)}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Internal Studio Justification for Absorbing Cost:
              </label>
              <select
                value={activeChange.absorbRationale || ''}
                onChange={(e) => updateActiveChange({ absorbRationale: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
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

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Client-Facing Notice:</strong> The Scope Change Brief will explicitly state: <em>&quot;Studio Courtesy Scope Waiver (Standard Value: {formatCurrency(priceFloor, settings.currency)}) — Delivered at $0.00 as a one-time courtesy.&quot;</em> This prevents the client from assuming your work is free in the future!
            </p>
          </div>
        </div>
      )}

      {activeChange.offerType === 'exchange' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <Repeat className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Scope Exchange (Dollar-for-Dollar Trade)
            </h3>
            <span className="text-[11px] font-mono text-blue-700 dark:text-blue-300 font-bold">
              Balanced Parity: $0 Net Fee
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Agreed Unfinished Scope Item to Drop / Replace:
            </label>
            <input
              type="text"
              value={activeChange.exchangeScopeOffered || ''}
              onChange={(e) => updateActiveChange({ exchangeScopeOffered: e.target.value })}
              placeholder="e.g., Retire unbuilt Milestone 3 interactive ROI calculator in exchange for new lead magnet library"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              This swapped scope item will be documented in the Scope Change Brief as formally removed from the contract deliverable inventory.
            </p>
          </div>
        </div>
      )}

      {activeChange.offerType === 'defer' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Polite Deferral Protocol (Phase 2 Backlog)
            </h3>
            <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold">
              Timeline Shielded
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Deferral Destination:
              </label>
              <select
                value={activeChange.deferralTiming || 'Post-Launch Phase 2'}
                onChange={(e) => updateActiveChange({ deferralTiming: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Post-Launch Phase 2">Post-Launch Phase 2 (Recommended)</option>
                <option value="Monthly Retainer Backlog">Monthly Retainer Backlog</option>
                <option value="Politely Declined (Out of Studio Focus)">Politely Declined (Out of Studio Focus)</option>
              </select>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed relative">
              {politeDeferralEmail}
              <button
                onClick={copyDeferralEmail}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-sans transition-colors border border-slate-300 dark:border-slate-700"
              >
                {copiedDeferral ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDeferral ? 'Copied' : 'Copy Response'}</span>
              </button>
            </div>
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
          <span>Back to Assessment (Step A)</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/25 group"
        >
          <span>Evidence & Generate Brief (Step E)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
