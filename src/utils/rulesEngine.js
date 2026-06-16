export function calculatePosition(position) {
  const invested = position.shares * position.costBasis;
  const currentValue = position.shares * position.currentPrice;
  const profit = currentValue - invested;
  const gainPercent = (profit / invested) * 100;

  return {
    invested,
    currentValue,
    profit,
    gainPercent,
  };
}

export function getRecommendation(position) {
  const { gainPercent } = calculatePosition(position);

  if (position.ethicalScore < 75) {
    return {
      action: "Review Values Fit",
      reason: "This holding may need a closer ethical review.",
      confidence: 72,
    };
  }

  if (gainPercent >= 100) {
    return {
      action: "Split Profit",
      reason: "You doubled your position. Consider splitting profit between long-term and short-term buckets.",
      confidence: 94,
    };
  }

  if (gainPercent >= 25 && position.trend === "fast") {
    return {
      action: "Hold Carefully",
      reason: "Strong short-term momentum, but fast growth can carry more volatility.",
      confidence: 84,
    };
  }

  if (gainPercent >= 15) {
    return {
      action: "Continue Holding",
      reason: "This position is showing healthy upward movement.",
      confidence: 88,
    };
  }

  if (gainPercent < 0) {
    return {
      action: "Review Before Adding",
      reason: "This position is currently below your cost basis.",
      confidence: 70,
    };
  }

  return {
    action: "Monitor",
    reason: "Stable position. No urgent action needed.",
    confidence: 64,
  };
}