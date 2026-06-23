import { usePortfolio } from "../context/PortfolioContext";
import watchlist from "../data/mockWatchlisst";
import {
  generatePortfolioInsights,
  generateWatchlistInsights,
  categorizeInsight,
} from "../utils/insightEngine";

function Insights() {
    const { portfolio, topRecommendation } = usePortfolio();

    const portfolioInsights = generatePortfolioInsights(portfolio);
    const watchlistInsights = generateWatchlistInsights(watchlist);

    const allInsights = [...portfolioInsights, ...watchlistInsights].sort(
        (a, b) => b.confidence - a.confidence
    );

    const groupedInsights = {
        "Needs Review": [],
        "Profit Opportunities": [],
        "Strong Holds": [],
        "Watchlist Opportunities": [],
    };

    allInsights.forEach((insight) => {
        const category = categorizeInsight(insight);
        groupedInsights[category].push(insight);
    });

    return (
        <section className="page-section">
            <div className="dashboard-header">
                <div>
                    <p className="eyebrow">Insights</p>
                    <h2>Why Sponduli is suggesting these moves</h2>
                </div>
            </div>

            <article className="insight-hero">
                <p className="eyebrow">Primary Insight</p>
                <h3>
                    {topRecommendation.recommendation.action}:{" "}
                    {topRecommendation.ticker}
                </h3>
                <p>{topRecommendation.recommendation.reason}</p>
            </article>

            <div className="insight-list">
                {Object.entries(groupedInsights).map(
                    ([groupName, items]) =>
                        items.length > 0 && (
                            <section key={groupName}>
                                <h3 className="insight-group-title">
                                    {groupName}
                                </h3>

                                <div className="insight-list">
                                    {items.map((insight) => (
                                        <article
                                            className="insight-card"
                                            key={`${insight.type}-${insight.id}`}
                                        >
                                            <div className="insight-card-header">
                                                <div>
                                                    <p className="category-pill">
                                                        {insight.type}
                                                    </p>
                                                    <h3>{insight.title}</h3>
                                                </div>

                                                <div className="score-badge small-score">
                                                    <strong>
                                                        {insight.confidence}
                                                    </strong>
                                                    <span>Confidence</span>
                                                </div>
                                            </div>

                                            <ul>
                                                {insight.bullets.map((bullet) => (
                                                    <li key={bullet}>{bullet}</li>
                                                ))}
                                            </ul>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )
                )}
            </div>
        </section>
    );
}

export default Insights;