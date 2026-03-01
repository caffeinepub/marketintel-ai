# Specification

## Summary
**Goal:** Build a crypto market analysis dashboard on the Internet Computer with Internet Identity authentication, TradingView chart embedding, simulated AI analysis generation, and persistent analysis history stored on a Motoko backend.

**Planned changes:**
- Implement Internet Identity authentication; gate the entire dashboard behind a centered login screen with app logo and "Login with Internet Identity" button
- Add a persistent top navigation bar showing "MarketIntel AI" on the left and a "Logout" button on the right
- Add asset selection (BTC, ETH, SOL dropdown) and timeframe toggle buttons (1H, 4H, 1D) below the top bar
- Embed a TradingView Advanced Chart widget that updates based on selected asset and timeframe, with a graceful fallback if embedding fails
- Add an "Analyze" button that generates a deterministic simulated Analysis Card showing Trend, RSI Status, Support/Resistance levels, color-coded Risk Badge, and a Summary paragraph — values vary by asset and timeframe
- Save each generated analysis to a Motoko backend actor keyed by user principal, storing all fields plus timestamp in stable storage
- Add a "History" tab listing all previous analyses for the authenticated user (newest first), each showing asset, timeframe, risk badge, and timestamp; clicking an item reveals the full Analysis Card
- Display a persistent footer on all authenticated views with: "This is not financial advice. No profits are guaranteed."
- Apply a dark fintech theme: deep charcoal background, electric blue primary buttons/active states, light text, color-coded risk badges (green/yellow/red), subtle card surfaces and glow/shadow effects

**User-visible outcome:** Authenticated users can select a crypto asset and timeframe, view a live TradingView chart, generate a simulated market analysis card, and browse their full analysis history — all persisted across sessions via Internet Identity.
