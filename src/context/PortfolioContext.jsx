
import portfolioData from "../data/mockPortfolio";
import { calculatePosition, getRecommendation } from "../utils/rulesEngine";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
const [rawPortfolio, setRawPortfolio] = useState(() => {
  const savedPortfolio = localStorage.getItem("sponduli-portfolio");

  if (savedPortfolio) {
    return JSON.parse(savedPortfolio);
  }

  return portfolioData;
});

const portfolio = useMemo(() => {
  return rawPortfolio.map((position) => ({
    ...position,
    stats: calculatePosition(position),
    recommendation: getRecommendation(position),
  }));
}, [rawPortfolio]);

useEffect(() => {
  localStorage.setItem("sponduli-portfolio", JSON.stringify(rawPortfolio));
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