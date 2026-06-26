import { useEffect, useState } from "react";
import opportunityUniverse from "../data/opportunityUniverse";
import {
    getCompanyNews,
    getEarningsSurprises,
    getCachedMultipleQuotes,
} from "../services/marketService";
import {
    getSeedDiscoveryCandidates,
    getDiscoverySummary,
} from "../utils/discoveryEngine";


import { calculateEvidenceScore } from "../utils/evidenceEngine";
import { getOpportunityReason } from "../utils/opportunityEngine";
import { buildDecision } from "../utils/decisionEngine";
import { runLimited } from "../utils/apiThrottle";
import { getCached, setCached } from "../utils/cache";

// const [summary, setSummary] = useState(null);

export function useOpportunities(minimumEthicalScore = 80, limit = 3) {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function scanOpportunities() {
            try {
                setLoading(true);
                setError("");

                const eligibleUniverse = getSeedDiscoveryCandidates({
                    minimumEthicalScore,
                    maxCandidates: 12,
                });

                setSummary(getDiscoverySummary(eligibleUniverse));

                // Pass 1: fetch quotes for eligible universe
                const quoteResults = await getCachedMultipleQuotes(
                    eligibleUniverse.map((item) => item.ticker)
                );

                const quoteMap = {};

                quoteResults.forEach(({ symbol, quote }) => {
                    if (quote && quote.c > 0) {
                        quoteMap[symbol] = quote;
                    }
                });

                // Pick finalists using live day movement first
                const quoteRanked = eligibleUniverse
                    .map((item) => ({
                        ...item,
                        currentPrice: quoteMap[item.ticker]?.c || null,
                        dayChange: quoteMap[item.ticker]?.d || 0,
                        dayChangePercent: quoteMap[item.ticker]?.dp || 0,
                    }))
                    .filter((item) => item.currentPrice)
                    .sort((a, b) => b.dayChangePercent - a.dayChangePercent)
                    .slice(0, 5);

                // Pass 2: only fetch news/earnings for finalists, slowly + cached
                const enriched = await runLimited(
                    quoteRanked,
                    async (item) => {
                        const newsCacheKey = `sponduli-news-${item.ticker}`;
                        const earningsCacheKey = `sponduli-earnings-${item.ticker}`;

                        let news = getCached(newsCacheKey, 15 * 60 * 1000);
                        let earnings = getCached(earningsCacheKey, 24 * 60 * 60 * 1000);

                        if (!news) {
                            news = await getCompanyNews(item.ticker);
                            setCached(newsCacheKey, news);
                        }

                        if (!earnings) {
                            earnings = await getEarningsSurprises(item.ticker);
                            setCached(earningsCacheKey, earnings);
                        }

                        const newsCount = Array.isArray(news) ? news.length : 0;
                        const earningsCount = Array.isArray(earnings) ? earnings.length : 0;

                        const evidenceScore = calculateEvidenceScore({
                            newsCount,
                            earningsCount,
                            ethicalScore: item.ethicalScore,
                        });

                        const newsScore = Math.min(newsCount * 5, 100);
                        const earningsScore = Math.min(earningsCount * 25, 100);

                        const riskScore =
                            item.volatility === "low"
                                ? 92
                                : item.volatility === "medium"
                                    ? 78
                                    : 58;

                        const portfolioFit = item.category === "Dividend" ? 88 : 80;
                        const diversification =
                            item.category === "Broad Market" ? 90 : 78;

                        const decision = buildDecision({
                            ethics: item.ethicalScore,
                            evidence: evidenceScore,
                            news: newsScore,
                            earnings: earningsScore,
                            portfolioFit,
                            risk: riskScore,
                            diversification,
                            settings: {
                                longTermSplit: 50,
                                momentumSplit: 50,
                            },
                        });

                        return {
                            ...item,
                            newsCount,
                            earningsCount,
                            evidenceScore,
                            decision,
                            evidenceReasons: getOpportunityReason({
                                ...item,
                                newsCount,
                                earningsCount,
                            }),
                            reason:
                                "Generated from live quote, cached news, cached earnings, and your ethical settings.",
                        };
                    },
                    200
                );

                const top = enriched
                    .sort((a, b) => b.decision.score - a.decision.score)
                    .slice(0, limit);

                if (isMounted) {
                    setOpportunities(top);
                }
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError("Could not scan live opportunities.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        scanOpportunities();

        return () => {
            isMounted = false;
        };
    }, [minimumEthicalScore, limit]);

    return {
        opportunities,
        loading,
        error,
        summary,
    };
}