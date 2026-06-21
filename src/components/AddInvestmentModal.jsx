import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

function AddInvestmentModal({ isOpen, onClose }) {
  const { addInvestment } = usePortfolio();

  const [formData, setFormData] = useState({
    ticker: "",
    name: "",
    shares: "",
    costBasis: "",
    currentPrice: "",
    trend: "steady",
    ethicalScore: 80,
  });

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    addInvestment({
      ticker: formData.ticker.toUpperCase(),
      name: formData.name,
      shares: Number(formData.shares),
      costBasis: Number(formData.costBasis),
      currentPrice: Number(formData.currentPrice),
      trend: formData.trend,
      ethicalScore: Number(formData.ethicalScore),
    });

    setFormData({
      ticker: "",
      name: "",
      shares: "",
      costBasis: "",
      currentPrice: "",
      trend: "steady",
      ethicalScore: 80,
    });

    onClose();
  }

  return (
    <div className="modal-backdrop">
      <article className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">New Investment</p>
            <h3>Add a holding</h3>
          </div>

          <button className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="investment-form" onSubmit={handleSubmit}>
          <label>
            Ticker
            <input
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              placeholder="VOO"
              required
            />
          </label>

          <label>
            Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Vanguard S&P 500 ETF"
              required
            />
          </label>

          <label>
            Shares
            <input
              name="shares"
              type="number"
              step="0.01"
              value={formData.shares}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Cost Basis
            <input
              name="costBasis"
              type="number"
              step="0.01"
              value={formData.costBasis}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Current Price
            <input
              name="currentPrice"
              type="number"
              step="0.01"
              value={formData.currentPrice}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Trend
            <select
              name="trend"
              value={formData.trend}
              onChange={handleChange}
            >
              <option value="steady">Steady</option>
              <option value="up">Up</option>
              <option value="fast">Fast</option>
              <option value="down">Down</option>
            </select>
          </label>

          <label>
            Ethical Score
            <input
              name="ethicalScore"
              type="number"
              min="0"
              max="100"
              value={formData.ethicalScore}
              onChange={handleChange}
            />
          </label>

          <button className="primary-button" type="submit">
            Add Investment
          </button>
        </form>
      </article>
    </div>
  );
}

export default AddInvestmentModal;