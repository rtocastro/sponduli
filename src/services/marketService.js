const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export async function getStockQuote(symbol) {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  if (!apiKey) {
    console.warn("Missing VITE_FINNHUB_API_KEY");
    return null;
  }

  const response = await fetch(
    `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }

  return response.json();
}

export async function getMultipleQuotes(symbols = []) {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const quote = await getStockQuote(symbol);

      return {
        symbol,
        quote,
      };
    })
  );

  return results;
}