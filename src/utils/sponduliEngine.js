export function calculateSponduliRating(
  strategyMatch,
  evidenceScore
) {
  return Math.round(
    strategyMatch * 0.55 +
    evidenceScore * 0.45
  );
}

export function getSponduliTier(score) {
  if (score >= 95) return "Elite";
  if (score >= 85) return "Strong";
  if (score >= 70) return "Worth Watching";

  return "Needs More Evidence";
}