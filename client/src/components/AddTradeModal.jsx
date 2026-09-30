import { useState } from "react";
function AddTradeModal({ onClose }) {
    const [tradeType, setTradeType] = useState("BUY");
    const [entryPrice, setEntryPrice] = useState("");
    const [exitPrice, setExitPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [exitDate, setExitDate] = useState("");
    const [rr, setRr] = useState("");
    const [tradeResult, setTradeResult] = useState("win");
    return (
        <div className="add-trade-overlay">
            <div className="add-trade-modal">
                <div className="add-trade-header">
                    <div>
                        <h2>Add Trade</h2>
                        <p>Log your trade details to track performance.</p>
                    </div>

                    <button
                        className="add-trade-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="add-trade-body">
                    <section className="add-trade-section">
                        <div className="add-trade-section-title">
                            <span>▣</span>
                            <h3>Basic Information</h3>
                        </div>

                        <div className="add-trade-basic-grid">
                            <div className="add-trade-field">
                                <label>
                                    Symbol <span>*</span>
                                </label>

                                <select defaultValue="SOLUSD">
                                    <option value="SOLUSD">SOLUSD</option>
                                    <option value="BTCUSD">BTCUSD</option>
                                    <option value="ETHUSD">ETHUSD</option>
                                </select>
                            </div>

                            <div className="add-trade-field">
                                <label>
                                    Type <span>*</span>
                                </label>

                                <div className="add-trade-type-buttons">
                                    <button
                                        type="button"
                                        className={`add-trade-type-button ${tradeType === "BUY" ? "active" : ""
                                            }`}
                                        onClick={() => setTradeType("BUY")}
                                    >
                                        Long
                                    </button>

                                    <button
                                        type="button"
                                        className={`add-trade-type-button short ${tradeType === "SELL" ? "active" : ""
                                            }`}
                                        onClick={() => setTradeType("SELL")}
                                    >
                                        Short
                                    </button>
                                </div>
                            </div>

                            <div className="add-trade-field">
                                <label>Strategy</label>

                                <select defaultValue="Breakout">
                                    <option value="Breakout">Breakout</option>
                                    <option value="Trend Following">
                                        Trend Following
                                    </option>
                                    <option value="Mean Reversion">
                                        Mean Reversion
                                    </option>
                                    <option value="Reversal">Reversal</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    <section className="add-trade-section">
                        <div className="add-trade-section-title">
                            <span>↗</span>
                            <h3>Trade Details</h3>
                        </div>

                        <div className="add-trade-details-grid">
                            <div className="add-trade-field">
                                <label>
                                    Entry Price <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    value={entryPrice}
                                    onChange={(event) => setEntryPrice(event.target.value)}
                                    placeholder="Enter price"
                                />
                            </div>

                            <div className="add-trade-field">
                                <label>
                                    Exit Price <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    value={exitPrice}
                                    onChange={(event) => setExitPrice(event.target.value)}
                                    placeholder="Enter price"
                                />
                            </div>

                            <div className="add-trade-field">
                                <label>
                                    Quantity <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                    placeholder="Enter quantity"
                                />
                            </div>

                            <div className="add-trade-field">
                                <label>
                                    Entry Date <span>*</span>
                                </label>

                                <input
                                    type="date"
                                    value={entryDate}
                                    onChange={(event) => setEntryDate(event.target.value)}
                                />
                            </div>

                            <div className="add-trade-field">
                                <label>
                                    Exit Date <span>*</span>
                                </label>

                                <input
                                    type="date"
                                    value={exitDate}
                                    onChange={(event) => setExitDate(event.target.value)}
                                />
                            </div>

                            <div className="add-trade-field">
                                <label>R:R (Optional)</label>

                                <input
                                    type="text"
                                    value={rr}
                                    onChange={(event) => setRr(event.target.value)}
                                    placeholder="e.g. 1:3"
                                />
                            </div>
                        </div>
                    </section>
                    <section className="add-trade-section">
                        <div className="add-trade-section-title">
                            <span>▥</span>
                            <h3>Results</h3>
                        </div>

                        <div className="add-trade-results-grid">
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

                            <div className="add-trade-field add-trade-result-field">
                                <label>Trade Result</label>

                                <div className="add-trade-result-buttons">
                                    <button
                                        type="button"
                                        className={`add-trade-result-button win ${tradeResult === "win" ? "active" : ""
                                            }`}
                                        onClick={() => setTradeResult("win")}
                                    >
                                        Win
                                    </button>

                                    <button
                                        type="button"
                                        className={`add-trade-result-button loss ${tradeResult === "loss" ? "active" : ""
                                            }`}
                                        onClick={() => setTradeResult("loss")}
                                    >
                                        Loss
                                    </button>

                                    <button
                                        type="button"
                                        className={`add-trade-result-button breakeven ${tradeResult === "breakeven" ? "active" : ""
                                            }`}
                                        onClick={() => setTradeResult("breakeven")}
                                    >
                                        Breakeven
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AddTradeModal;
