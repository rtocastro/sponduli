import { useEffect, useState } from "react";
import {
  getCompanyNews,
  getEarningsSurprises,
} from "../services/marketService";
import {
  calculateEvidenceScore,
  getLiveEvidenceReasons,
} from "../utils/evidenceEngine";

export function useLiveEvidence(symbol, ethicalScore, minimumEthicalScore) {
  const [evidence, setEvidence] = useState({
    score: null,
    reasons: [],
    newsCount: 0,
    earningsCount: 0,
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (!symbol) return;

    async function fetchEvidence() {
      try {
        setEvidence((current) => ({
          ...current,
          loading: true,
          error: "",
        }));

        const [news, earnings] = await Promise.all([
          getCompanyNews(symbol),
          getEarningsSurprises(symbol),
        ]);

        const newsCount = Array.isArray(news) ? news.length : 0;
        const earningsCount = Array.isArray(earnings) ? earnings.length : 0;

        const score = calculateEvidenceScore({
          newsCount,
          earningsCount,
          ethicalScore,
        });

        const reasons = getLiveEvidenceReasons({
          newsCount,
          earningsCount,
          ethicalScore,
          minimumEthicalScore,
        });

        setEvidence({
          score,
          reasons,
          newsCount,
          earningsCount,
          loading: false,
          error: "",
        });
      } catch (error) {
        console.error(error);

        setEvidence({
          score: null,
          reasons: [],
          newsCount: 0,
          earningsCount: 0,
          loading: false,
          error: "Live evidence unavailable",
        });
      }
    }

    fetchEvidence();
  }, [symbol, ethicalScore, minimumEthicalScore]);

  return evidence;
}