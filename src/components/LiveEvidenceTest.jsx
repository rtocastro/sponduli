import { useState } from "react";
import {
  getCompanyNews,
  getEarningsSurprises,
} from "../services/marketService";

function LiveEvidenceTest() {
  const [symbol, setSymbol] = useState("AAPL");
  const [newsCount, setNewsCount] = useState(null);
  const [earningsCount, setEarningsCount] = useState(null);
  const [latestHeadline, setLatestHeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFetchEvidence() {
    try {
      setLoading(true);
      setError("");
      setNewsCount(null);
      setEarningsCount(null);
      setLatestHeadline("");

      const cleanSymbol = symbol.toUpperCase();

      const [news, earnings] = await Promise.all([
        getCompanyNews(cleanSymbol),
        getEarningsSurprises(cleanSymbol),
      ]);

      setNewsCount(news.length);
      setEarningsCount(earnings.length);
      setLatestHeadline(news[0]?.headline || "No recent headline found.");
    } catch (err) {
      console.error(err);
      setError("Could not fetch evidence data for that symbol.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="card live-market-card">
      <p className="eyebrow">Live Evidence Test</p>
      <h3>News + Earnings Check</h3>

      <div className="market-test-row">
        <input
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="AAPL"
        />

        <button className="primary-button" onClick={handleFetchEvidence}>
          {loading ? "Checking..." : "Fetch Evidence"}
        </button>
      </div>

      {error && <p className="negative">{error}</p>}

      {newsCount !== null && (
        <div className="quote-result">
          <div>
            <span>News Items</span>
            <strong>{newsCount}</strong>
          </div>

          <div>
            <span>Earnings Records</span>
            <strong>{earningsCount}</strong>
          </div>

          <div>
            <span>Latest Headline</span>
            <strong>{latestHeadline}</strong>
          </div>
        </div>
      )}
    </article>
  );
}

export default LiveEvidenceTest;