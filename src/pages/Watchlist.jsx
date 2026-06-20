import watchlist from "../data/mockWatchlist";
import { useSettings } from "../context/SettingsContext";
import {
    calculateMomentumScore,
    calculateOpportunityScore,
    getOpportunityType,
} from "../utils/momentumEngine";

function Watchlist() {

    const { minimumEthicalScore } = useSettings();

    const sortedWatchlist = [...watchlist].sort(
        (a, b) =>
            calculateOpportunityScore(b, minimumEthicalScore) -
            calculateOpportunityScore(a, minimumEthicalScore)
    );

    // const { minimumEthicalScore } = useSettings();

    return (
        <section className="page-section">
            <div className="dashboard-header">
                <div>
                    <p className="eyebrow">Watchlist</p>
                    <h2>Potential opportunities</h2>
                </div>
            </div>

            <div className="watchlist-grid">
                {sortedWatchlist.map((item) => {
                    const momentumScore = calculateMomentumScore(item);
                    const opportunityType = getOpportunityType(item);
                    const isBelowEthicalMinimum = item.ethicalScore < minimumEthicalScore;
                    const opportunityScore = calculateOpportunityScore(
                        item,
                        minimumEthicalScore
                    );

                    return (
                        <article className="watchlist-card" key={item.id}>
                            <div className="watchlist-topline">
                                <div>
                                    <p className="category-pill">{item.category}</p>
                                    <h3>{item.ticker}</h3>
                                    <p>{item.name}</p>
                                </div>

                                <div className="score-badge">
                                    <strong>{momentumScore}</strong>
                                    <span>Momentum</span>
                                </div>
                            </div>

                            <div className="watchlist-stats">
                                <div>
                                    <span>1 Month</span>
                                    <strong>{item.oneMonthTrend}%</strong>
                                </div>

                                <div>
                                    <span>3 Month</span>
                                    <strong>{item.threeMonthTrend}%</strong>
                                </div>

                                <div>
                                    <span>6 Month</span>
                                    <strong>{item.sixMonthTrend}%</strong>
                                </div>

                                <div>
                                    <span>Ethical</span>
                                    <strong className={isBelowEthicalMinimum ? "negative" : "positive"}>
                                        {item.ethicalScore}/100
                                    </strong>
                                </div>
                            </div>

                            <div>
                                <span>Strategy Match</span>
                                <strong className={opportunityScore >= 75 ? "positive" : "negative"}>
                                    {opportunityScore}/100
                                </strong>
                            </div>

                            <div>
                                <span>Trend Confidence</span>
                                <strong className="coming-soon-score">
                                    Soon™
                                </strong>
                            </div>

                            <div className="opportunity-callout">
                                {isBelowEthicalMinimum && (
                                    <p className="warning-pill">Below your ethical minimum</p>
                                )}
                                <strong>{opportunityType}</strong>

                                <p className="strategy-match-line">
                                    Strategy Match: {opportunityScore}/100
                                </p>
                                <p>{item.reason}</p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default Watchlist;