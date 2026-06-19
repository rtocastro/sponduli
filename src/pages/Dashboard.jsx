import portfolio from "../data/mockPortfolio";
import { calculatePosition, getRecommendation } from "../utils/rulesEngine";
import { usePortfolio } from "../context/PortfolioContext";
import { useSettings } from "../context/SettingsContext";

function Dashboard() {

  const {
    portfolio,
    totals,
    totalGainPercent,
    millionGoalPercent,
    topRecommendation,
  } = usePortfolio();

  const {
    riskTolerance,
    minimumEthicalScore,
    longTermSplit,
    momentumSplit,
    communityAllocation,
  } = useSettings();


  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Momentum dashboard</p>
          <h2>Your financial command center</h2>
        </div>
        <button className="primary-button">Add Investment</button>
      </div>

      <div className="card-grid">
        <article className="card hero-card">
          <p>Total Portfolio</p>
          <h3>${totals.currentValue.toLocaleString()}</h3>
          <span className={totalGainPercent >= 0 ? "positive" : "negative"}>
            {totalGainPercent.toFixed(2)}%
          </span>
        </article>

        <article className="card">
          <p>Total Profit</p>
          <h3>${totals.profit.toLocaleString()}</h3>
          <span>Since starting positions</span>
        </article>

        <article className="card">
          <p>Momentum Score</p>
          <h3>87</h3>
          <span>Based on mock trend strength</span>
        </article>

        <article className="card">
          <p>Million Dollar Goal</p>
          <h3>{millionGoalPercent.toFixed(3)}%</h3>
          <div className="progress-bar">
            <div style={{ width: `${millionGoalPercent}%` }} />
          </div>
        </article>

        <article className="card strategy-card">
          <p>Current Strategy</p>
          <h3>{riskTolerance}</h3>
          <span>Ethical minimum: {minimumEthicalScore}/100</span>
          <span>
            Split: {longTermSplit}% long-term / {momentumSplit}% momentum
          </span>
          <span>Community: {communityAllocation}%</span>
        </article>
      </div>

      <article className="card recommendation-card">
        <p>Next Best Action</p>
        <h3>
          {topRecommendation.recommendation.action}:{" "}
          {topRecommendation.ticker}
        </h3>
        <span>{topRecommendation.recommendation.reason}</span>
      </article>

      <div className="holdings-list">
        {portfolio.map((position) => {
          const stats = calculatePosition(position);
          const recommendation = getRecommendation(position);

          return (
            <article className="holding-card" key={position.id}>
              <div>
                <h3>{position.ticker}</h3>
                <p>{position.name}</p>
              </div>

              <div>
                <strong>${stats.currentValue.toLocaleString()}</strong>
                <span className={stats.gainPercent >= 0 ? "positive" : "negative"}>
                  {stats.gainPercent.toFixed(2)}%
                </span>
              </div>

              <div>
                <strong>{recommendation.action}</strong>
                <span>{recommendation.confidence}% confidence</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Dashboard;