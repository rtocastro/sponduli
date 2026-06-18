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

  if (position.ethicalScore < 65) {
    return {
      action: "Consider Exiting",
      reason:
        "This holding is below your values threshold. Review whether it still belongs in your portfolio.",
      confidence: 90,
    };
  }

  if (position.ethicalScore < 75) {
    return {
      action: "Review Values Fit",
      reason: "This holding may need a closer ethical review before adding more.",
      confidence: 72,
    };
  }

  if (gainPercent <= -20 && position.trend === "down") {
    return {
      action: "Consider Reducing",
      reason:
        "This position is down sharply and showing downward trend behavior. Review whether reducing exposure makes sense.",
      confidence: 86,
    };
  }

  if (gainPercent <= -10) {
    return {
      action: "Review Before Adding",
      reason:
        "This position is currently below your cost basis. Avoid adding more until the trend improves.",
      confidence: 76,
    };
  }

  if (gainPercent >= 100) {
    return {
      action: "Split Profit",
      reason:
        "You doubled your position. Consider splitting profit between long-term growth and short-term momentum buckets.",
      confidence: 94,
    };
  }

  if (gainPercent >= 50 && position.trend === "fast") {
    return {
      action: "Take Partial Profit",
      reason:
        "This position has grown quickly. Consider locking in a portion while keeping some exposure.",
      confidence: 90,
    };
  }

  if (gainPercent >= 25 && position.trend === "fast") {
    return {
      action: "Hold Carefully",
      reason:
        "Strong short-term momentum, but fast growth can carry more volatility.",
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

  return {
    action: "Monitor",
    reason: "Stable position. No urgent action needed.",
    confidence: 64,
  };
}