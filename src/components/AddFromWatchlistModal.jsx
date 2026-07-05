import { useState } from "react";
// import { usePortfolio } from "../context/PortfolioContext";
import { useTransactions } from "../context/TransactionContext";

function AddFromWatchlistModal({ item, isOpen, onClose }) {
    const { addBuyTransaction } = useTransactions();
    const [amountInvested, setAmountInvested] = useState("");

    if (!isOpen || !item) return null;

    const buyPrice = item.currentPrice || 100;
    const shares = amountInvested ? Number(amountInvested) / buyPrice : 0;

function handleSubmit(event) {
  event.preventDefault();

  const buyPrice = item.currentPrice || 0;
  const amount = Number(amountInvested);
  const shares = buyPrice > 0 ? amount / buyPrice : 0;

  const transaction = {
    ticker: item.ticker,
    name: item.name,
    amount,
    shares: Number(shares.toFixed(6)),
    buyPrice,
    ethicalScore: item.ethicalScore,
    source: "opportunities",
    decisionSnapshot: item.decision || null,
    evidenceSnapshot: {
      evidenceScore: item.evidenceScore,
      newsCount: item.newsCount,
      earningsCount: item.earningsCount,
      reasons: item.evidenceReasons || [],
    },
  };

  addBuyTransaction(transaction);

  addTimelineEntry({
    type: "buy",
    ticker: item.ticker,
    name: item.name,
    amountInvested: amount,
    shares: Number(shares.toFixed(6)),
    buyPrice,
    ethicalScore: item.ethicalScore,
    sponduliScore: item.decision?.score || null,
  });

  setAmountInvested("");
  onClose();
}

    return (
        <div className="modal-backdrop">
            <article className="modal-card">
                <div className="modal-header">
                    <div>
                        <p className="eyebrow">Add to Portfolio</p>
                        <h3>{item.ticker}</h3>
                        <p>{item.name}</p>
                    </div>

                    <button className="ghost-button" onClick={onClose}>
                        Close
                    </button>
                </div>

                <form className="investment-form simple-investment-form" onSubmit={handleSubmit}>
                    <label>
                        How much are you investing?
                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={amountInvested}
                            onChange={(event) => setAmountInvested(event.target.value)}
                            placeholder="50"
                            required
                        />
                    </label>

                    <div className="investment-preview">
                        <div>
                            <span>Estimated Buy Price</span>
                            <strong>${buyPrice.toFixed(2)}</strong>
                        </div>

                        <div>
                            <span>Estimated Shares</span>
                            <strong>{shares.toFixed(4)}</strong>
                        </div>

                        <div>
                            <span>Ethical Score</span>
                            <strong>{item.ethicalScore}/100</strong>
                        </div>
                    </div>

                    <button className="primary-button" type="submit">
                        Add This Investment
                    </button>
                </form>
            </article>
        </div>
    );
}

export default AddFromWatchlistModal;