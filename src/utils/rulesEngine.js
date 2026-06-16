export function getRecommendation(position) {
  const gainPercent =
    ((position.currentPrice - position.costBasis) /
      position.costBasis) *
    100;

  if (gainPercent >= 100) {
    return {
      action: "Take Partial Profit",
      confidence: 95,
    };
  }

  if (gainPercent >= 20) {
    return {
      action: "Hold Position",
      confidence: 88,
    };
  }

  if (gainPercent < 0) {
    return {
      action: "Review Position",
      confidence: 70,
    };
  }

  return {
    action: "Monitor",
    confidence: 60,
  };
}