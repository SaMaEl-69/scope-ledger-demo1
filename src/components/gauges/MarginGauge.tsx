'use client';

import React from 'react';
import { formatPercent, formatCurrency } from '../../utils/formatters';
import { getMarginHealth } from '../../utils/calculations';
import { CurrencyCode } from '../../types';

interface MarginGaugeProps {
  margin: number; // e.g. 0.38 for 38%
  targetMargin: number; // e.g. 0.35
  profitAmount?: number;
  currency?: CurrencyCode;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  showTargetMarker?: boolean;
}

export const MarginGauge: React.FC<MarginGaugeProps> = ({
  margin,
  targetMargin,
  profitAmount,
  currency = 'USD',
  size = 'md',
  label = 'Contribution Margin',
  sublabel,
  showTargetMarker = true,
}) => {
  const health = getMarginHealth(margin, targetMargin);
  const clampedMargin = Math.max(-0.5, Math.min(1, margin)); // clamp display between -50% and 100%

  // Dimensions based on size
  const config = {
    sm: { size: 100, strokeWidth: 8, radius: 42, fontSize: 'text-lg', labelSize: 'text-[10px]' },
    md: { size: 150, strokeWidth: 10, radius: 64, fontSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { size: 210, strokeWidth: 14, radius: 90, fontSize: 'text-3xl', labelSize: 'text-sm' },
  }[size];

  const { size: svgSize, strokeWidth, radius } = config;
  const center = svgSize / 2;
  
  // Half-circle arc from 180deg to 360deg (or 240-degree gauge)
  // Let's use a 240-degree semi-arc: from -210° to 30°
  // Total arc length:
  const arcDegrees = 240;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (circumference * arcDegrees) / 360;

  // Value normalized between -0.20 (min display) and 0.80 (max display)
  const minVal = -0.10;
  const maxVal = 0.80;
  const normalizedValue = Math.max(0, Math.min(1, (clampedMargin - minVal) / (maxVal - minVal)));
  const currentOffset = arcLength - (arcLength * normalizedValue);

  // Target normalized
  const targetNormalized = Math.max(0, Math.min(1, (targetMargin - minVal) / (maxVal - minVal)));

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: svgSize, height: svgSize * 0.85 }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="overflow-visible"
        >
          {/* Subtle gradient definitions */}
          <defs>
            <linearGradient id={`gauge-grad-${size}`} x1="0%" y1="100%" x2="100%" y2="0%">
              {health.status === 'healthy' ? (
                <>
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </>
              ) : health.status === 'warning' ? (
                <>
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#f87171" />
                </>
              )}
            </linearGradient>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700/40"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(150 ${center} ${center})`}
          />

          {/* Target Margin Reference Arc / Hash Marker */}
          {showTargetMarker && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-slate-400/60 dark:text-white/40"
              strokeWidth={strokeWidth + 4}
              strokeDasharray={`3 ${circumference}`}
              strokeDashoffset={-(arcLength * targetNormalized)}
              transform={`rotate(150 ${center} ${center})`}
            />
          )}

          {/* Active Value Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#gauge-grad-${size})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={currentOffset}
            strokeLinecap="round"
            transform={`rotate(150 ${center} ${center})`}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span
            className={`font-mono font-bold tracking-tight tabular-nums transition-colors duration-300 ${config.fontSize}`}
            style={{ color: health.color }}
          >
            {formatPercent(margin)}
          </span>

          {profitAmount !== undefined && (
            <span className="font-mono text-xs text-slate-400 font-medium tracking-tight mt-0.5">
              {profitAmount >= 0 ? '+' : ''}{formatCurrency(profitAmount, currency)} net
            </span>
          )}

          <div
            className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${health.badgeBg} ${health.badgeBorder} ${health.badgeText}`}
          >
            {health.label}
          </div>
        </div>
      </div>

      {/* Label and Target info */}
      <div className="text-center mt-1">
        <p className={`font-semibold text-slate-800 dark:text-slate-200 ${config.labelSize}`}>{label}</p>
        {sublabel ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{sublabel}</p>
        ) : (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Target: <span className="text-slate-800 dark:text-slate-300 font-semibold">{formatPercent(targetMargin)}</span>
          </p>
        )}
      </div>
    </div>
  );
};
