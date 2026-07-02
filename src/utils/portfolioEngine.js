export function buildPortfolioFromTransactions(transactions = []) {
  const holdingsMap = {};

  transactions.forEach((transaction) => {
    if (transaction.type !== "BUY") return;

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

    holdingsMap[transaction.ticker].shares += Number(transaction.shares || 0);
    holdingsMap[transaction.ticker].totalInvested += Number(
      transaction.amount || 0
    );
    holdingsMap[transaction.ticker].transactions.push(transaction);
  });

  return Object.values(holdingsMap).map((holding) => ({
    ...holding,
    costBasis:
      holding.shares > 0 ? holding.totalInvested / holding.shares : 0,
    currentPrice:
      holding.shares > 0 ? holding.totalInvested / holding.shares : 0,
  }));
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