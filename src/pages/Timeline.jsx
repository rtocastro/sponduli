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

{timeline.length === 0 ? (
  <article className="card empty-state-card">
    <p className="eyebrow">No timeline yet</p>
    <h3>No investment actions recorded yet.</h3>
    <p>
      When you add something to your portfolio, Sponduli will record that action
      here so you can review your decisions over time.
    </p>
  </article>
) : (
  <div className="history-list">
    {timeline.map((entry) => (
      <article className="history-row" key={entry.id}>
        <div>
          <strong>{entry.ticker}</strong>
          <span>Added to portfolio</span>
          <span>{new Date(entry.createdAt).toLocaleString()}</span>
        </div>

        <div>
          <strong>${entry.amountInvested}</strong>
          <span>Ethical: {entry.ethicalScore}</span>
        </div>
      </article>
    ))}
  </div>
)}
    </section>
  );
}

export default Timeline;