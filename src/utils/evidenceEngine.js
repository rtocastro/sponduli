export function calculateEvidenceScore({
  newsCount = 0,
  earningsCount = 0,
  ethicalScore = 80,
}) {
  let score = 40;

  score += Math.min(newsCount, 25);
  score += Math.min(earningsCount * 5, 20);
  score += ethicalScore * 0.15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getLiveEvidenceReasons({
  newsCount = 0,
  earningsCount = 0,
  ethicalScore = 80,
  minimumEthicalScore = 80,
}) {
  const reasons = [];

  if (newsCount > 0) {
    reasons.push(`${newsCount} recent news item${newsCount === 1 ? "" : "s"} found`);
  }

  if (earningsCount > 0) {
    reasons.push(`${earningsCount} earnings record${earningsCount === 1 ? "" : "s"} available`);
  }

  if (ethicalScore >= minimumEthicalScore) {
    reasons.push("Meets your ethical threshold");
  } else {
    reasons.push("Below your ethical threshold");
  }

  return reasons;
}