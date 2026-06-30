import { createContext, useContext, useEffect, useState } from "react";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("sponduli-transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "sponduli-transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  function addBuyTransaction(transaction) {
    setTransactions((currentTransactions) => [
      {
        id: crypto.randomUUID(),
        type: "BUY",
        createdAt: new Date().toISOString(),
        ...transaction,
      },
      ...currentTransactions,
    ]);
  }

  function removeTransaction(id) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    );
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addBuyTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("useTransactions must be used inside TransactionProvider");
  }

  return context;
}