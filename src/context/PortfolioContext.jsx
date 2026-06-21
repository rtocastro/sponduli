
import portfolioData from "../data/mockPortfolio";
import { calculatePosition, getRecommendation } from "../utils/rulesEngine";
import { createContext, useContext, useMemo, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
const [rawPortfolio, setRawPortfolio] = useState(portfolioData);

const portfolio = useMemo(() => {
  return rawPortfolio.map((position) => ({
    ...position,
    stats: calculatePosition(position),
    recommendation: getRecommendation(position),
  }));
}, [rawPortfolio]);

function addInvestment(newInvestment) {
  setRawPortfolio((currentPortfolio) => [
    ...currentPortfolio,
    {
      id: crypto.randomUUID(),
      ...newInvestment,
    },
  ]);
}

  const totals = useMemo(() => {
    return portfolio.reduce(
      (acc, position) => {
        acc.invested += position.stats.invested;
        acc.currentValue += position.stats.currentValue;
        acc.profit += position.stats.profit;
        return acc;
      },
      {
        invested: 0,
        currentValue: 0,
        profit: 0,
      }
    );
  }, [portfolio]);

  const totalGainPercent = (totals.profit / totals.invested) * 100;
  const millionGoalPercent = (totals.currentValue / 1000000) * 100;

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
        addInvestment,
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