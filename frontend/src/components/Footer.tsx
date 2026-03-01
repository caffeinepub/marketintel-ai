import React from 'react';
import { AlertTriangle, Heart } from 'lucide-react';

export default function Footer() {
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'marketintel-ai'
  );

  return (
    <footer
      className="border-t px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2"
      style={{
        background: 'oklch(0.14 0.015 255)',
        borderColor: 'oklch(0.28 0.025 255)',
      }}
    >
      {/* Disclaimer */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: 'oklch(0.78 0.17 85)' }} />
        <p className="text-xs font-medium" style={{ color: 'oklch(0.55 0.02 240)' }}>
          This is not financial advice. No profits are guaranteed.
        </p>
      </div>

      {/* Attribution */}
      <p className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.4 0.02 240)' }}>
        Built with{' '}
        <Heart className="w-3 h-3 inline" style={{ color: 'oklch(0.62 0.22 25)' }} />
        {' '}using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          style={{ color: 'oklch(0.65 0.18 255)' }}
        >
          caffeine.ai
        </a>
        {' '}· © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
