export function calculateSponduliRating(strategyMatch = 0, evidenceScore = 0) {
  return Math.round(strategyMatch * 0.55 + evidenceScore * 0.45);
}

export function getSponduliTier(score = 0) {
  if (score >= 95) return "Elite";
  if (score >= 85) return "Strong";
  if (score >= 70) return "Worth Watching";
  return "Needs More Evidence";
}