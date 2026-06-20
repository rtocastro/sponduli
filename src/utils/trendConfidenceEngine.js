export function getUnixSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}

export function getPastDate(monthsBack) {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsBack);
  return date;
}

export function calculatePeriodReturn(prices = []) {
  if (prices.length < 2) return 0;

  const first = prices[0];
  const last = prices[prices.length - 1];

  return ((last - first) / first) * 100;
}

export function calculateVolatility(prices = []) {
  if (prices.length < 2) return 0;

  const dailyReturns = prices.slice(1).map((price, index) => {
    const previousPrice = prices[index];
    return ((price - previousPrice) / previousPrice) * 100;
  });

  const average =
    dailyReturns.reduce((sum, value) => sum + value, 0) / dailyReturns.length;

  const variance =
    dailyReturns.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) /
    dailyReturns.length;

  return Math.sqrt(variance);
}

export function calculateTrendConfidence({
  oneMonthReturn,
  threeMonthReturn,
  sixMonthReturn,
  oneYearReturn,
  volatility,
}) {
  let score = 50;

  score += oneMonthReturn > 0 ? 8 : -8;
  score += threeMonthReturn > 0 ? 12 : -12;
  score += sixMonthReturn > 0 ? 15 : -15;
  score += oneYearReturn > 0 ? 15 : -15;

  if (oneMonthReturn > 5) score += 5;
  if (threeMonthReturn > 10) score += 5;
  if (sixMonthReturn > 15) score += 5;
  if (oneYearReturn > 25) score += 5;

  if (volatility < 2) score += 8;
  if (volatility >= 2 && volatility < 4) score += 3;
  if (volatility >= 4) score -= 8;

  return Math.max(0, Math.min(100, Math.round(score)));
}