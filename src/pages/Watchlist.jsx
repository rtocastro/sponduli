import { useState } from "react";
import AddFromWatchlistModal from "../components/AddFromWatchlistModal";
import EvidenceMeter from "../components/EvidenceMeter";
import { useSettings } from "../context/SettingsContext";
import { useOpportunities } from "../hooks/useOpportunities";

function Watchlist() {
    const { minimumEthicalScore } = useSettings();
    const [selectedItem, setSelectedItem] = useState(null);

    const {
        opportunities,
        loading,
        error,
    } = useOpportunities(minimumEthicalScore, 3);

    return (
        <section className="page-section">
            <div className="dashboard-header">
                <div>
                    <p className="eyebrow">Opportunities</p>
                    <h2>Today&apos;s aligned opportunities</h2>
                </div>
            </div>

            {loading && (
                <p className="live-status">
                    Scanning live quotes, news, and earnings...
                </p>
            )}

            {error && <p className="negative">{error}</p>}

            {!loading && opportunities.length === 0 && (
                <article className="card empty-state-card">
                    <p className="eyebrow">No opportunities found</p>
                    <h3>No candidates met your current ethical threshold.</h3>
                    <p>
                        Try lowering your minimum ethical score slightly or expanding the
                        opportunity universe later.
                    </p>
                </article>
            )}

            <div className="watchlist-grid">
                {opportunities.map((item) => (
                    <article className="watchlist-card" key={item.id}>
                        <div className="watchlist-topline">
                            <div>
                                <p className="category-pill">{item.category}</p>
                                <h3>{item.ticker}</h3>
                                <p>{item.name}</p>
                            </div>

                            <div className="score-badge">
                                <strong>{item.decision.score}</strong>
                                <span>Sponduli Score</span>
                            </div>
                        </div>

                        <div className="watchlist-stats">
                            <div>
                                <span>Live Price</span>
                                <strong>
                                    {item.currentPrice ? `$${item.currentPrice.toFixed(2)}` : "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>Day Change</span>
                                <strong
                                    className={item.dayChangePercent >= 0 ? "positive" : "negative"}
                                >
                                    {item.dayChangePercent?.toFixed(2)}%
                                </strong>
                            </div>

                            <div>
                                <span>Ethical</span>
                                <strong
                                    className={
                                        item.ethicalScore >= minimumEthicalScore
                                            ? "positive"
                                            : "negative"
                                    }
                                >
                                    {item.ethicalScore}/100
                                </strong>
                            </div>

                            <div>
                                <span>News</span>
                                <strong>{item.newsCount}</strong>
                            </div>

                            <div>
                                <span>Earnings</span>
                                <strong>{item.earningsCount}</strong>
                            </div>
                        </div>

                        <EvidenceMeter
                            score={item.evidenceScore}
                            reasons={item.evidenceReasons}
                            label="Live Evidence Meter"
                        />

                        <div className="sponduli-breakdown">
                            {Object.entries(item.decision.breakdown).map(([label, value]) => (
                                <div key={label}>
                                    <span>{label}</span>
                                    <strong>{value}/100</strong>
                                </div>
                            ))}
                        </div>

                        <div className="opportunity-callout">
                            <strong>{item.decision.tier}</strong>
                            <p>{item.reason}</p>
                        </div>

                        <ul className="decision-explanation-list">
  {item.decision.explanation.map((reason) => (
    <li key={reason}>✓ {reason}</li>
  ))}
</ul>

                        <button
                            className="primary-button watchlist-add-button"
                            onClick={() => setSelectedItem(item)}
                        >
                            Add to Portfolio
                        </button>
                    </article>
                ))}
            </div>

            <AddFromWatchlistModal
                item={selectedItem}
                isOpen={Boolean(selectedItem)}
                onClose={() => setSelectedItem(null)}
            />
        </section>
    );
}

export default Watchlist;