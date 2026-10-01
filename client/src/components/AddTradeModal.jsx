import { useState } from "react";

function AddTradeModal({ onClose }) {
    const [symbol, setSymbol] = useState("");
    const [market, setMarket] = useState("crypto");
    const [tradeType, setTradeType] = useState("BUY");
    const [strategyName, setStrategyName] = useState("Breakout");

    const [entryPrice, setEntryPrice] = useState("");
    const [exitPrice, setExitPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [exitDate, setExitDate] = useState("");
    const [rr, setRr] = useState("");

    const [tradeResult, setTradeResult] = useState("win");

    const [notes, setNotes] = useState("");
    const [tags, setTags] = useState("");
    const [currency, setCurrency] = useState("INR");


    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        const tradeData = {
            symbol,
            market,
            tradeType,
            quantity: Number(quantity),
            entryPrice: Number(entryPrice),
            exitPrice: Number(exitPrice),
            entryDate,
            exitDate,
            currency,
            strategyName,
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/trades",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(tradeData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add trade");
            }

            console.log("Trade created:", data);

            // Reset form
            setSymbol("");
            setMarket("crypto");
            setTradeType("BUY");
            setStrategyName("Breakout");
            setEntryPrice("");
            setExitPrice("");
            setQuantity("");
            setEntryDate("");
            setExitDate("");
            setRr("");
            setTradeResult("win");
            setNotes("");
            setTags("");
            setCurrency("INR");

            onClose();
        } catch (error) {
            console.error("Add trade error:", error);
            alert(error.message);
        }
    };

    return (
        <div className="add-trade-overlay">
            <div className="add-trade-modal">

                {/* Header */}
                <div className="add-trade-header">
                    <div>
                        <h2>Add Trade</h2>
                        <p>Log your trade details to track performance.</p>
                    </div>

                    <div className="add-trade-header-actions">
                        <button
                            type="button"
                            className="add-trade-cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="add-trade-submit-button"
                            onClick={handleSubmit}
                        >
                            Add Trade
                        </button>

                        <button
                            type="button"
                            className="add-trade-close"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="add-trade-body">

                    {/* Basic Information */}
                    <section className="add-trade-section">
                        <div className="add-trade-section-title">
                            <span>▣</span>
                            <h3>Basic Information</h3>
                        </div>

                        <div className="add-trade-basic-grid">

                            {/* Symbol */}
                            <div className="add-trade-field">
                                <label>
                                    Symbol <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    value={symbol}
                                    onChange={(event) =>
                                        setSymbol(event.target.value)
                                    }
                                    placeholder="e.g. SOLUSD"
                                />
                            </div>

                            {/* Market */}
                            <div className="add-trade-field">
                                <label>
                                    Market <span>*</span>
                                </label>

                                <select
                                    value={market}
                                    onChange={(event) =>
                                        setMarket(event.target.value)
                                    }
                                >
                                    <option value="stocks">Stocks</option>
                                    <option value="crypto">Crypto</option>
                                    <option value="forex">Forex</option>
                                    <option value="indices">Indices</option>
                                    <option value="commodities">
                                        Commodities
                                    </option>
                                </select>
                            </div>

                            {/* Type */}
                            <div className="add-trade-field">
                                <label>
                                    Type <span>*</span>
                                </label>

                                <div className="add-trade-type-buttons">
                                    <button
                                        type="button"
                                        className={`add-trade-type-button ${tradeType === "BUY" ? "active" : ""
                                            }`}
                                        onClick={() =>
                                            setTradeType("BUY")
                                        }
                                    >
                                        Long
                                    </button>

                                    <button
                                        type="button"
                                        className={`add-trade-type-button short ${tradeType === "SELL" ? "active" : ""
                                            }`}
                                        onClick={() =>
                                            setTradeType("SELL")
                                        }
                                    >
                                        Short
                                    </button>
                                </div>
                            </div>

                            {/* Strategy */}
                            <div className="add-trade-field">
                                <label>Strategy</label>

                                <select
                                    value={strategyName}
                                    onChange={(event) =>
                                        setStrategyName(event.target.value)
                                    }
                                >
                                    <option value="Breakout">
                                        Breakout
                                    </option>

                                    <option value="Trend Following">
                                        Trend Following
                                    </option>

                                    <option value="Mean Reversion">
                                        Mean Reversion
                                    </option>

                                    <option value="Reversal">
                                        Reversal
                                    </option>
                                </select>
                            </div>

                        </div>
                    </section>

                    {/* Trade Details */}
                    <section className="add-trade-section">
                        <div className="add-trade-section-title">
                            <span>↗</span>
                            <h3>Trade Details</h3>
                        </div>

                        <div className="add-trade-details-grid">

                            {/* Entry Price */}
                            <div className="add-trade-field">
                                <label>
                                    Entry Price <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    value={entryPrice}
                                    onChange={(event) =>
                                        setEntryPrice(event.target.value)
                                    }
                                    placeholder="Enter price"
                                />
                            </div>

                            {/* Exit Price */}
                            <div className="add-trade-field">
                                <label>
                                    Exit Price <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    value={exitPrice}
                                    onChange={(event) =>
                                        setExitPrice(event.target.value)
                                    }
                                    placeholder="Enter price"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="add-trade-field">
                                <label>
                                    Quantity <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(event.target.value)
                                    }
                                    placeholder="Enter quantity"
                                />
                            </div>

                            {/* Entry Date */}
                            <div className="add-trade-field">
                                <label>
                                    Entry Date <span>*</span>
                                </label>

                                <input
                                    type="date"
                                    value={entryDate}
                                    onChange={(event) =>
                                        setEntryDate(event.target.value)
                                    }
                                />
                            </div>

                            {/* Exit Date */}
                            <div className="add-trade-field">
                                <label>
                                    Exit Date <span>*</span>
                                </label>

                                <input
                                    type="date"
                                    value={exitDate}
                                    onChange={(event) =>
                                        setExitDate(event.target.value)
                                    }
                                />
                            </div>

                            {/* Risk Reward */}
                            <div className="add-trade-field">
                                <label>R:R (Optional)</label>

                                <input
                                    type="text"
                                    value={rr}
                                    onChange={(event) =>
                                        setRr(event.target.value)
                                    }
                                    placeholder="e.g. 1:3"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Results */}
                    <section className="add-trade-section">
                        <div className="add-trade-section-title">
                            <span>▥</span>
                            <h3>Results</h3>
                        </div>

                        <div className="add-trade-results-grid">

                            {/* P&L */}
                            <div className="add-trade-field">
                                <label>P&amp;L</label>

                                <div className="add-trade-pnl">
                                    <input
                                        type="text"
                                        value="0"
                                        readOnly
                                    />

                                    <span>₹</span>
                                </div>
                            </div>

                            {/* Trade Result */}
                            <div className="add-trade-field add-trade-result-field">
                                <label>Trade Result</label>

                                <div className="add-trade-result-buttons">

                                    <button
                                        type="button"
                                        className={`add-trade-result-button win ${tradeResult === "win"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setTradeResult("win")
                                        }
                                    >
                                        Win
                                    </button>

                                    <button
                                        type="button"
                                        className={`add-trade-result-button loss ${tradeResult === "loss"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setTradeResult("loss")
                                        }
                                    >
                                        Loss
                                    </button>

                                    <button
                                        type="button"
                                        className={`add-trade-result-button breakeven ${tradeResult === "breakeven"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setTradeResult("breakeven")
                                        }
                                    >
                                        Breakeven
                                    </button>

                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Additional Information */}
                    <section className="add-trade-section">
                        <div className="add-trade-section-title">
                            <span>▤</span>
                            <h3>Additional Information</h3>
                        </div>

                        <div className="add-trade-additional-grid">

                            {/* Notes */}
                            <div className="add-trade-field add-trade-notes-field">
                                <label>Notes</label>

                                <textarea
                                    value={notes}
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                    placeholder="Add notes about this trade..."
                                    rows="4"
                                />
                            </div>

                            {/* Tags */}
                            <div className="add-trade-field">
                                <label>Tags</label>

                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(event) =>
                                        setTags(event.target.value)
                                    }
                                    placeholder="e.g. breakout, momentum"
                                />
                            </div>

                            {/* Currency */}
                            <div className="add-trade-field">
                                <label>Currency</label>

                                <select
                                    value={currency}
                                    onChange={(event) =>
                                        setCurrency(event.target.value)
                                    }
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AddTradeModal;