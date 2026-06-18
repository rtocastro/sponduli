import { useSettings } from "../context/SettingsContext";

function Settings() {
  const {
    riskTolerance,
    setRiskTolerance,
    minimumEthicalScore,
    setMinimumEthicalScore,
    longTermSplit,
    momentumSplit,
    updateLongTermSplit,
    communityAllocation,
    setCommunityAllocation,
  } = useSettings();

  return (
    <section className="page-section">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Your investment profile</h2>
        </div>
      </div>

      <div className="settings-grid">
        <article className="settings-card">
          <p className="eyebrow">Risk</p>
          <h3>Risk Tolerance</h3>
          <p>How aggressive should Sponduli be when reviewing opportunities?</p>

          <div className="segmented-control">
            {["Conservative", "Moderate", "Aggressive"].map((option) => (
              <button
                key={option}
                className={riskTolerance === option ? "active" : ""}
                onClick={() => setRiskTolerance(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </article>

        <article className="settings-card">
          <p className="eyebrow">Values</p>
          <h3>Minimum Ethical Score</h3>
          <p>Anything below this should be flagged before adding more money.</p>

          <div className="score-control">
            <strong>{minimumEthicalScore}/100</strong>
            <input
              type="range"
              min="0"
              max="100"
              value={minimumEthicalScore}
              onChange={(event) =>
                setMinimumEthicalScore(Number(event.target.value))
              }
            />
          </div>
        </article>

        <article className="settings-card">
          <p className="eyebrow">Profit Split</p>
          <h3>Reinvestment Formula</h3>
          <p>
            When a position creates profit, this split helps decide where that
            profit should go next.
          </p>

          <div className="split-display">
            <div>
              <span>Long-Term</span>
              <strong>{longTermSplit}%</strong>
            </div>

            <div>
              <span>Momentum</span>
              <strong>{momentumSplit}%</strong>
            </div>
          </div>

          <input
            className="split-range"
            type="range"
            min="0"
            max="100"
            value={longTermSplit}
            onChange={(event) => updateLongTermSplit(event.target.value)}
          />
        </article>

        <article className="settings-card">
          <p className="eyebrow">Community</p>
          <h3>Community Allocation</h3>
          <p>
            A future bucket for Fruitbat-style projects, gardens, resources, and
            local support.
          </p>

          <div className="score-control">
            <strong>{communityAllocation}%</strong>
            <input
              type="range"
              min="0"
              max="25"
              value={communityAllocation}
              onChange={(event) =>
                setCommunityAllocation(Number(event.target.value))
              }
            />
          </div>
        </article>

        <article className="settings-card profile-summary-card">
          <p className="eyebrow">Profile Summary</p>
          <h3>Sponduli Strategy</h3>

          <div className="profile-summary-list">
            <div>
              <span>Risk</span>
              <strong>{riskTolerance}</strong>
            </div>

            <div>
              <span>Minimum Ethical Score</span>
              <strong>{minimumEthicalScore}/100</strong>
            </div>

            <div>
              <span>Profit Split</span>
              <strong>
                {longTermSplit}% long-term / {momentumSplit}% momentum
              </strong>
            </div>

            <div>
              <span>Community Allocation</span>
              <strong>{communityAllocation}%</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Settings;