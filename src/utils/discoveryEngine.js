import opportunityUniverse from "../data/opportunityUniverse";

export function getSeedDiscoveryCandidates({
  minimumEthicalScore = 80,
  maxCandidates = 12,
}) {
  return opportunityUniverse
    .filter((item) => item.ethicalScore >= minimumEthicalScore)
    .slice(0, maxCandidates);
}

export function getDiscoverySummary(candidates = []) {
  return {
    scannedCount: candidates.length,
    source: "Curated ethical seed universe",
    mode: "Discovery v1",
  };
}