import { createContext, useContext, useEffect, useState } from "react";

const TimelineContext = createContext();

export function TimelineProvider({ children }) {
  const [timeline, setTimeline] = useState(() => {
    const saved = localStorage.getItem("sponduli-timeline");

    if (saved) {
      return JSON.parse(saved);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "sponduli-timeline",
      JSON.stringify(timeline)
    );
  }, [timeline]);

  function addTimelineEntry(entry) {
    setTimeline((current) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...current,
    ]);
  }

  return (
    <TimelineContext.Provider
      value={{
        timeline,
        addTimelineEntry,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  return useContext(TimelineContext);
}