import { useHistory } from "../context/HistoryContext";

function History() {
  const { history } = useHistory();

  if (history.length === 0) {
    return (
      <section className="page-section">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">History</p>
            <h2>Your growth trail</h2>
          </div>
        </div>

        <article className="card empty-state-card">
          <p className="eyebrow">No history yet</p>
          <h3>Sponduli has not tracked any portfolio snapshots yet.</h3>
          <p>
            Once you add real holdings and open the Dashboard, your portfolio
            growth history will appear here.
          </p>
        </article>
      </section>
    );
  }

  const firstEntry = history[0];
  const latestEntry = history[history.length - 1];

  const totalGrowth = latestEntry.portfolioValue - firstEntry.portfolioValue;
  const totalGrowthPercent =
    firstEntry.portfolioValue > 0
      ? (totalGrowth / firstEntry.portfolioValue) * 100
      : 0;

  const previousEntry = history[history.length - 2];
  const latestChange = previousEntry
    ? latestEntry.portfolioValue - previousEntry.portfolioValue
    : 0;

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
          <span className={totalGrowth >= 0 ? "positive" : "negative"}>
            {totalGrowthPercent.toFixed(2)}%
          </span>
        </article>

        <article className="card">
          <p>Latest Change</p>
          <h3>${latestChange.toLocaleString()}</h3>
          <span className={latestChange >= 0 ? "positive" : "negative"}>
            Since last snapshot
          </span>
        </article>

        <article className="card">
          <p>Snapshots</p>
          <h3>{history.length}</h3>
          <span>Real tracking entries</span>
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
                  <span>{entry.holdingsCount} holding snapshot</span>
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