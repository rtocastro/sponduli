 const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export async function getStockQuote(symbol) {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  const response = await fetch(
    `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }

  return response.json();
}

export async function getHistoricalCandles(symbol, from, to, resolution = "D") {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  const response = await fetch(
    `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch candles for ${symbol}`);
  }

  const data = await response.json();

  if (data.s !== "ok") {
    throw new Error(`No candle data found for ${symbol}`);
  }

  return data;
}

export async function getMultipleQuotes(symbols = []) {
  return Promise.all(
    symbols.map(async (symbol) => ({
      symbol,
      quote: await getStockQuote(symbol),
    }))
  );
}

export async function getCompanyNews(symbol) {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const response = await fetch(
    `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${formatDate(
      from
    )}&to=${formatDate(to)}&token=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch news for ${symbol}`);
  }

  return response.json();
}

export async function getEarningsSurprises(symbol) {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  const response = await fetch(
    `${FINNHUB_BASE_URL}/stock/earnings?symbol=${symbol}&token=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch earnings for ${symbol}`);
  }

  return response.json();
}