export function calculateMomentumScore(item) {
  const weightedTrend =
    item.oneMonthTrend * 0.2 +
    item.threeMonthTrend * 0.3 +
    item.sixMonthTrend * 0.5;

  const volatilityPenalty =
    item.volatility === "high" ? 12 : item.volatility === "medium" ? 6 : 0;

  const rawScore = weightedTrend * 2.5 + item.ethicalScore * 0.45 - volatilityPenalty;

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getOpportunityType(item) {
  const score = calculateMomentumScore(item);

  if (item.ethicalScore < 75) {
    return "Values Review";
  }

  if (score >= 85 && item.volatility === "low") {
    return "Strong Long-Term Candidate";
  }

  if (score >= 80 && item.volatility === "high") {
    return "High Momentum / Higher Risk";
  }

  if (score >= 70) {
    return "Worth Watching";
  }

  return "Monitor Only";
}