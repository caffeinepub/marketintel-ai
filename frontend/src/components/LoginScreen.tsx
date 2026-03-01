import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { TrendingUp, Shield, BarChart2, Zap } from 'lucide-react';

export default function LoginScreen() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'oklch(0.12 0.015 255)' }}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(oklch(0.58 0.22 255) 1px, transparent 1px), linear-gradient(90deg, oklch(0.58 0.22 255) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'oklch(0.58 0.22 255)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl"
        style={{ background: 'oklch(0.55 0.2 280)' }} />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-40"
              style={{ background: 'oklch(0.58 0.22 255)' }} />
            <img
              src="/assets/generated/marketintel-logo.dim_128x128.png"
              alt="MarketIntel AI Logo"
              className="relative w-20 h-20 rounded-2xl"
            />
          </div>
          <h1 className="font-display text-4xl font-bold text-gradient-blue tracking-tight">
            MarketIntel AI
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'oklch(0.6 0.02 240)' }}>
            Professional Crypto Market Analysis
          </p>
        </div>

        {/* Feature highlights */}
        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: BarChart2, label: 'Live Charts', desc: 'Real-time TradingView' },
            { icon: TrendingUp, label: 'AI Analysis', desc: 'Trend & RSI signals' },
            { icon: Shield, label: 'Risk Scoring', desc: 'Color-coded badges' },
            { icon: Zap, label: 'History', desc: 'Persistent on-chain' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card-surface p-3 flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg" style={{ background: 'oklch(0.58 0.22 255 / 0.15)' }}>
                <Icon className="w-4 h-4" style={{ color: 'oklch(0.7 0.2 255)' }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'oklch(0.9 0.01 240)' }}>{label}</p>
                <p className="text-xs" style={{ color: 'oklch(0.55 0.02 240)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Login card */}
        <div className="w-full card-surface p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold mb-1" style={{ color: 'oklch(0.93 0.01 240)' }}>
            Sign in to continue
          </h2>
          <p className="text-sm mb-5" style={{ color: 'oklch(0.55 0.02 240)' }}>
            Securely authenticate with Internet Identity to access your personalized dashboard and analysis history.
          </p>

          <button
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isLoggingIn
                ? 'oklch(0.45 0.18 255)'
                : 'oklch(0.58 0.22 255)',
              color: 'oklch(0.98 0 0)',
              boxShadow: isLoggingIn ? 'none' : '0 0 20px oklch(0.58 0.22 255 / 0.35)',
            }}
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Login with Internet Identity
              </>
            )}
          </button>

          {loginStatus === 'loginError' && (
            <p className="mt-3 text-xs text-center" style={{ color: 'oklch(0.62 0.22 25)' }}>
              Authentication failed. Please try again.
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-center" style={{ color: 'oklch(0.4 0.02 240)' }}>
          This is not financial advice. No profits are guaranteed.
        </p>
      </div>
    </div>
  );
}
