import { createContext, useContext, useMemo, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [riskTolerance, setRiskTolerance] = useState("Moderate");
  const [minimumEthicalScore, setMinimumEthicalScore] = useState(80);
  const [longTermSplit, setLongTermSplit] = useState(50);
  const [communityAllocation, setCommunityAllocation] = useState(5);

  const momentumSplit = 100 - longTermSplit;

  function updateLongTermSplit(value) {
    setLongTermSplit(Number(value));
  }

  const settings = useMemo(
    () => ({
      riskTolerance,
      setRiskTolerance,
      minimumEthicalScore,
      setMinimumEthicalScore,
      longTermSplit,
      momentumSplit,
      updateLongTermSplit,
      communityAllocation,
      setCommunityAllocation,
    }),
    [
      riskTolerance,
      minimumEthicalScore,
      longTermSplit,
      momentumSplit,
      communityAllocation,
    ]
  );

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}