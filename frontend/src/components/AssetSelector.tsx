import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bitcoin, ChevronDown } from 'lucide-react';

export type Asset = 'BTC' | 'ETH' | 'SOL';
export type Timeframe = '1H' | '4H' | '1D';

interface AssetSelectorProps {
  selectedAsset: Asset;
  selectedTimeframe: Timeframe;
  onAssetChange: (asset: Asset) => void;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const ASSETS: { value: Asset; label: string; symbol: string }[] = [
  { value: 'BTC', label: 'Bitcoin', symbol: '₿' },
  { value: 'ETH', label: 'Ethereum', symbol: 'Ξ' },
  { value: 'SOL', label: 'Solana', symbol: '◎' },
];

const TIMEFRAMES: Timeframe[] = ['1H', '4H', '1D'];

export default function AssetSelector({
  selectedAsset,
  selectedTimeframe,
  onAssetChange,
  onTimeframeChange,
}: AssetSelectorProps) {
  const selectedAssetInfo = ASSETS.find((a) => a.value === selectedAsset);

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-3 border-b"
      style={{
        background: 'oklch(0.16 0.018 255)',
        borderColor: 'oklch(0.28 0.025 255)',
      }}>
      {/* Asset Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: 'oklch(0.5 0.02 240)' }}>
          Asset
        </span>
        <Select value={selectedAsset} onValueChange={(v) => onAssetChange(v as Asset)}>
          <SelectTrigger
            className="w-36 h-8 text-sm border-0 font-medium"
            style={{
              background: 'oklch(0.22 0.02 255)',
              color: 'oklch(0.9 0.01 240)',
              border: '1px solid oklch(0.28 0.025 255)',
            }}
          >
            <SelectValue>
              <span className="flex items-center gap-2">
                <span style={{ color: 'oklch(0.7 0.2 255)' }}>{selectedAssetInfo?.symbol}</span>
                <span>{selectedAsset}</span>
                <span className="text-xs" style={{ color: 'oklch(0.5 0.02 240)' }}>
                  {selectedAssetInfo?.label}
                </span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            style={{
              background: 'oklch(0.2 0.02 255)',
              border: '1px solid oklch(0.28 0.025 255)',
            }}
          >
            {ASSETS.map((asset) => (
              <SelectItem
                key={asset.value}
                value={asset.value}
                className="text-sm cursor-pointer"
                style={{ color: 'oklch(0.9 0.01 240)' }}
              >
                <span className="flex items-center gap-2">
                  <span style={{ color: 'oklch(0.7 0.2 255)' }}>{asset.symbol}</span>
                  <span className="font-medium">{asset.value}</span>
                  <span className="text-xs" style={{ color: 'oklch(0.5 0.02 240)' }}>
                    {asset.label}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Divider */}
      <div className="w-px h-5" style={{ background: 'oklch(0.28 0.025 255)' }} />

      {/* Timeframe Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: 'oklch(0.5 0.02 240)' }}>
          Timeframe
        </span>
        <div className="flex items-center gap-1 p-0.5 rounded-lg"
          style={{ background: 'oklch(0.22 0.02 255)', border: '1px solid oklch(0.28 0.025 255)' }}>
          {TIMEFRAMES.map((tf) => {
            const isActive = tf === selectedTimeframe;
            return (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className="px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150"
                style={
                  isActive
                    ? {
                        background: 'oklch(0.58 0.22 255)',
                        color: 'oklch(0.98 0 0)',
                        boxShadow: '0 0 10px oklch(0.58 0.22 255 / 0.4)',
                      }
                    : {
                        background: 'transparent',
                        color: 'oklch(0.6 0.02 240)',
                      }
                }
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset price indicator (decorative) */}
      <div className="ml-auto hidden sm:flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse-blue"
          style={{ background: 'oklch(0.72 0.19 145)' }} />
        <span className="text-xs" style={{ color: 'oklch(0.5 0.02 240)' }}>
          Live data via TradingView
        </span>
      </div>
    </div>
  );
}
