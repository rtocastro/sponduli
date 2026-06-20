import { useState } from "react";
import { getHistoricalCandles } from "../services/marketService";
import {
  getUnixSeconds,
  getPastDate,
  calculatePeriodReturn,
  calculateVolatility,
  calculateTrendConfidence,
} from "../utils/trendConfidenceEngine";

function LiveTrendTest() {
  const [symbol, setSymbol] = useState("AAPL");
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFetchTrend() {
    try {
      setLoading(true);
      setError("");
      setTrend(null);

      const now = new Date();
      const oneYearAgo = getPastDate(12);

      const data = await getHistoricalCandles(
        symbol.toUpperCase(),
        getUnixSeconds(oneYearAgo),
        getUnixSeconds(now),
        "D"
      );

      const prices = data.c;

      const oneMonthReturn = calculatePeriodReturn(prices.slice(-22));
      const threeMonthReturn = calculatePeriodReturn(prices.slice(-66));
      const sixMonthReturn = calculatePeriodReturn(prices.slice(-132));
      const oneYearReturn = calculatePeriodReturn(prices);
      const volatility = calculateVolatility(prices.slice(-66));

      const confidence = calculateTrendConfidence({
        oneMonthReturn,
        threeMonthReturn,
        sixMonthReturn,
        oneYearReturn,
        volatility,
      });

      setTrend({
        symbol: symbol.toUpperCase(),
        oneMonthReturn,
        threeMonthReturn,
        sixMonthReturn,
        oneYearReturn,
        volatility,
        confidence,
      });
    } catch (err) {
      setError("Could not fetch historical trend data for that symbol.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="card live-market-card">
      <p className="eyebrow">Live Trend Test</p>
      <h3>Trend Confidence Check</h3>

      <div className="market-test-row">
        <input
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="AAPL"
        />

        <button className="primary-button" onClick={handleFetchTrend}>
          {loading ? "Checking..." : "Fetch Trend"}
        </button>
      </div>

      {error && <p className="negative">{error}</p>}

      {trend && (
        <div className="quote-result">
          <div>
            <span>1 Month</span>
            <strong>{trend.oneMonthReturn.toFixed(2)}%</strong>
          </div>

          <div>
            <span>3 Month</span>
            <strong>{trend.threeMonthReturn.toFixed(2)}%</strong>
          </div>

          <div>
            <span>6 Month</span>
            <strong>{trend.sixMonthReturn.toFixed(2)}%</strong>
          </div>

          <div>
            <span>1 Year</span>
            <strong>{trend.oneYearReturn.toFixed(2)}%</strong>
          </div>

          <div>
            <span>Volatility</span>
            <strong>{trend.volatility.toFixed(2)}</strong>
          </div>

          <div>
            <span>Trend Confidence</span>
            <strong className={trend.confidence >= 70 ? "positive" : "negative"}>
              {trend.confidence}/100
            </strong>
          </div>
        </div>
      )}
    </article>
  );
}

export default LiveTrendTest;