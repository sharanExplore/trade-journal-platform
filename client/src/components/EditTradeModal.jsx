import { useState } from "react";

function EditTradeModal({ trade, onClose }) {
    const [tradeType, setTradeType] = useState(trade?.tradeType || "BUY");
    const [strategyName, setStrategyName] = useState(
        trade?.strategyName || ""
    );
    const [entryPrice, setEntryPrice] = useState(trade?.entryPrice || "");
    const [exitPrice, setExitPrice] = useState(trade?.exitPrice || "");
    const [quantity, setQuantity] = useState(trade?.quantity || "");
    const [rr, setRr] = useState("");
    const [notes, setNotes] = useState("");

    if (!trade) {
        return null;
    }

    return (
        <div className="edit-trade-overlay">
            <div className="edit-trade-modal">

                <div className="edit-trade-header">
                    <div>
                        <h2>Edit Trade</h2>
                        <p>Update the details of your trade</p>
                    </div>

                    <button
                        className="edit-trade-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="edit-trade-form">

                    <div className="edit-trade-field">
                        <label>Date</label>
                        <input
                            type="text"
                            value={trade.entryDate}
                            readOnly
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>Symbol</label>
                        <input
                            type="text"
                            value={trade.symbol}
                            readOnly
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>Type</label>

                        <div className="edit-trade-type-buttons">
                            <button
                                type="button"
                                className={
                                    tradeType === "BUY"
                                        ? "active"
                                        : ""
                                }
                                onClick={() => setTradeType("BUY")}
                            >
                                ↗ Long
                            </button>

                            <button
                                type="button"
                                className={
                                    tradeType === "SELL"
                                        ? "active short"
                                        : ""
                                }
                                onClick={() => setTradeType("SELL")}
                            >
                                ↘ Short
                            </button>
                        </div>
                    </div>

                    <div className="edit-trade-field">
                        <label>Strategy</label>
                        <input
                            type="text"
                            value={strategyName}
                            onChange={(event) =>
                                setStrategyName(event.target.value)
                            }
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>Entry Price</label>
                        <input
                            type="number"
                            value={entryPrice}
                            onChange={(event) =>
                                setEntryPrice(event.target.value)
                            }
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>Exit Price</label>
                        <input
                            type="number"
                            value={exitPrice}
                            onChange={(event) =>
                                setExitPrice(event.target.value)
                            }
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(event.target.value)
                            }
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>P&L (Auto)</label>
                        <input
                            type="text"
                            value={trade.pnl ?? "-"}
                            readOnly
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>R:R</label>
                        <input
                            type="text"
                            value={rr}
                            onChange={(event) =>
                                setRr(event.target.value)
                            }
                            placeholder="e.g. 1:3"
                        />
                    </div>

                    <div className="edit-trade-field">
                        <label>Notes</label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(event) =>
                                setNotes(event.target.value)
                            }
                            placeholder="Add any notes..."
                        />
                    </div>

                </div>

                <div className="edit-trade-footer">
                    <button
                        className="edit-trade-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="edit-trade-update"
                        onClick={() => console.log({
                            tradeId: trade.id,
                            tradeType,
                            strategyName,
                            entryPrice,
                            exitPrice,
                            quantity,
                            rr,
                            notes,
                        })}
                    >
                        ✓ Update Trade
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditTradeModal;