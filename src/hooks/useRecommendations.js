import { usePortfolio } from "../context/PortfolioContext";
import { useSettings } from "../context/SettingsContext";
import watchlist from "../data/mockWatchlisst";
import { buildRecommendationSummary } from "../services/recommendationService";

export function useRecommendations() {
  const portfolioData = usePortfolio();
  const settings = useSettings();

  const summary = buildRecommendationSummary({
    portfolio: portfolioData.portfolio,
    settings,
    watchlist,
  });

  return {
    summary,
  };
}