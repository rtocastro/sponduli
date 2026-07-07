import { createContext, useContext, useEffect, useState } from "react";

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("sponduli-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("sponduli-history", JSON.stringify(history));
  }, [history]);

  function recordSnapshot(snapshot) {
    const today = new Date().toISOString().split("T")[0];

    setHistory((currentHistory) => {
      const alreadyRecordedToday = currentHistory.some(
        (entry) => entry.date === today
      );

      if (alreadyRecordedToday) {
        return currentHistory.map((entry) =>
          entry.date === today ? { ...entry, ...snapshot, date: today } : entry
        );
      }

      return [
        ...currentHistory,
        {
          id: crypto.randomUUID(),
          date: today,
          ...snapshot,
        },
      ];
    });
  }

  return (
    <HistoryContext.Provider value={{ history, recordSnapshot }}>
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