import React, { useEffect, useRef, useCallback } from 'react';
import type { Asset, Timeframe } from './AssetSelector';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface TradingViewChartProps {
  asset: Asset;
  timeframe: Timeframe;
}

const SYMBOL_MAP: Record<Asset, string> = {
  BTC: 'BINANCE:BTCUSDT',
  ETH: 'BINANCE:ETHUSDT',
  SOL: 'BINANCE:SOLUSDT',
};

const INTERVAL_MAP: Record<Timeframe, string> = {
  '1H': '60',
  '4H': '240',
  '1D': 'D',
};

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

export default function TradingViewChart({ asset, timeframe }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<unknown>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const containerId = 'tradingview_chart_widget';

  const initWidget = useCallback(() => {
    if (!containerRef.current) return;

    // Clear previous widget content
    const inner = document.getElementById(containerId);
    if (inner) inner.innerHTML = '';

    const config = {
      autosize: true,
      symbol: SYMBOL_MAP[asset],
      interval: INTERVAL_MAP[timeframe],
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#0e0e1a',
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: containerId,
      backgroundColor: 'rgba(14, 14, 26, 1)',
      gridColor: 'rgba(40, 40, 70, 0.5)',
      allow_symbol_change: false,
      studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
      withdateranges: true,
    };

    if (window.TradingView) {
      widgetRef.current = new window.TradingView.widget(config);
    }
  }, [asset, timeframe]);

  useEffect(() => {
    // Remove old script if exists
    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      initWidget();
    };
    script.onerror = () => {
      // Script failed to load — fallback will be shown via CSS
      const fallback = document.getElementById('tv-fallback');
      if (fallback) fallback.style.display = 'flex';
      const chartArea = document.getElementById(containerId);
      if (chartArea) chartArea.style.display = 'none';
    };

    scriptRef.current = script;
    document.head.appendChild(script);

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, []);

  // Re-init widget when asset or timeframe changes (after script is loaded)
  useEffect(() => {
    if (window.TradingView) {
      initWidget();
    }
  }, [asset, timeframe, initWidget]);

  return (
    <div className="relative w-full" style={{ height: '480px' }}>
      {/* TradingView container */}
      <div
        ref={containerRef}
        className="tradingview-widget-container w-full h-full"
        style={{ background: 'oklch(0.12 0.015 255)' }}
      >
        <div
          id={containerId}
          className="w-full h-full"
        />
      </div>

      {/* Fallback UI (hidden by default, shown if script fails) */}
      <div
        id="tv-fallback"
        className="absolute inset-0 hidden flex-col items-center justify-center gap-4"
        style={{ background: 'oklch(0.14 0.015 255)', display: 'none' }}
      >
        <AlertTriangle className="w-10 h-10" style={{ color: 'oklch(0.78 0.17 85)' }} />
        <div className="text-center">
          <p className="font-semibold mb-1" style={{ color: 'oklch(0.85 0.01 240)' }}>
            Chart could not be loaded
          </p>
          <p className="text-sm mb-4" style={{ color: 'oklch(0.5 0.02 240)' }}>
            The TradingView widget may be blocked by your browser or network.
          </p>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${SYMBOL_MAP[asset]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'oklch(0.58 0.22 255)',
              color: 'oklch(0.98 0 0)',
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Open on TradingView
          </a>
        </div>
      </div>
    </div>
  );
}
