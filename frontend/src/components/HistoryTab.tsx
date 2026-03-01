import React, { useState } from 'react';
import { useGetAnalysisHistory } from '../hooks/useQueries';
import AnalysisCard, { getRiskColor } from './AnalysisCard';
import type { AnalysisRecord } from '../backend';
import { Clock, ChevronDown, ChevronUp, RefreshCw, History, TrendingUp, TrendingDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

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

function HistoryItem({ record, isExpanded, onToggle }: {
  record: AnalysisRecord;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const riskColors = getRiskColor(record.riskLevel);
  const isBullish = record.trend === 'Bullish';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: 'oklch(0.18 0.018 255)',
        border: `1px solid ${isExpanded ? 'oklch(0.58 0.22 255 / 0.4)' : 'oklch(0.28 0.025 255)'}`,
      }}
    >
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        {/* Asset + Timeframe */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-display font-bold text-sm" style={{ color: 'oklch(0.93 0.01 240)' }}>
            {record.assetSymbol}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded"
            style={{
              background: 'oklch(0.58 0.22 255 / 0.15)',
              color: 'oklch(0.7 0.2 255)',
            }}>
            {record.timeframe}
          </span>

          {/* Trend indicator */}
          <span className="flex items-center gap-1 text-xs"
            style={{ color: isBullish ? 'oklch(0.72 0.19 145)' : 'oklch(0.62 0.22 25)' }}>
            {isBullish
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />
            }
            <span className="hidden sm:inline">{record.trend}</span>
          </span>
        </div>

        {/* Risk badge */}
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
          style={{
            background: riskColors.bg,
            color: riskColors.text,
            border: `1px solid ${riskColors.border}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: riskColors.dot }} />
          {record.riskLevel}
        </span>

        {/* Timestamp */}
        <span className="hidden md:flex items-center gap-1 text-xs shrink-0"
          style={{ color: 'oklch(0.45 0.02 240)' }}>
          <Clock className="w-3 h-3" />
          {formatTimestamp(record.timestamp)}
        </span>

        {/* Expand icon */}
        <div style={{ color: 'oklch(0.5 0.02 240)' }}>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: 'oklch(0.28 0.025 255)' }}>
          <div className="pt-4">
            <AnalysisCard record={record} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryTab() {
  const { data: history, isLoading, isError, refetch, isFetching } = useGetAnalysisHistory();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b"
        style={{ borderColor: 'oklch(0.28 0.025 255)' }}>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4" style={{ color: 'oklch(0.7 0.2 255)' }} />
          <h2 className="font-display font-semibold text-base" style={{ color: 'oklch(0.93 0.01 240)' }}>
            Analysis History
          </h2>
          {history && history.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'oklch(0.58 0.22 255 / 0.15)',
                color: 'oklch(0.7 0.2 255)',
              }}>
              {history.length} records
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-50"
          style={{
            background: 'oklch(0.22 0.02 255)',
            color: 'oklch(0.65 0.02 240)',
            border: '1px solid oklch(0.28 0.025 255)',
          }}
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="px-4 md:px-6 py-4 space-y-2">
          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl"
                  style={{ background: 'oklch(0.22 0.02 255)' }} />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-sm" style={{ color: 'oklch(0.62 0.22 25)' }}>
                Failed to load analysis history.
              </p>
              <button
                onClick={() => refetch()}
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{
                  background: 'oklch(0.58 0.22 255)',
                  color: 'oklch(0.98 0 0)',
                }}
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && (!history || history.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(0.22 0.02 255)' }}>
                <History className="w-6 h-6" style={{ color: 'oklch(0.45 0.02 240)' }} />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm mb-1" style={{ color: 'oklch(0.65 0.02 240)' }}>
                  No analyses yet
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.45 0.02 240)' }}>
                  Run your first analysis from the Dashboard tab to see it here.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && history && history.length > 0 && (
            <div className="space-y-2">
              {history.map((record, index) => (
                <HistoryItem
                  key={`${record.assetSymbol}-${record.timeframe}-${record.timestamp.toString()}`}
                  record={record}
                  isExpanded={expandedIndex === index}
                  onToggle={() => toggleItem(index)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
