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

export function calculateOpportunityScore(item, minimumEthicalScore = 80) {
  const momentumScore = calculateMomentumScore(item);

  const ethicalBonus =
    item.ethicalScore >= minimumEthicalScore ? 12 : -18;

  const volatilityAdjustment =
    item.volatility === "low"
      ? 8
      : item.volatility === "medium"
      ? 0
      : -10;

  const rawScore =
    momentumScore * 0.6 +
    item.ethicalScore * 0.4 +
    ethicalBonus +
    volatilityAdjustment;

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

export function getEvidenceReasons(item, minimumEthicalScore = 80) {
  const reasons = [];

  if (item.oneMonthTrend > 0) {
    reasons.push("Positive 1 month trend");
  }

  if (item.threeMonthTrend > 0) {
    reasons.push("Positive 3 month trend");
  }

  if (item.sixMonthTrend > 0) {
    reasons.push("Positive 6 month trend");
  }

  if (item.ethicalScore >= minimumEthicalScore) {
    reasons.push("Meets your ethical threshold");
  }

  if (item.volatility === "low") {
    reasons.push("Lower volatility profile");
  }

  if (item.volatility === "medium") {
    reasons.push("Moderate volatility profile");
  }

  return reasons;
}