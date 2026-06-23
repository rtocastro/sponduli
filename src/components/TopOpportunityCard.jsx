import { useState } from "react";
import watchlist from "../data/mockWatchlist";
import AddFromWatchlistModal from "./AddFromWatchlistModal";
import EvidenceMeter from "./EvidenceMeter";
import LiveEvidenceMeter from "./LiveEvidenceMeter";
import { useSettings } from "../context/SettingsContext";
import {
    calculateMomentumScore,
    calculateOpportunityScore,
    getEvidenceReasons,
    getOpportunityType,
} from "../utils/momentumEngine";
import {
    calculateSponduliRating,
    getSponduliTier,
} from "../utils/sponduliEngine";

function TopOpportunityCard() {
    const { minimumEthicalScore } = useSettings();
    const [selectedItem, setSelectedItem] = useState(null);

    const topOpportunity = [...watchlist]
        .map((item) => {
            const strategyMatch = calculateOpportunityScore(
                item,
                minimumEthicalScore
            );

            const evidenceScore = calculateMomentumScore(item);

            return {
                ...item,
                strategyMatch,
                evidenceScore,
                evidenceReasons: getEvidenceReasons(item, minimumEthicalScore),
                opportunityType: getOpportunityType(item),
            };
        })
        .sort((a, b) => {
            const aScore = a.strategyMatch * 0.55 + a.evidenceScore * 0.45;
            const bScore = b.strategyMatch * 0.55 + b.evidenceScore * 0.45;

            return bScore - aScore;
        })[0];

    if (!topOpportunity) return null;


    const [liveEvidenceScore, setLiveEvidenceScore] = useState(null);

    const evidenceForRating =
        liveEvidenceScore ?? topOpportunity.evidenceScore;

    const sponduliRating = calculateSponduliRating(
        topOpportunity.strategyMatch,
        evidenceForRating
    );

    const sponduliTier = getSponduliTier(sponduliRating);


    return (
        <article className="top-opportunity-card">
            <div className="top-opportunity-header">
                <div>
                    <p className="eyebrow">Today's Top Opportunity</p>
                    <h3>{topOpportunity.ticker}</h3>
                    <p>{topOpportunity.name}</p>
                </div>

                <div className="score-badge">
                    <strong>{topOpportunity.strategyMatch}</strong>
                    <span>Strategy Match</span>
                </div>
                <div className="sponduli-rating-card">
                    <span>Sponduli Rating</span>
                    <strong>{sponduliRating}/100</strong>
                    <p>{sponduliTier}</p>
                </div>
            </div>

<LiveEvidenceMeter
  item={topOpportunity}
  minimumEthicalScore={minimumEthicalScore}
  onEvidenceLoaded={setLiveEvidenceScore}
/>

            <div className="opportunity-callout">
                <strong>{topOpportunity.opportunityType}</strong>
                <p>{topOpportunity.reason}</p>
            </div>

            <button
                className="primary-button watchlist-add-button"
                onClick={() => setSelectedItem(topOpportunity)}
            >
                Add To Portfolio
            </button>

            <AddFromWatchlistModal
                item={selectedItem}
                isOpen={Boolean(selectedItem)}
                onClose={() => setSelectedItem(null)}
            />
        </article>
    );
}

export default TopOpportunityCard;