export function buildRecommendationSummary({
  portfolio,
  settings,
  watchlist,
}) {
  return {
    portfolioCount: portfolio.length,
    riskTolerance: settings.riskTolerance,
    minimumEthicalScore: settings.minimumEthicalScore,
    longTermSplit: settings.longTermSplit,
    momentumSplit: settings.momentumSplit,
    communityAllocation: settings.communityAllocation,
    watchlistCount: watchlist.length,
  };
}