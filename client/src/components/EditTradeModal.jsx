import { useEffect, useState } from "react";

function EditTradeModal({ trade, onClose, onUpdated }) {
    const [tradeType, setTradeType] = useState("BUY");
    const [strategyName, setStrategyName] = useState("");
    const [entryPrice, setEntryPrice] = useState("");
    const [exitPrice, setExitPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [rr, setRr] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!trade) {
            return;
        }

        setTradeType(trade.tradeType || "BUY");
        setStrategyName(trade.strategyName || "");
        setEntryPrice(trade.entryPrice ?? "");
        setExitPrice(trade.exitPrice ?? "");
        setQuantity(trade.quantity ?? "");
        setRr("");
        setNotes("");
    }, [trade]);

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/trades/${trade.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        tradeType,
                        strategyName,
                        entryPrice: Number(entryPrice),
                        exitPrice:
                            exitPrice === ""
                                ? undefined
                                : Number(exitPrice),
                        quantity: Number(quantity),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update trade"
                );
            }

            console.log("Trade updated:", data);
            onUpdated();
            onClose();

            onClose();
        } catch (error) {
            console.error("Update trade error:", error);
        }
    };

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
                            value={new Date(
                                trade.entryDate
                            ).toLocaleDateString()}
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
                        onClick={handleUpdate}
                    >
                        ✓ Update Trade
                    </button>

                </div>

            </div>
        </div>
    );
}

export default EditTradeModal;