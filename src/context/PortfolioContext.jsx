
import portfolioData from "../data/mockPortfolio";
import { getMultipleQuotes } from "../services/marketService";
import { calculatePosition, getRecommendation } from "../utils/rulesEngine";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
    const [livePrices, setLivePrices] = useState({});
    const [isLoadingPrices, setIsLoadingPrices] = useState(false);

    const [rawPortfolio, setRawPortfolio] = useState(() => {
        const savedPortfolio = localStorage.getItem("sponduli-portfolio");

        if (savedPortfolio) {
            return JSON.parse(savedPortfolio);
        }

        return portfolioData;
    });

    useEffect(() => {
        async function fetchLivePrices() {
            try {
                setIsLoadingPrices(true);

                const symbols = rawPortfolio.map((item) => item.ticker);
                const results = await getMultipleQuotes(symbols);

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