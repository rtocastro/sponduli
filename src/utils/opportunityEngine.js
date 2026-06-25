export function calculateOpportunityRank({
  ethicalScore = 80,
  evidenceScore = 0,
  newsCount = 0,
  earningsCount = 0,
  volatility = "medium",
}) {
  let score = 0;

  score += ethicalScore * 0.35;
  score += evidenceScore * 0.35;
  score += Math.min(newsCount, 20);
  score += Math.min(earningsCount * 5, 10);

  if (volatility === "low") score += 8;
  if (volatility === "high") score -= 8;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getOpportunityTier(score = 0) {
  if (score >= 90) return "Excellent Fit";
  if (score >= 80) return "Strong Candidate";
  if (score >= 70) return "Worth Reviewing";
  return "Needs More Evidence";
}

export function getOpportunityReason(item) {
  const reasons = [];

  if (item.ethicalScore >= 85) {
    reasons.push("Strong values alignment");
  }

  if (item.newsCount > 0) {
    reasons.push(`${item.newsCount} recent news items found`);
  }

  if (item.earningsCount > 0) {
    reasons.push(`${item.earningsCount} earnings records available`);
  }

  if (item.volatility === "low") {
    reasons.push("Lower volatility profile");
  }

  if (item.volatility === "medium") {
    reasons.push("Moderate volatility profile");
  }

  return reasons;
}