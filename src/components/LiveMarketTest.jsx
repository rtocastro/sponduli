import { useState } from "react";
import { getStockQuote } from "../services/marketService";


function LiveMarketTest() {
    const [symbol, setSymbol] = useState("AAPL");
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

async function handleFetchQuote() {
  try {
    setLoading(true);
    setError("");

    const data = await getStockQuote(symbol.toUpperCase());

    if (!data || data.c === 0) {
      setQuote(null);
      setError("No market quote found for that symbol.");
      return;
    }

    setQuote(data);
  } catch (err) {
    setError("Could not fetch quote. Check your API key or symbol.");
    console.error(err);
  } finally {
    setLoading(false);
  }
}

    return (
        <article className="card live-market-card">
            <p className="eyebrow">Live Market Test</p>
            <h3>Finnhub Quote Check</h3>

            <div className="market-test-row">
                <input
                    value={symbol}
                    onChange={(event) => setSymbol(event.target.value)}
                    placeholder="AAPL"
                />

                <button className="primary-button" onClick={handleFetchQuote}>
                    {loading ? "Checking..." : "Fetch"}
                </button>
            </div>

            {error && <p className="negative">{error}</p>}

            {quote && (

<>
{quote.mock && (
  <p className="warning-pill">
    Mock data mode — Finnhub key not active
  </p>
)}

                < div className="quote-result">
            <div>
                <span>Current Price</span>
                <strong>${quote.c}</strong>
            </div>

            <div>
                <span>Change</span>
                <strong className={quote.d >= 0 ? "positive" : "negative"}>
                    {quote.d}
                </strong>
            </div>

            <div>
                <span>Percent Change</span>
                <strong className={quote.dp >= 0 ? "positive" : "negative"}>
                    {quote.dp}%
                </strong>
            </div>

            <div>
                <span>High Today</span>
                <strong>${quote.h}</strong>
            </div>
        </div></>
    )
}
        </article >
    );
}

export default LiveMarketTest;