import React, { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useSaveAnalysis } from './hooks/useQueries';
import { generateAnalysis } from './utils/analysisGenerator';
import type { AnalysisRecord } from './backend';
import type { Asset, Timeframe } from './components/AssetSelector';

import LoginScreen from './components/LoginScreen';
import TopBar from './components/TopBar';
import AssetSelector from './components/AssetSelector';
import TradingViewChart from './components/TradingViewChart';
import AnalysisCard from './components/AnalysisCard';
import HistoryTab from './components/HistoryTab';
import Footer from './components/Footer';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LayoutDashboard, History, Cpu, Loader2 } from 'lucide-react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [selectedAsset, setSelectedAsset] = useState<Asset>('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const saveAnalysis = useSaveAnalysis();

  // Show loading spinner while auth is initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'oklch(0.12 0.015 255)' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.58 0.22 255)' }} />
          <p className="text-sm" style={{ color: 'oklch(0.5 0.02 240)' }}>Initializing...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const handleAnalyze = async () => {
    const analysis = generateAnalysis(selectedAsset, selectedTimeframe);
    setCurrentAnalysis(analysis);

    // Save to backend
    try {
      await saveAnalysis.mutateAsync(analysis);
    } catch (err) {
      // Analysis is still shown even if save fails
      console.error('Failed to save analysis:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.12 0.015 255)' }}>
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          {/* Tab Navigation */}
          <div className="px-4 md:px-6 pt-3 pb-0 border-b"
            style={{ borderColor: 'oklch(0.28 0.025 255)' }}>
            <TabsList
              className="h-9 p-0.5 gap-0.5"
              style={{
                background: 'oklch(0.18 0.018 255)',
                border: '1px solid oklch(0.28 0.025 255)',
              }}
            >
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-1.5 text-xs font-medium px-3 h-8 data-[state=active]:text-white"
                style={{
                  color: activeTab === 'dashboard' ? 'oklch(0.93 0.01 240)' : 'oklch(0.55 0.02 240)',
                }}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-1.5 text-xs font-medium px-3 h-8 data-[state=active]:text-white"
                style={{
                  color: activeTab === 'history' ? 'oklch(0.93 0.01 240)' : 'oklch(0.55 0.02 240)',
                }}
              >
                <History className="w-3.5 h-3.5" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
            {/* Asset Selector */}
            <AssetSelector
              selectedAsset={selectedAsset}
              selectedTimeframe={selectedTimeframe}
              onAssetChange={setSelectedAsset}
              onTimeframeChange={setSelectedTimeframe}
            />

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {/* TradingView Chart */}
              <div className="border-b" style={{ borderColor: 'oklch(0.28 0.025 255)' }}>
                <TradingViewChart asset={selectedAsset} timeframe={selectedTimeframe} />
              </div>

              {/* Analyze Section */}
              <div className="px-4 md:px-6 py-4 space-y-4">
                {/* Analyze Button */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={saveAnalysis.isPending}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: saveAnalysis.isPending
                        ? 'oklch(0.45 0.18 255)'
                        : 'oklch(0.58 0.22 255)',
                      color: 'oklch(0.98 0 0)',
                      boxShadow: saveAnalysis.isPending
                        ? 'none'
                        : '0 0 20px oklch(0.58 0.22 255 / 0.35)',
                    }}
                  >
                    {saveAnalysis.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4" />
                        Analyze {selectedAsset} / {selectedTimeframe}
                      </>
                    )}
                  </button>

                  {saveAnalysis.isError && (
                    <p className="text-xs" style={{ color: 'oklch(0.62 0.22 25)' }}>
                      Analysis generated but failed to save to history.
                    </p>
                  )}

                  {saveAnalysis.isSuccess && currentAnalysis && (
                    <p className="text-xs" style={{ color: 'oklch(0.72 0.19 145)' }}>
                      ✓ Analysis saved to history
                    </p>
                  )}
                </div>

                {/* Analysis Card */}
                {currentAnalysis && (
                  <AnalysisCard record={currentAnalysis} />
                )}

                {!currentAnalysis && (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-xl"
                    style={{
                      background: 'oklch(0.16 0.018 255)',
                      border: '1px dashed oklch(0.28 0.025 255)',
                    }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'oklch(0.58 0.22 255 / 0.1)' }}>
                      <Cpu className="w-5 h-5" style={{ color: 'oklch(0.65 0.18 255)' }} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm mb-1" style={{ color: 'oklch(0.6 0.02 240)' }}>
                        No analysis yet
                      </p>
                      <p className="text-xs" style={{ color: 'oklch(0.4 0.02 240)' }}>
                        Click "Analyze" to generate an AI-powered market analysis for {selectedAsset}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
