import EvidenceMeter from "./EvidenceMeter";
import { useEffect } from "react";
import { useLiveEvidence } from "../hooks/useLiveEvidence";

function LiveEvidenceMeter({ item, minimumEthicalScore, onEvidenceLoaded }) {
  const evidence = useLiveEvidence(
    item.ticker,
    item.ethicalScore,
    minimumEthicalScore
  );

  useEffect(() => {
    if (evidence.score !== null && onEvidenceLoaded) {
      onEvidenceLoaded(evidence.score);
    }
  }, [evidence.score, onEvidenceLoaded]);

  if (evidence.loading) {
    return <p className="live-status">Checking live evidence...</p>;
  }

  if (evidence.error) {
    return <EvidenceMeter score={0} reasons={["Live evidence unavailable"]} />;
  }

  if (evidence.score === null) {
    return null;
  }

  return (
    <EvidenceMeter
      score={evidence.score}
      reasons={evidence.reasons}
      label="Live Evidence Meter"
    />
  );
}

export default LiveEvidenceMeter;