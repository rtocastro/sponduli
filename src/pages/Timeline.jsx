import { useTimeline } from "../context/TimelineContext";

function Timeline() {
  const { timeline } = useTimeline();

  return (
    <section className="page-section">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Timeline</p>
          <h2>Your investment journey</h2>
        </div>
      </div>

      <div className="history-list">
        {timeline.map((entry) => (
          <article
            className="history-row"
            key={entry.id}
          >
            <div>
              <strong>{entry.ticker}</strong>

              <span>
                Added to portfolio
              </span>

              <span>
                {new Date(
                  entry.createdAt
                ).toLocaleString()}
              </span>
            </div>

            <div>
              <strong>
                ${entry.amountInvested}
              </strong>

              <span>
                Ethical: {entry.ethicalScore}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Timeline;