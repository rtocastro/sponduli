import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCachedMultipleQuotes } from "../services/marketService";
import { calculatePosition, getRecommendation } from "../utils/rulesEngine";
import { useTransactions } from "./TransactionContext";
import {
  buildPortfolioFromTransactions,
  calculatePortfolioTotals,
} from "../utils/portfolioEngine";

const PortfolioContext = createContext();



export function PortfolioProvider({ children }) {
  const { transactions } = useTransactions();

  const [livePrices, setLivePrices] = useState({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  const rawPortfolio = useMemo(
    () => buildPortfolioFromTransactions(transactions),
    [transactions]
  );

  useEffect(() => {
    async function fetchLivePrices() {
      try {
        setIsLoadingPrices(true);

        const symbols = rawPortfolio.map((item) => item.ticker);
        const results = await getCachedMultipleQuotes(symbols);

        const priceMap = {};

        results.forEach(({ symbol, quote }) => {
          if (quote && quote.c > 0) {
            priceMap[symbol] = quote.c;
          }
        });

        setLivePrices(priceMap);
      } catch (error) {
        console.error("Failed to fetch live prices", error);
      } finally {
        setIsLoadingPrices(false);
      }
    }

    if (rawPortfolio.length > 0) {
      fetchLivePrices();
    } else {
      setLivePrices({});
    }
  }, [rawPortfolio]);

  const portfolio = useMemo(() => {
    return rawPortfolio.map((position) => {
      const livePrice = livePrices[position.ticker];

      const enrichedPosition = {
        ...position,
        currentPrice: livePrice || position.currentPrice,
      };

      return {
        ...enrichedPosition,
        stats: calculatePosition(enrichedPosition),
        recommendation: getRecommendation(enrichedPosition),
      };
    });
  }, [rawPortfolio, livePrices]);

const totals = useMemo(() => {
  return calculatePortfolioTotals(portfolio);
}, [portfolio]);

  const totalGainPercent =
    totals.invested > 0 ? (totals.profit / totals.invested) * 100 : 0;

  const millionGoalPercent =
    totals.currentValue > 0 ? (totals.currentValue / 1000000) * 100 : 0;

  const topRecommendation = [...portfolio].sort(
    (a, b) => b.recommendation.confidence - a.recommendation.confidence
  )[0];

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        totals,
        totalGainPercent,
        millionGoalPercent,
        topRecommendation,
        isLoadingPrices,
        livePrices,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }

  return context;
}