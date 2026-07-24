import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("sponduli-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("sponduli-history", JSON.stringify(history));
  }, [history]);

  const recordSnapshot = useCallback((snapshot) => {
    const today = new Date().toISOString().split("T")[0];

    setHistory((currentHistory) => {
      const existingEntry = currentHistory.find(
        (entry) => entry.date === today
      );

      const normalizedSnapshot = {
        portfolioValue: Number(snapshot.portfolioValue.toFixed(2)),
        invested: Number(snapshot.invested.toFixed(2)),
        profit: Number(snapshot.profit.toFixed(2)),
        holdingsCount: snapshot.holdingsCount,
      };

      if (
        existingEntry &&
        existingEntry.portfolioValue === normalizedSnapshot.portfolioValue &&
        existingEntry.invested === normalizedSnapshot.invested &&
        existingEntry.profit === normalizedSnapshot.profit &&
        existingEntry.holdingsCount === normalizedSnapshot.holdingsCount
      ) {
        return currentHistory;
      }

      if (existingEntry) {
        return currentHistory.map((entry) =>
          entry.date === today
            ? {
                ...entry,
                ...normalizedSnapshot,
                date: today,
              }
            : entry
        );
      }

      return [
        ...currentHistory,
        {
          id: crypto.randomUUID(),
          date: today,
          ...normalizedSnapshot,
        },
      ];
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      history,
      recordSnapshot,
    }),
    [history, recordSnapshot]
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error("useHistory must be used inside HistoryProvider");
  }

  return context;
}