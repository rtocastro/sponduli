export function buildPortfolioFromTransactions(transactions = []) {
  const holdingsMap = {};

transactions.forEach((transaction) => {
    if (!holdingsMap[transaction.ticker]) {
        holdingsMap[transaction.ticker] = {
            id: transaction.ticker,
            ticker: transaction.ticker,
            name: transaction.name,
            shares: 0,
            totalInvested: 0,
            ethicalScore: transaction.ethicalScore || 80,
            source: transaction.source,
            transactions: [],
        };
    }

    const holding = holdingsMap[transaction.ticker];

    if (transaction.type === "BUY") {
        holding.shares += Number(transaction.shares || 0);
        holding.totalInvested += Number(transaction.amount || 0);
    }

    if (transaction.type === "SELL") {
        holding.shares -= Number(transaction.shares || 0);

        // Never allow negative shares.
        holding.shares = Math.max(holding.shares, 0);
    }

    holding.transactions.push(transaction);
});

return Object.values(holdingsMap).map((holding) => {
  const averageCost =
    holding.totalInvested > 0 && holding.shares > 0
      ? holding.totalInvested / holding.shares
      : 0;

  return {
    ...holding,
    averageCost,
    costBasis: averageCost,
    currentPrice: averageCost,
    totalTransactions: holding.transactions.length,
    firstPurchase: holding.transactions[holding.transactions.length - 1]?.createdAt,
    lastPurchase: holding.transactions[0]?.createdAt,
  };
});
}

export function calculatePortfolioTotals(portfolio = []) {
  return portfolio.reduce(
    (acc, position) => {
      acc.invested += position.stats?.invested || 0;
      acc.currentValue += position.stats?.currentValue || 0;
      acc.profit += position.stats?.profit || 0;
      return acc;
    },
    {
      invested: 0,
      currentValue: 0,
      profit: 0,
    }
  );
}