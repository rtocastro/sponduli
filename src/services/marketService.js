export async function getStockQuote(symbol) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    c: 523.14,
    d: 7.42,
    dp: 1.44,
    h: 528.31,
    symbol,
  };
}

export async function getMultipleQuotes(symbols = []) {
  return Promise.all(
    symbols.map(async (symbol) => ({
      symbol,
      quote: await getStockQuote(symbol),
    }))
  );
}