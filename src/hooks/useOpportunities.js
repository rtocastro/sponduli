import { useEffect, useState } from "react";
import opportunityUniverse from "../data/opportunityUniverse";
import {
  getCompanyNews,
  getEarningsSurprises,
  getMultipleQuotes,
} from "../services/marketService";
import { calculateEvidenceScore } from "../utils/evidenceEngine";
import {
  calculateOpportunityRank,
  getOpportunityReason,
  getOpportunityTier,
} from "../utils/opportunityEngine";

export function useOpportunities(minimumEthicalScore = 80, limit = 3) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function scanOpportunities() {
      try {
        setLoading(true);
        setError("");

        const eligibleUniverse = opportunityUniverse.filter(
          (item) => item.ethicalScore >= minimumEthicalScore
        );

        const quoteResults = await getMultipleQuotes(
          eligibleUniverse.map((item) => item.ticker)
        );

        const quoteMap = {};
        quoteResults.forEach(({ symbol, quote }) => {
          if (quote && quote.c > 0) {
            quoteMap[symbol] = quote;
          }
        });

        const enriched = await Promise.all(
          eligibleUniverse.map(async (item) => {
            const [news, earnings] = await Promise.all([
              getCompanyNews(item.ticker),
              getEarningsSurprises(item.ticker),
            ]);

            const newsCount = Array.isArray(news) ? news.length : 0;
            const earningsCount = Array.isArray(earnings)
              ? earnings.length
              : 0;

            const evidenceScore = calculateEvidenceScore({
              newsCount,
              earningsCount,
              ethicalScore: item.ethicalScore,
            });

            const opportunityRank = calculateOpportunityRank({
              ethicalScore: item.ethicalScore,
              evidenceScore,
              newsCount,
              earningsCount,
              volatility: item.volatility,
            });

            return {
              ...item,
              currentPrice: quoteMap[item.ticker]?.c || null,
              dayChange: quoteMap[item.ticker]?.d || 0,
              dayChangePercent: quoteMap[item.ticker]?.dp || 0,
              newsCount,
              earningsCount,
              evidenceScore,
              opportunityRank,
              opportunityTier: getOpportunityTier(opportunityRank),
              evidenceReasons: getOpportunityReason({
                ...item,
                newsCount,
                earningsCount,
              }),
              reason:
                "Generated from live quote, news, earnings, and your ethical settings.",
            };
          })
        );

        const top = enriched
          .sort((a, b) => b.opportunityRank - a.opportunityRank)
          .slice(0, limit);

        setOpportunities(top);
      } catch (err) {
        console.error(err);
        setError("Could not scan live opportunities.");
      } finally {
        setLoading(false);
      }
    }

    scanOpportunities();
  }, [minimumEthicalScore, limit]);

  return {
    opportunities,
    loading,
    error,
  };
}