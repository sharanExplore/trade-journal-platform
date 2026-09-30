function AddTradeModal({ onClose }) {
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
                                        className="add-trade-type-button active"
                                    >
                                        Long
                                    </button>

                                    <button
                                        type="button"
                                        className="add-trade-type-button short"
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
                </div>
            </div>
        </div>
    );
}

export default AddTradeModal;
