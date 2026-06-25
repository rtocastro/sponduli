export function calculateSponduliScore({
  ethics = 80,
  evidence = 0,
  news = 0,
  earnings = 0,
  portfolioFit = 80,
  risk = 80,
  diversification = 80,
  settings = {},
}) {
  const longTermWeight = (settings.longTermSplit || 50) / 100;
  const momentumWeight = (settings.momentumSplit || 50) / 100;

  const baseScore =
    ethics * 0.22 +
    evidence * 0.24 +
    news * 0.1 +
    earnings * 0.1 +
    portfolioFit * 0.14 +
    risk * 0.1 +
    diversification * 0.1;

  const strategyAdjustment =
    longTermWeight > momentumWeight ? risk * 0.03 : evidence * 0.03;

  return Math.max(0, Math.min(100, Math.round(baseScore + strategyAdjustment)));
}

export function getSponduliTier(score = 0) {
  if (score >= 95) return "Elite";
  if (score >= 85) return "Strong";
  if (score >= 70) return "Worth Reviewing";
  return "Needs More Evidence";
}

export function getSponduliBreakdown({
  ethics = 80,
  evidence = 0,
  news = 0,
  earnings = 0,
  portfolioFit = 80,
  risk = 80,
  diversification = 80,
}) {
  return [
    { label: "Ethics", value: ethics },
    { label: "Evidence", value: evidence },
    { label: "News", value: news },
    { label: "Earnings", value: earnings },
    { label: "Portfolio Fit", value: portfolioFit },
    { label: "Risk", value: risk },
    { label: "Diversification", value: diversification },
  ];
}