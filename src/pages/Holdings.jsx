import { usePortfolio } from "../context/PortfolioContext";

function Holdings() {
  const { portfolio } = usePortfolio();

  return (
    <section className="page-section">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Holdings</p>
          <h2>Your current investments</h2>
        </div>
      </div>

      <div className="holdings-list">
        {portfolio.map((position) => (
          <article className="holding-detail-card" key={position.id}>
            <div>
              <h3>{position.ticker}</h3>
              <p>{position.name}</p>
            </div>

            <div className="holding-stats-grid">
              <div>
                <span>Invested</span>
                <strong>${position.stats.invested.toLocaleString()}</strong>
              </div>

              <div>
                <span>Current Value</span>
                <strong>${position.stats.currentValue.toLocaleString()}</strong>
              </div>

              <div>
                <span>Profit</span>
                <strong>${position.stats.profit.toLocaleString()}</strong>
              </div>

              <div>
                <span>Gain</span>
                <strong
                  className={
                    position.stats.gainPercent >= 0 ? "positive" : "negative"
                  }
                >
                  {position.stats.gainPercent.toFixed(2)}%
                </strong>
              </div>

              <div>
                <span>Ethical Score</span>
                <strong>{position.ethicalScore}/100</strong>
              </div>

              <div>
                <span>Recommendation</span>
                <strong>{position.recommendation.action}</strong>
              </div>
            </div>

            <p className="holding-reason">{position.recommendation.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Holdings;