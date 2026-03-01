import type { AnalysisRecord } from '../backend';

// Seeded pseudo-random number generator (mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Base price ranges per asset
const BASE_PRICES: Record<string, { base: number; range: number }> = {
  BTC: { base: 65000, range: 15000 },
  ETH: { base: 3200, range: 800 },
  SOL: { base: 145, range: 40 },
};

// Timeframe multipliers for volatility
const TIMEFRAME_VOLATILITY: Record<string, number> = {
  '1H': 0.005,
  '4H': 0.012,
  '1D': 0.025,
};

export function generateAnalysis(asset: string, timeframe: string): AnalysisRecord {
  // Use date (day) + asset + timeframe as seed so it changes daily but is deterministic per session
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const seed = hashString(`${asset}-${timeframe}-${dateKey}`);
  const rand = mulberry32(seed);

  const priceConfig = BASE_PRICES[asset] || BASE_PRICES['BTC'];
  const volatility = TIMEFRAME_VOLATILITY[timeframe] || 0.01;

  // Generate base price
  const basePrice = priceConfig.base + (rand() - 0.5) * priceConfig.range;

  // Trend determination
  const trendRoll = rand();
  const trend = trendRoll > 0.45 ? 'Bullish' : 'Bearish';

  // RSI value (30-80 range)
  const rsiValue = 30 + rand() * 50;
  let rsiStatus: string;
  if (rsiValue > 70) {
    rsiStatus = 'Overbought';
  } else if (rsiValue < 40) {
    rsiStatus = 'Oversold';
  } else {
    rsiStatus = 'Neutral';
  }

  // Support levels (below current price)
  const supportOffset1 = basePrice * volatility * (1 + rand() * 2);
  const supportOffset2 = basePrice * volatility * (2 + rand() * 3);
  const supportOffset3 = basePrice * volatility * (4 + rand() * 4);
  const supportLevels = [
    parseFloat((basePrice - supportOffset1).toFixed(2)),
    parseFloat((basePrice - supportOffset2).toFixed(2)),
    parseFloat((basePrice - supportOffset3).toFixed(2)),
  ].sort((a, b) => b - a);

  // Resistance levels (above current price)
  const resistOffset1 = basePrice * volatility * (1 + rand() * 2);
  const resistOffset2 = basePrice * volatility * (2 + rand() * 3);
  const resistOffset3 = basePrice * volatility * (4 + rand() * 4);
  const resistanceLevels = [
    parseFloat((basePrice + resistOffset1).toFixed(2)),
    parseFloat((basePrice + resistOffset2).toFixed(2)),
    parseFloat((basePrice + resistOffset3).toFixed(2)),
  ].sort((a, b) => a - b);

  // Risk level
  const riskRoll = rand();
  let riskLevel: string;
  if (riskRoll < 0.33) {
    riskLevel = 'Low';
  } else if (riskRoll < 0.66) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }

  // Format price for display
  const formatPrice = (p: number) => {
    if (p >= 1000) return `$${p.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (p >= 10) return `$${p.toFixed(2)}`;
    return `$${p.toFixed(3)}`;
  };

  // Generate summary
  const summaries: Record<string, Record<string, string[]>> = {
    Bullish: {
      Low: [
        `${asset} is showing strong upward momentum on the ${timeframe} chart. Price action remains above key moving averages with healthy volume. RSI at ${rsiValue.toFixed(0)} suggests ${rsiStatus.toLowerCase()} conditions. The risk profile is favorable for long positions with tight stops near ${formatPrice(supportLevels[0])}.`,
        `${asset} maintains a constructive technical structure on the ${timeframe} timeframe. Buyers are in control with price consolidating above support at ${formatPrice(supportLevels[0])}. Low volatility environment reduces downside risk. Consider scaling into positions on any minor pullbacks.`,
      ],
      Medium: [
        `${asset} is trending higher on the ${timeframe} chart but faces overhead resistance at ${formatPrice(resistanceLevels[0])}. RSI reads ${rsiValue.toFixed(0)}, indicating ${rsiStatus.toLowerCase()} momentum. A breakout above resistance could accelerate gains, while a rejection may trigger a retest of ${formatPrice(supportLevels[0])}.`,
        `Bullish bias on ${asset} ${timeframe} with moderate risk. Price is approaching a key resistance zone at ${formatPrice(resistanceLevels[0])}. Volume confirmation will be critical for a sustained move higher. Manage position size accordingly given the elevated uncertainty.`,
      ],
      High: [
        `${asset} shows bullish signals on the ${timeframe} chart, but elevated volatility warrants caution. RSI at ${rsiValue.toFixed(0)} (${rsiStatus.toLowerCase()}) and wide price swings increase the risk of sharp reversals. Resistance at ${formatPrice(resistanceLevels[0])} is a critical level to watch. Only risk capital you can afford to lose.`,
        `Strong upward pressure on ${asset} ${timeframe}, but high-risk conditions prevail. The spread between support (${formatPrice(supportLevels[0])}) and resistance (${formatPrice(resistanceLevels[0])}) is wide, reflecting market uncertainty. Aggressive moves in either direction are possible.`,
      ],
    },
    Bearish: {
      Low: [
        `${asset} is in a controlled downtrend on the ${timeframe} chart. Price is trading below key resistance at ${formatPrice(resistanceLevels[0])} with orderly selling pressure. RSI at ${rsiValue.toFixed(0)} (${rsiStatus.toLowerCase()}) suggests limited downside momentum. Support at ${formatPrice(supportLevels[0])} may provide a short-term bounce.`,
        `Mild bearish pressure on ${asset} ${timeframe}. The trend is down but not accelerating, with support holding at ${formatPrice(supportLevels[0])}. Low risk environment means moves are measured. Watch for a potential reversal if buyers defend the ${formatPrice(supportLevels[1])} level.`,
      ],
      Medium: [
        `${asset} is under selling pressure on the ${timeframe} chart. Price has broken below ${formatPrice(supportLevels[0])} and is testing the next support at ${formatPrice(supportLevels[1])}. RSI at ${rsiValue.toFixed(0)} (${rsiStatus.toLowerCase()}) with moderate downside risk. A bounce is possible but the trend remains bearish.`,
        `Bearish structure on ${asset} ${timeframe} with medium risk. Sellers are in control below ${formatPrice(resistanceLevels[0])}. Key support at ${formatPrice(supportLevels[0])} is being tested. A break lower could accelerate selling toward ${formatPrice(supportLevels[1])}.`,
      ],
      High: [
        `${asset} is experiencing significant selling pressure on the ${timeframe} chart. RSI at ${rsiValue.toFixed(0)} (${rsiStatus.toLowerCase()}) with high volatility. Support at ${formatPrice(supportLevels[0])} is at risk of breaking. High-risk environment — extreme caution advised for any directional trades.`,
        `Strong bearish momentum on ${asset} ${timeframe} with elevated risk. Price is in freefall below ${formatPrice(resistanceLevels[0])} with limited support until ${formatPrice(supportLevels[1])}. Volatility is high and conditions can change rapidly. Avoid overleveraged positions.`,
      ],
    },
  };

  const trendSummaries = summaries[trend][riskLevel];
  const summaryIndex = Math.floor(rand() * trendSummaries.length);
  const summary = trendSummaries[summaryIndex];

  return {
    assetSymbol: asset,
    timeframe,
    trend,
    rsiStatus,
    supportLevels,
    resistanceLevels,
    riskLevel,
    summary,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000), // nanoseconds
  };
}
