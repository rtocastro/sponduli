import { useState } from "react";
import {
  ethicalFilters,
  investmentPhilosophy,
} from "../data/mockEthics";

function Ethics() {
  const [filters, setFilters] = useState(ethicalFilters);
  const [philosophy, setPhilosophy] = useState(investmentPhilosophy);
  const [minimumScore, setMinimumScore] = useState(80);

  function toggleFilter(id) {
    setFilters((currentFilters) =>
      currentFilters.map((filter) =>
        filter.id === id
          ? { ...filter, enabled: !filter.enabled }
          : filter
      )
    );
  }

  function togglePhilosophy(id) {
    setPhilosophy((currentPhilosophy) =>
      currentPhilosophy.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  }

  const activeFilters = filters.filter((filter) => filter.enabled);

  return (
    <section className="page-section">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Ethics</p>
          <h2>Your investment values</h2>
        </div>
      </div>

      <div className="ethics-grid">
        <article className="ethics-card">
          <p className="eyebrow">Avoid / Flag</p>
          <h3>Ethical Filters</h3>
          <p>
            Sponduli will use these as personal values filters when reviewing
            investments.
          </p>

          <div className="checkbox-list">
            {filters.map((filter) => (
              <label className="check-row" key={filter.id}>
                <input
                  type="checkbox"
                  checked={filter.enabled}
                  onChange={() => toggleFilter(filter.id)}
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="ethics-card">
          <p className="eyebrow">Minimum Standard</p>
          <h3>Ethical Score</h3>
          <p>
            Investments below this score should be flagged before you consider
            adding more money.
          </p>

          <div className="score-control">
            <strong>{minimumScore}/100</strong>
            <input
              type="range"
              min="0"
              max="100"
              value={minimumScore}
              onChange={(event) => setMinimumScore(Number(event.target.value))}
            />
          </div>
        </article>

        <article className="ethics-card">
          <p className="eyebrow">Strategy</p>
          <h3>Investment Philosophy</h3>
          <p>
            This helps Sponduli understand the kind of money moves you prefer.
          </p>

          <div className="checkbox-list">
            {philosophy.map((item) => (
              <label className="check-row" key={item.id}>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => togglePhilosophy(item.id)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="ethics-card summary-card">
          <p className="eyebrow">Current Profile</p>
          <h3>Sponduli should avoid</h3>

          <div className="filter-pill-wrap">
            {activeFilters.map((filter) => (
              <span className="filter-pill" key={filter.id}>
                {filter.label}
              </span>
            ))}
          </div>

          <p className="ethics-note">
            Later, this page will connect to the recommendation logic so
            flagged categories affect watchlist scoring.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Ethics;