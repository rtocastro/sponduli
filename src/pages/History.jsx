import history from "../data/mockHistory";

function History() {
  const firstEntry = history[0];
  const latestEntry = history[history.length - 1];

  const totalGrowth = latestEntry.portfolioValue - firstEntry.portfolioValue;
  const totalGrowthPercent =
    (totalGrowth / firstEntry.portfolioValue) * 100;

  const previousEntry = history[history.length - 2];
  const monthlyGrowth =
    latestEntry.portfolioValue - previousEntry.portfolioValue;

  return (
    <section className="page-section">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">History</p>
          <h2>Your growth trail</h2>
        </div>
      </div>

      <div className="card-grid history-summary-grid">
        <article className="card hero-card">
          <p>Latest Value</p>
          <h3>${latestEntry.portfolioValue.toLocaleString()}</h3>
          <span>As of {latestEntry.date}</span>
        </article>

        <article className="card">
          <p>Total Growth</p>
          <h3>${totalGrowth.toLocaleString()}</h3>
          <span className="positive">
            {totalGrowthPercent.toFixed(2)}%
          </span>
        </article>

        <article className="card">
          <p>This Month</p>
          <h3>${monthlyGrowth.toLocaleString()}</h3>
          <span className={monthlyGrowth >= 0 ? "positive" : "negative"}>
            Since last check-in
          </span>
        </article>

        <article className="card">
          <p>Growth Streak</p>
          <h3>{history.length} months</h3>
          <span>Mock tracking period</span>
        </article>
      </div>

      <div className="history-list">
        {history
          .slice()
          .reverse()
          .map((entry, index, reversedHistory) => {
            const previous = reversedHistory[index + 1];
            const change = previous
              ? entry.portfolioValue - previous.portfolioValue
              : 0;

            return (
              <article className="history-row" key={entry.id}>
                <div>
                  <strong>{entry.date}</strong>
                  <span>Portfolio check-in</span>
                </div>

                <div>
                  <strong>${entry.portfolioValue.toLocaleString()}</strong>
                  {previous && (
                    <span className={change >= 0 ? "positive" : "negative"}>
                      {change >= 0 ? "+" : ""}
                      ${change.toLocaleString()}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}

export default History;