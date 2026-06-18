import { calculateMomentumScore, getOpportunityType } from "./momentumEngine";

export function generatePortfolioInsights(portfolio) {
  const insights = portfolio.map((position) => {
    const gain = position.stats.gainPercent;
    const ethicalScore = position.ethicalScore;
    const recommendation = position.recommendation;

    const bullets = [];

    if (gain >= 25) {
      bullets.push("Position has strong growth from your original cost basis.");
    }

    if (gain >= 100) {
      bullets.push("Profit milestone reached: this position has doubled.");
    }

    if (ethicalScore >= 85) {
      bullets.push("Ethical score is strongly aligned with your values.");
    }

    if (ethicalScore < 75) {
      bullets.push("Ethical score may need review before adding more.");
    }

    bullets.push(recommendation.reason);

    return {
      id: position.id,
      ticker: position.ticker,
      title: `${recommendation.action}: ${position.ticker}`,
      confidence: recommendation.confidence,
      type: "Holding",
      bullets,
    };
  });

  return insights.sort((a, b) => b.confidence - a.confidence);
}

export function generateWatchlistInsights(watchlist) {
  const insights = watchlist.map((item) => {
    const momentumScore = calculateMomentumScore(item);
    const opportunityType = getOpportunityType(item);

    const bullets = [
      `${item.ticker} has a ${momentumScore}/100 momentum score.`,
      `${item.ticker} is currently categorized as: ${opportunityType}.`,
      item.reason,
    ];

    if (item.sixMonthTrend > 10) {
      bullets.push("Six-month trend is showing meaningful upward movement.");
    }

    if (item.volatility === "high") {
      bullets.push("High volatility means this should be treated with more caution.");
    }

    if (item.ethicalScore >= 85) {
      bullets.push("Ethical score is above your preferred minimum standard.");
    }

    return {
      id: item.id,
      ticker: item.ticker,
      title: `${opportunityType}: ${item.ticker}`,
      confidence: momentumScore,
      type: "Watchlist",
      bullets,
    };
  });

  

  return insights.sort((a, b) => b.confidence - a.confidence);
}

export function categorizeInsight(insight) {
  const title = insight.title.toLowerCase();

  if (
    title.includes("exiting") ||
    title.includes("reducing") ||
    title.includes("review")
  ) {
    return "Needs Review";
  }

  if (
    title.includes("profit") ||
    title.includes("split")
  ) {
    return "Profit Opportunities";
  }

  if (
    title.includes("holding")
  ) {
    return "Strong Holds";
  }

  return "Watchlist Opportunities";
}