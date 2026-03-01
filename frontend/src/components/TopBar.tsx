import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Activity } from 'lucide-react';

export default function TopBar() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 border-b"
      style={{
        background: 'oklch(0.14 0.015 255 / 0.95)',
        borderColor: 'oklch(0.28 0.025 255)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg blur-md opacity-30"
            style={{ background: 'oklch(0.58 0.22 255)' }} />
          <img
            src="/assets/generated/marketintel-logo.dim_128x128.png"
            alt="MarketIntel AI"
            className="relative w-8 h-8 rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg tracking-tight text-gradient-blue">
            MarketIntel AI
          </span>
          <span className="hidden sm:flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{
              background: 'oklch(0.58 0.22 255 / 0.15)',
              color: 'oklch(0.7 0.2 255)',
              border: '1px solid oklch(0.58 0.22 255 / 0.3)'
            }}>
            <Activity className="w-2.5 h-2.5" />
            LIVE
          </span>
        </div>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-3">
        {identity && (
          <span className="hidden md:block text-xs font-mono truncate max-w-32"
            style={{ color: 'oklch(0.5 0.02 240)' }}>
            {identity.getPrincipal().toString().slice(0, 12)}...
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
          style={{
            background: 'oklch(0.22 0.02 255)',
            color: 'oklch(0.75 0.02 240)',
            border: '1px solid oklch(0.28 0.025 255)',
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
