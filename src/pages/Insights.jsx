import { usePortfolio } from "../context/PortfolioContext";
import {
  generatePortfolioInsights,
  categorizeInsight,
} from "../utils/insightEngine";

function Insights() {
  const { portfolio, topRecommendation } = usePortfolio();

  const portfolioInsights = generatePortfolioInsights(portfolio);

  const groupedInsights = {
    "Needs Review": [],
    "Profit Opportunities": [],
    "Strong Holds": [],
    "Watchlist Opportunities": [],
  };

  portfolioInsights.forEach((insight) => {
    const category = categorizeInsight(insight);
    groupedInsights[category].push(insight);
  });

  if (portfolio.length === 0) {
    return (
      <section className="page-section">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Insights</p>
            <h2>Why Sponduli is suggesting these moves</h2>
          </div>
        </div>

        <article className="card empty-state-card">
          <p className="eyebrow">No holdings yet</p>
          <h3>No portfolio insights available yet.</h3>
          <p>
            Once you add a real holding, Sponduli will explain whether it looks
            like a strong hold, needs review, or may be ready for profit taking.
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Why Sponduli is suggesting these moves</h2>
        </div>
      </div>

      {topRecommendation && (
        <article className="insight-hero">
          <p className="eyebrow">Primary Holding Insight</p>
          <h3>
            {topRecommendation.recommendation.action}:{" "}
            {topRecommendation.ticker}
          </h3>
          <p>{topRecommendation.recommendation.reason}</p>
        </article>
      )}

      <div className="insight-list">
        {Object.entries(groupedInsights).map(
          ([groupName, items]) =>
            items.length > 0 && (
              <section key={groupName}>
                <h3 className="insight-group-title">{groupName}</h3>

                <div className="insight-list">
                  {items.map((insight) => (
                    <article
                      className="insight-card"
                      key={`${insight.type}-${insight.id}`}
                    >
                      <div className="insight-card-header">
                        <div>
                          <p className="category-pill">{insight.type}</p>
                          <h3>{insight.title}</h3>
                        </div>

                        <div className="score-badge small-score">
                          <strong>{insight.confidence}</strong>
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