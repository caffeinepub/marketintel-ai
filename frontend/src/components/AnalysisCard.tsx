import React from 'react';
import type { AnalysisRecord } from '../backend';
import { TrendingUp, TrendingDown, Activity, Shield, BarChart2, FileText, Clock } from 'lucide-react';

interface AnalysisCardProps {
  record: AnalysisRecord;
  compact?: boolean;
}

export function getRiskColor(riskLevel: string): { bg: string; text: string; border: string; dot: string } {
  switch (riskLevel) {
    case 'Low':
      return {
        bg: 'oklch(0.72 0.19 145 / 0.15)',
        text: 'oklch(0.72 0.19 145)',
        border: 'oklch(0.72 0.19 145 / 0.4)',
        dot: 'oklch(0.72 0.19 145)',
      };
    case 'Medium':
      return {
        bg: 'oklch(0.78 0.17 85 / 0.15)',
        text: 'oklch(0.78 0.17 85)',
        border: 'oklch(0.78 0.17 85 / 0.4)',
        dot: 'oklch(0.78 0.17 85)',
      };
    case 'High':
      return {
        bg: 'oklch(0.62 0.22 25 / 0.15)',
        text: 'oklch(0.62 0.22 25)',
        border: 'oklch(0.62 0.22 25 / 0.4)',
        dot: 'oklch(0.62 0.22 25)',
      };
    default:
      return {
        bg: 'oklch(0.5 0.02 240 / 0.15)',
        text: 'oklch(0.6 0.02 240)',
        border: 'oklch(0.5 0.02 240 / 0.4)',
        dot: 'oklch(0.6 0.02 240)',
      };
  }
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (price >= 10) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(3)}`;
}

export default function AnalysisCard({ record, compact = false }: AnalysisCardProps) {
  const riskColors = getRiskColor(record.riskLevel);
  const isBullish = record.trend === 'Bullish';

  return (
    <div
      className="animate-fade-in rounded-xl overflow-hidden"
      style={{
        background: 'oklch(0.18 0.018 255)',
        border: '1px solid oklch(0.28 0.025 255)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'oklch(0.28 0.025 255)', background: 'oklch(0.16 0.018 255)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base" style={{ color: 'oklch(0.93 0.01 240)' }}>
              {record.assetSymbol}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'oklch(0.58 0.22 255 / 0.15)',
                color: 'oklch(0.7 0.2 255)',
                border: '1px solid oklch(0.58 0.22 255 / 0.3)',
              }}>
              {record.timeframe}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Risk Badge */}
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: riskColors.bg,
              color: riskColors.text,
              border: `1px solid ${riskColors.border}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: riskColors.dot }} />
            {record.riskLevel} Risk
          </span>
          {!compact && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.45 0.02 240)' }}>
              <Clock className="w-3 h-3" />
              {formatTimestamp(record.timestamp)}
            </span>
          )}
        </div>
      </div>

      <div className={`p-4 ${compact ? 'space-y-3' : 'space-y-4'}`}>
        {/* Trend + RSI Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Trend */}
          <div className="rounded-lg p-3"
            style={{
              background: isBullish
                ? 'oklch(0.72 0.19 145 / 0.08)'
                : 'oklch(0.62 0.22 25 / 0.08)',
              border: `1px solid ${isBullish ? 'oklch(0.72 0.19 145 / 0.25)' : 'oklch(0.62 0.22 25 / 0.25)'}`,
            }}>
            <div className="flex items-center gap-1.5 mb-1">
              {isBullish
                ? <TrendingUp className="w-3.5 h-3.5" style={{ color: 'oklch(0.72 0.19 145)' }} />
                : <TrendingDown className="w-3.5 h-3.5" style={{ color: 'oklch(0.62 0.22 25)' }} />
              }
              <span className="text-xs" style={{ color: 'oklch(0.5 0.02 240)' }}>Trend</span>
            </div>
            <p className="font-display font-bold text-sm"
              style={{ color: isBullish ? 'oklch(0.72 0.19 145)' : 'oklch(0.62 0.22 25)' }}>
              {record.trend}
            </p>
          </div>

          {/* RSI Status */}
          <div className="rounded-lg p-3"
            style={{
              background: 'oklch(0.22 0.02 255)',
              border: '1px solid oklch(0.28 0.025 255)',
            }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5" style={{ color: 'oklch(0.7 0.2 255)' }} />
              <span className="text-xs" style={{ color: 'oklch(0.5 0.02 240)' }}>RSI Status</span>
            </div>
            <p className="font-display font-bold text-sm" style={{ color: 'oklch(0.85 0.01 240)' }}>
              {record.rsiStatus}
            </p>
          </div>
        </div>

        {/* Support / Resistance */}
        <div className="grid grid-cols-2 gap-3">
          {/* Support */}
          <div className="rounded-lg p-3"
            style={{
              background: 'oklch(0.72 0.19 145 / 0.06)',
              border: '1px solid oklch(0.72 0.19 145 / 0.2)',
            }}>
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart2 className="w-3.5 h-3.5" style={{ color: 'oklch(0.72 0.19 145)' }} />
              <span className="text-xs font-medium" style={{ color: 'oklch(0.72 0.19 145)' }}>Support</span>
            </div>
            <div className="space-y-1">
              {record.supportLevels.map((level, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'oklch(0.45 0.02 240)' }}>S{i + 1}</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: 'oklch(0.8 0.01 240)' }}>
                    {formatPrice(level)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resistance */}
          <div className="rounded-lg p-3"
            style={{
              background: 'oklch(0.62 0.22 25 / 0.06)',
              border: '1px solid oklch(0.62 0.22 25 / 0.2)',
            }}>
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart2 className="w-3.5 h-3.5" style={{ color: 'oklch(0.62 0.22 25)' }} />
              <span className="text-xs font-medium" style={{ color: 'oklch(0.62 0.22 25)' }}>Resistance</span>
            </div>
            <div className="space-y-1">
              {record.resistanceLevels.map((level, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'oklch(0.45 0.02 240)' }}>R{i + 1}</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: 'oklch(0.8 0.01 240)' }}>
                    {formatPrice(level)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        {!compact && (
          <div className="rounded-lg p-3"
            style={{
              background: 'oklch(0.22 0.02 255)',
              border: '1px solid oklch(0.28 0.025 255)',
            }}>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5" style={{ color: 'oklch(0.7 0.2 255)' }} />
              <span className="text-xs font-medium" style={{ color: 'oklch(0.6 0.02 240)' }}>AI Summary</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.72 0.01 240)' }}>
              {record.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
